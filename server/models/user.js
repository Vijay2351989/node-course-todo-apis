const {mongoose} = require("../db/mongoose.js");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
// validate : (value) => {
//   return validator.isEmail(value);
// },


var userSchema = new mongoose.Schema( {
email : {
  type : String,
  required : true,
  trim : true,
  minlength : 1,
  unique  :true,
  validate : {
    validator : validator.isEmail,
    message : "{VALUE} is not a valid email"
  }
},

password : {
type : String,
required : true,
minlength : 6
},

tokens :[{
  access : {
    type : String,
    required : true
  },

  token : {
    type : String,
    required : true
  }
}]
});

userSchema.pre("save",function (next){
  var user = this;
  if(user.isModified('password'))
  {
    bcrypt.genSalt(10, (err,salt) => {
      bcrypt.hash(user.password,salt,(err,hash) => {
        user.password = hash;
        next();
      });
    });
  }
  else {
    next();
  }

});

userSchema.statics.findByToken = function(token) {
var User = this;
var decoded;
try{
  decoded = jwt.verify(token, "abc123");
}
catch (e)
{

  return Promise.reject();
}

return User.findOne({
  _id : decoded._id,
  'tokens.access' : 'auth',
  'tokens.token' : token
});

};

userSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject , ['email' , '_id']);
};

userSchema.methods.generateAuthToken = function() {
  var user = this;

  var access = "auth";
  var token = jwt.sign({_id : user._id.toHexString() , access} , "abc123").toString();

  user.tokens = user.tokens.concat([{access,token}]);

  return user.save().then(() => {
    return token;
  });
};

var User = mongoose.model("User" ,userSchema);
module.exports.User = User;
