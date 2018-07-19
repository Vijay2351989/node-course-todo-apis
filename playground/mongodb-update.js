var {MongoClient , ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/ToDoApp" , (err, db) => {
  if(err)
  {
    return console.log("Unable to connect ot the database");
  }
  console.log("Connected to database successfully");


 //  db.collection("Todo").findOneAndUpdate({_id : new ObjectID("5b501d31209a612f2b4212c1")},
 //  {
 //    $set : {
 //    completed : true
 //  }
 // },
 // {returnOriginal : false}).then((result) => {
 //   console.log(JSON.stringify(result,undefined,2));
 // });



 db.collection("Users").findOneAndUpdate({_id : new ObjectID("5b4f48e49a494d3644e5e383")},
 {
   $set : {
   name : "Vijay"
 },

 $inc : {
   age : 1
 }
},
{returnOriginal : false}).then((result) => {
  console.log(JSON.stringify(result,undefined,2));
});



 db.close();
});
