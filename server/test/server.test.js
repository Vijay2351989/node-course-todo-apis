const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {ObjectID} = require("mongodb");

var objectId1 = new ObjectID();

var todos = [{
  _id : new ObjectID(),
  text : "First test todo."
},
{
  _id : new ObjectID(),
  text : "Second test todo.",
  completed : true,
  completedAt : 123
}];

beforeEach((done) => {
Todo.remove({}).then(() => {
  return Todo.insertMany(todos);
}).then(() => done());
});


describe("POST /todos" , () => {

  it("Should create a new todo" , (done) => {
    var text = "Test todo text";

    request(app).
    post("/todos").
    send({text}).
    expect(200).
    expect( (res) => {
      expect(res.body.text).toBe(text);
    }).
    end((err,res) => {
      if (err)
      {
        return done(err);
      }
      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => {
        done(e);
      });
    });
  });



  it("Should not create a new todo" , (done) => {


    request(app).
    post("/todos").
    send({}).
    expect(400).
    end((err,res) => {
      if (err)
      {
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => {
        done(e);
      });
    });
  });

});


describe("#GET /todos", () => {

  it("Should get all todos" , (done) => {

    var text = "Test todo text";

    request(app).
    get("/todos").
    expect(200).
    expect((res) => {
      expect(res.body.todos.length).toBe(2);
    }).
    end(done);
  });
});


describe("#GET todos/:id" , () => {
  it("Return 404 if object id is not in correct format", (done) => {
    request(app).
    get("/todos/123").
    expect(404).
    end(done);
  });

  it("Return 404 if todo doc does not exist for a given object id" ,(done) => {
   var hexIdString = new ObjectID().toHexString();



    request(app).
    get(`/todos/${hexIdString}`).
    expect(404).
    end(done);
  });

  it("Return todo doc for a given object id" , (done) => {
    request(app).
    get(`/todos/${todos[0]._id.toHexString()}`).
    expect(200).
    expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    }).
    end(done);
  });
});



describe("#DELETE /todos/:id" , () => {
  it("Returns doc not found for invalid object id" ,(done) => {
    request(app).
    delete("/todos/123").
    expect(404).
    end(done);
  });

  it("Returns doc not found for non existing object id" ,(done) => {
   var id = new ObjectID().toHexString();
    request(app).
    delete(`/todos/${id}`).
    expect(404).
    end(done);
  });

  it("Removes the doc with the given object id", (done) => {
    request(app).
    delete(`/todos/${todos[0]._id.toHexString()}`).
    expect(200).
    expect( (res) => {
      expect(res.body.result.text).toBe(todos[0].text);
    }).
    end((err, res) => {
       if(err)
       {
         return done(err);
       }

       Todo.findById(`${todos[0]._id.toHexString()}`).then( (result) => {
           //expect(result).toBe(null);
           expect(result).toNotExist();
           done();
       }).catch((err) =>
       {
         done(e);
       });
    });
  });
  });

  describe("#PATCH /todos/:id" , () => {
    it("Returns doc not found for invalid object id" ,(done) => {
      request(app).
      patch("/todos/123").
      send({completed : true}).
      expect(404).
      end(done);
    });

    it("Returns doc not found for non existing object id" ,(done) => {
     var id = new ObjectID().toHexString();
      request(app).
      patch(`/todos/${id}`).
      send({completed : true}).
      expect(404).
      end(done);
    });

    it("Returns doc with updated details" ,(done) => {
      var text = "Updated text for completed task";
      request(app).
      patch(`/todos/${todos[0]._id.toHexString()}`).
      send({completed : true, text}).
      expect(200).
      expect((res) => {
        expect(res.body.result.completed).toBe(true);
        expect(res.body.result.text).toBe(text);
        expect(res.body.result.completedAt).toBeA("number");
      })
      .end((err, res) => {
         if(err)
         {
           return done(err);
         }

         Todo.findById(`${todos[0]._id.toHexString()}`).then( (result) => {
             //expect(result).toBe(null);
             expect(result.completed).toBe(true);
             expect(result.text).toBe(text);
             expect(result.completedAt).toBeA("number");
             done();
         }).catch((err) =>
         {
           done(e);
         });
      });
    });

  it("Returns doc with updated details with completedAt set to null" ,(done) => {
  var text = "Updated text for uncompleted task";
    request(app).
    patch(`/todos/${todos[1]._id.toHexString()}`).
    send({completed : false,text}).
    expect(200).
    expect((res) => {
      expect(res.body.result.completed).toBe(false);
      expect(res.body.result.text).toBe(text);
      expect(res.body.result.completedAt).toNotExist();
    })
    .end((err, res) => {
       if(err)
       {
         return done(err);
       }

       Todo.findById(`${todos[1]._id.toHexString()}`).then( (result) => {
           //expect(result).toBe(null);
           expect(result.completedAt).toNotExist();
           expect(result.completed).toBe(false);
             expect(result.text).toBe(text);
           done();
       }).catch((err) =>
       {
         done(e);
       });
    });
  });
});
