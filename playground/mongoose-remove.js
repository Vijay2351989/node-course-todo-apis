const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {User} = require("./../server/models/user");
const {Todo} = require("./../server/models/todo");
var id = "5b515f53ac7ba5701ae9bb3e";

// if(!ObjectID.isValid(id))
// {
//   console.log("Object Id is not valid");
// }

// Todo.remove({}).then( (result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove({_id : id}).then((result) => {
//   console.log(result);
// });

Todo.findByIdAndRemove(id).then((result) => {
  console.log(result);
});
