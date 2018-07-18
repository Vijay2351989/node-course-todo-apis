var {MongoClient , ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/ToDoApp" , (err, db) => {
  if(err)
  {
    return console.log("Unable to connect ot the database");
  }
  console.log("Connected to database successfully");

  // db.collection("Todo").find({completed:false}).toArray().then((docs) => {
  //   console.log("ToDos")
  //   console.log(JSON.stringify(docs,undefined,2));
  // }, (err) => {
  //   console.log("Unable to fetch todo data");
  // });

   // db.collection("Todo").find({_id:new ObjectID("5b4ecef431bf803efcea7ab7")}).toArray().then((docs) => {
   //   console.log("ToDos")
   //   console.log(JSON.stringify(docs,undefined,2));
   // }, (err) => {
   //   console.log("Unable to fetch todo data");
   // });

   // db.collection("Todo").find().count().then((count) => {
   //   console.log("ToDos count",count);
   // }, (err) => {
   //   console.log("Unable to fetch todo data");
   // });

   db.collection("Users").find({name:"Vijay"}).toArray().then((docs) => {
     console.log("Users with name Vijay");
     console.log(JSON.stringify(docs,undefined,2));
   }, (err) => {
     console.log("Error in fetching data");
   });

 //db.close();
});
