const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const {closeServer, runServer, app} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {User} = require('../models');

chai.use(chaiHttp);

describe('Hypatia API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

describe('new user page', function() {
 it('should return a new user page', function() {
   return chai.request(app)
   .get('/newUser')
   .then(res => {
     res.should.have.status(200);
     res.should.be.html;
   });
  });
});

describe('new user post endpoint', function() {
  it('should return a new user', function() {
    const newUser = {username: "garbage" , password: "test"};
    return chai.request(app)
        .post('/newUser')
        .send(newUser)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'username', 'id');
          res.body.username.should.equal(newUser.username);
          // cause Mongo should have created id on insertion
          res.body.id.should.not.be.null;
          return User.findById(res.body.id);
        })
        .then(function(user) {
          user.username.should.equal(newUser.username);
        });
    });
  })

//   describe('homepage', function() {
//   	it('should return homepage', function() {
//   		return chai.request(app)
//   		.get('/')
//   		.then(res => {
//   			res.should.have.status(200);
//   			res.should.be.html;
//   		});
//     });
//   });
});

