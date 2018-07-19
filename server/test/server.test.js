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
  text : "Second test todo."
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
