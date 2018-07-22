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

app.post("/todos" , (req, res) => {
  console.log(req.body);

  var todo = new Todo({
    text : req.body.text
  });

  todo.save().then( (result) => {
    res.send(result);
  } , (err) => {
    res.status(400).send(err);
  });
});

app.get("/todos", (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (err) => {
      res.status(400).send(err);
  });
});


app.get("/todos/:id" ,(req,res) => {
  var id = req.params.id;
  console.log(id);
  if(!ObjectID.isValid(id))
  {
    return res.status(404).send({});
  }
  Todo.findById(id).then((todo) =>{
    if(!todo)
    {
      return res.status(404).send({});
    }
    res.send({todo});
  }, (err) => {
    res.status(400).send();
  });
});

app.delete("/todos/:id" , (req,res) => {
  var id = req.params.id;
   if(!ObjectID.isValid(id))
  {
    return res.status(404).send({});
   }
  Todo.findByIdAndRemove(id).then((result) => {
    if(!result)
    {
      return res.status(404).send({});
    }
    res.send({result});
  }).catch((err) =>{
    res.status(400).send();
  });
});


app.patch("/todos/:id", (req,res) => {
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

  Todo.findByIdAndUpdate(id ,{$set : body}, {new : true}).then((result)=> {
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




app.post("/users/me" , authenticate,  (req, res) => {
  res.send(req.user);
});

app.listen(port , () => {
  console.log(`Started on port ${port}`);
});

module.exports.app =app;
