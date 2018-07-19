const express = require("express");
const bodyParser = require("body-parser");

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
    console.log(JSON.stringify(result,undefined,2));
    res.send(result);
  } , (err) => {
    console.log("Unable to save todo");
    res.status(400).send(e);
  });
});

app.listen(3000 , () => {
  console.log("Started on port 3000");
});
