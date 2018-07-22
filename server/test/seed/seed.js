const {Todo} = require("./../../models/todo");
const {User} = require("./../../models/user");
const {ObjectID} = require("mongodb");
const jwt=require("jsonwebtoken");

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

var users = [{
  _id : userOneId,
  email : "vjbhatt760@gmail.com",
  password : "userOnePassword",
  tokens : [{
    access : "auth",
    token : jwt.sign({_id : userOneId,access : "auth"} , "abc123").toString()
  }]
},
{
  _id : userTwoId,
  email : "rachita@gmail.com",
  password : "userTwoPassword"
}];

var populateUsers = (done) =>{
  User.remove({}).then(() => {
    var user1 = new User(users[0]).save();
    var user2 = new User(users[1]).save();

    return Promise.all([user1,user2]);
  }).
  then(()=>{
    done();
  });
};

var todos = [{
  _id : new ObjectID(),
  text : "First test todo."
},
{
  _id : new ObjectID(),
  text : "Second test todo.",
  completed : true,
  completedAt : 123
}];

var populateTodos = (done) =>{
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).
  then(()=>{
    done();
  });
};

module.exports = {todos,populateTodos,users,populateUsers};
