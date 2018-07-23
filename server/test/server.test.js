const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");
const {ObjectID} = require("mongodb");
const {todos,populateTodos,users,populateUsers} = require("./seed/seed");


beforeEach(populateUsers);
beforeEach(populateTodos);


describe("POST /todos" , () => {

  it("Should create a new todo" , (done) => {
    var text = "Test todo text";

    request(app).
    post("/todos").
    set("x-auth" , users[0].tokens[0].token).
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
    set("x-auth" , users[0].tokens[0].token).
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
    set("x-auth" , users[0].tokens[0].token).
    expect(200).
    expect((res) => {
      expect(res.body.todos.length).toBe(1);
    }).
    end(done);
  });
});


describe("#GET todos/:id" , () => {
  it("Return 404 if object id is not in correct format", (done) => {
    request(app).
    get("/todos/123").
    set("x-auth" , users[0].tokens[0].token).
    expect(404).
    end(done);
  });

  it("Return 404 if todo doc does not exist for a given object id" ,(done) => {
   var hexIdString = new ObjectID().toHexString();
    request(app).
    get(`/todos/${hexIdString}`).
    set("x-auth" , users[0].tokens[0].token).
    expect(404).
    end(done);
  });

  it("Return todo doc for a given object id" , (done) => {
    request(app).
    get(`/todos/${todos[0]._id.toHexString()}`).
    set("x-auth" , users[0].tokens[0].token).
    expect(200).
    expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    }).
    end(done);
  });

  it("Did not Return todo doc for a given object id" , (done) => {
    request(app).
    get(`/todos/${todos[1]._id.toHexString()}`).
    set("x-auth" , users[0].tokens[0].token).
    expect(404).
    end(done);
  });
});



describe("#DELETE /todos/:id" , () => {
  it("Returns doc not found for invalid object id" ,(done) => {
    request(app).
    delete("/todos/123").
    set("x-auth" , users[0].tokens[0].token).
    expect(404).
    end(done);
  });

  it("Returns doc not found for non existing object id" ,(done) => {
   var id = new ObjectID().toHexString();
    request(app).
    delete(`/todos/${id}`).
    set("x-auth" , users[0].tokens[0].token).
    expect(404).
    end(done);
  });

  it("Removes the doc with the given object id", (done) => {
    request(app).
    delete(`/todos/${todos[0]._id.toHexString()}`).
    set("x-auth" , users[0].tokens[0].token).
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


  it("Did not removes the doc with the given object id", (done) => {
    request(app).
    delete(`/todos/${todos[1]._id.toHexString()}`).
    set("x-auth" , users[0].tokens[0].token).
    expect(404).
    end((err, res) => {
       if(err)
       {
         return done(err);
       }

       Todo.findById(`${todos[1]._id.toHexString()}`).then( (result) => {
           //expect(result).toBe(null);
           expect(result).toExist();
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
      set("x-auth" , users[0].tokens[0].token).
      send({completed : true}).
      expect(404).
      end(done);
    });

    it("Returns doc not found for non existing object id" ,(done) => {
     var id = new ObjectID().toHexString();
      request(app).
      patch(`/todos/${id}`).
      set("x-auth" , users[0].tokens[0].token).
      send({completed : true}).
      expect(404).
      end(done);
    });

    it("Returns doc with updated details" ,(done) => {
      var text = "Updated text for completed task";
      request(app).
      patch(`/todos/${todos[0]._id.toHexString()}`).
        set("x-auth" , users[0].tokens[0].token).
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
           done(err);
         });
      });
    });


    it("Details not updated" ,(done) => {
      var text = "Updated text for completed task";
      request(app).
      patch(`/todos/${todos[0]._id.toHexString()}`).
        set("x-auth" , users[1].tokens[0].token).
      send({completed : true, text}).
      expect(404).
      end((err, res) => {
         if(err)
         {
           return done(err);
         }

         Todo.findById(`${todos[0]._id.toHexString()}`).then( (result) => {
             //expect(result).toBe(null);
             expect(result.completed).toBe(false);
             expect(result.text).toNotBe(text);
             expect(result.completedAt).toNotExist();
             done();
         }).catch((err) =>
         {
           done(err);
         });
      });
    });

  it("Returns doc with updated details with completedAt set to null" ,(done) => {
  var text = "Updated text for uncompleted task";
    request(app).
    patch(`/todos/${todos[1]._id.toHexString()}`).
    set("x-auth" , users[1].tokens[0].token).
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
         done(err);
       });
    });
  });
});


describe("#GET /users/me" , () => {

 it("should return authenticated user" , (done) => {
   request(app).
   get("/users/me").
   set("x-auth" , users[0].tokens[0].token).
   expect(200).
   expect((res) => {
     expect(res.body._id).toBe(users[0]._id.toHexString());
     expect(res.body.email).toBe(users[0].email);
   }).
   end(done);
 });

 it("should return 401 if not authenticated user" , (done) => {
   request(app).
   get("/users/me").
   expect(401).
   expect((res) => {
     expect(res.body).toEqual({});
   }).
   end(done);
 });


});


describe("# POST /users", () => {

  it("Should create a new user" ,(done) => {
    var email = "ankit_j@gmail.com";
    var password = "abc123!";

    request(app).
    post("/users").
    send({email,password}).
    expect(200).
    expect((res) =>{
      expect(res.headers["x-auth"]).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    }).
    end((err) => {
        if(err)
        {
        return  done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch ((e) => {
          done(e);
        });

    });
  });

  it("should return validation error if request is invalid" ,(done) => {
    var email = "ankit_jgmail.com";
    var password = "abc12";

    request(app).
    post("/users").
    send({email,password}).
    expect(400).
    end(done);
    });

    it("should not create user if email is not valid" ,(done) => {
      var email = users[0].email;
      var password = "abc123!";

      request(app).
      post("/users").
      send({email,password}).
      expect(400).
      end(done);
      });

});


 describe("# POST /users/login", () => {

  it("Should login user and return auth token" ,(done) => {
    var email = users[1].email;
    var password = users[1].password;

    request(app).
    post("/users/login").
    send({email,password}).
    expect(200).
    expect((res) =>{
      expect(res.headers["x-auth"]).toExist();
    }).
    end((err,res) => {
        if(err)
        {
        return  done(err);
        }
        User.findById(users[1]._id).then((user) => {

          expect(user.tokens[1]).toInclude({
            access:"auth",
            token:res.headers["x-auth"]
          });
          done();
        }).catch ((e) => {
          done(e);
        });

    });
  });

  it("should return 400 if user not found" ,(done) => {
    var email = users[1].email;
    var password = users[1].password+1;

    request(app).
    post("/users/login").
    send({email,password}).
    expect(400).
    expect((res) =>{
      expect(res.headers["x-auth"]).toNotExist();
    }).
    end((err,res) => {
        if(err)
        {
        return  done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch ((e) => {
          done(e);
        });

    });
    });

});
    describe("#DELETE users/me/token" , () => {
      it("Delete user token on logout" , (done) => {
        console.log(users[0].tokens[0].token);
        request(app).
        delete("/users/me/token").
        set("x-auth", users[0].tokens[0].token).
        expect(200).
        end((err,res) => {
          if(err)
          {
            return done(err);
          }
          User.findById(users[0]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch ((e) => {
            done(e);
          });
        });
      });
    });
