const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {User} = require("./../server/models/user");

var id = "5b502b83035df23c3db7a776";

if(!ObjectID.isValid(id))
{
  console.log("Object Id is not valid");
}

// User.find({_id : id}).then((users) => {
//   if(users.length===0)
//   {
//     return console.log("No users exist with given id");
//   }
//   console.log("Users",users)
// }).catch( (e) => {
//   console.log(e);
// })
//
// User.findOne({_id:id}).then((user) => {
//   if(!user)
//   {
//     return console.log("No user exist with given id");
//   }
//   console.log("User ",user);
// }).catch( (e) => {
//   console.log(e);
// })


User.findById(id).then ( (user) => {
  if(!user)
  {
    return console.log("No user by id exist with given id");
  }
  console.log("User By Id",user);
}, (e) => {
    console.log("Error is "+e);
});
