var MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/ToDoApp" , (err, db) => {
  if(err)
  {
    return console.log("Unable to connect ot the database");
  }
  console.log("Connected to database successfully");

   // db.collection("Todo").insertOne({text:"Something to do", completed : false},(err,result) => {
   //
   //   if(err)
   //   {
   //     return console.log("Unable to insert data");
   //   }
   //   else {
   //     console.log(JSON.stringify(result.ops,undefined,2));
   //   }
   // });

   db.collection("Users").insertOne({name:"Sudhir",age:29,location:"Pune"},(err,result) => {
     if(err)
     {
        return console.log("Unable to insert data");
     }
     else {
       console.log(JSON.stringify(result.ops,undefined,2));
     }
   })


  db.close();
});
