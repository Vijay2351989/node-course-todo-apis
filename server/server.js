const config = require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

const {mongoose} = require("./db/mongoose.js");
const {Todo} = require("./models/todo.js");
const {User} = require("./models/user.js");
const {authenticate} = require("./middleware/authenticate.js")
const _ = require("lodash");

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post("/todos" , authenticate ,  (req, res) => {
  console.log(req.body);

  var todo = new Todo({
    text : req.body.text,
    _creator : req.user._id
  });

  todo.save().then( (result) => {
    res.send(result);
  } , (err) => {
    res.status(400).send(err);
  });
});

app.get("/todos", authenticate, (req, res) => {
  Todo.find({_creator : req.user._id}).then((todos) => {
    res.send({todos});
  }, (err) => {
      res.status(400).send(err);
  });
});


app.get("/todos/:id" , authenticate , (req,res) => {
  var id = req.params.id;
  console.log(id);
  if(!ObjectID.isValid(id))
  {
    return res.status(404).send({});
  }
  Todo.findOne({_id : id , _creator : req.user._id}).then((todo) =>{
    if(!todo)
    {
      return res.status(404).send({});
    }
    res.send({todo});
  }, (err) => {
    res.status(400).send();
  });
});

app.delete("/todos/:id" , authenticate , (req,res) => {
  var id = req.params.id;
   if(!ObjectID.isValid(id))
  {
    return res.status(404).send({});
   }
  Todo.findOneAndRemove({_id : id , _creator : req.user._id}).then((result) => {
    if(!result)
    {
      return res.status(404).send({});
    }
    res.send({result});
  }).catch((err) =>{
    res.status(400).send();
  });
});


app.patch("/todos/:id", authenticate,  (req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id))
 {
   return res.status(404).send({});
  }

  var body = _.pick(req.body , ['text' , 'completed']);

  if(_.isBoolean(body.completed) && body.completed)
  {
      body.completedAt = new Date().getTime();
  }
  else
  {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id : id , _creator : req.user._id} ,{$set : body}, {new : true}).then((result)=> {
    if(!result)
    {
      return res.status(404).send({});
    }
    res.send({result});
  }).catch((err) =>{
    res.status(400).send();
  });

});



app.post("/users" , (req, res) => {

  var user = _.pick(req.body , ['email','password']);

  var userObj = new User(user);

  userObj.save().then(() => {
    return userObj.generateAuthToken();
  }).
  then((token) =>{
    res.header('x-auth' ,token).send(userObj);
  }).catch((err) =>{

    res.status(400).send(err);
  });
});


app.post("/users/login" , (req,res) => {
  var userObj = _.pick(req.body, ['email','password']);
  User.findByCredentials(userObj.email,userObj.password).then((user) => {
    user.generateAuthToken().then((token) =>{
       res.header('x-auth' ,token).send(user);
     });
  })
  .catch((err) => {
    res.status(400).send();
  });
});




app.get("/users/me" , authenticate,  (req, res) => {
  res.send(req.user);
});

app.delete("/users/me/token" , authenticate, (req,res) => {
  var user = req.user;
  user.removeToken(req.token).then(()=>{
    res.send();
  },()=>{
    res.status(400).send();
  });
});

app.listen(port , () => {
  console.log(`Started on port ${port}`);
});

module.exports.app =app;
