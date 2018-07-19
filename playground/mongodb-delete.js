var {MongoClient , ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/ToDoApp" , (err, db) => {
  if(err)
  {
    return console.log("Unable to connect ot the database");
  }
  console.log("Connected to database successfully");

  // db.collection("Todo").deleteOne({text : "Eat lunch"}).then((result) => {
  //   console.log(JSON.stringify(result,undefined,2));
  // });
  //
  // db.collection("Todo").deleteMany({text : "Eat lunch"}).then((result) => {
  //   console.log(JSON.stringify(result,undefined,2));
  // });

  // db.collection("Todo").findOneAndDelete({text : "Walk the dog"}).then((result) => {
  //   console.log(JSON.stringify(result,undefined,2));
  // });


  // db.collection("Users").deleteMany({name : "Vijay"}).then((result) =>{
  //   console.log(JSON.stringify(result,undefined,2));
  // });

  db.collection("Users").findOneAndDelete({_id : new ObjectID("5b4f48d411a34c3e5cf727eb")}).then((result) =>{
    console.log(JSON.stringify(result,undefined,2));
  })


 db.close();
});
