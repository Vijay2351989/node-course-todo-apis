const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

const {mongoose} = require("./db/mongoose.js");
const {Todo} = require("./models/todo.js");
const {User} = require("./models/user.js");

var app = express();

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
    res.status(400).send(err);
  });
});

app.listen(3000 , () => {
  console.log("Started on port 3000");
});

module.exports.app =app;
