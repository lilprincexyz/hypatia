const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
const should = chai.should();

const {DATABASE_URL} = require('../config');
const {Religion} = require('../models');
const {closeServer, runServer, app} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {mockReligions} = require('../mock-religions');
chai.use(chaiHttp);


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedReligionData() {
  console.info('seeding religion data');
  // this will return a promiseø
  return Religion.insertMany(mockReligions);
}


describe('Hypatia API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedReligionData();
  });

  afterEach(function() {
    // tear down database so we ensure no state from this test
    // effects any coming after.
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  // note the use of nested `describe` blocks.
  // this allows us to make clearer, more discrete tests that focus
  // on proving something small
  describe('GET endpoint', function() {

    it('should return all existing religions', function() {
      // strategy:
      //    1. get back all religions returned by GET request to `/religion`
      //    2. prove res has right status, data type
      //    3. prove the number of posts we got back is equal to number
      //       in db.
      let res;
      return chai.request(app)
        .get('/religion')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          // otherwise our db seeding didn't work

          console.log(JSON.stringify(res));
          res.body.should.be.a('array');  

          return Religion.count();
        })
        .then(count => {
          // the number of returned posts should be same
          // as number of posts in DB
        });
    });

    it('should return religions with right fields', function() {
      // Strategy: Get back all posts, and ensure they have expected keys

      let resReligion;
      return chai.request(app)
        .get('/religion')
        .then(function(res) {

          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);

          res.body.forEach(function(religion) {
            religion.should.be.a('object');
            religion.should.include.keys('name', 'historicalRoots', 'basicBeliefs', 
              'practices', 'organization', 'books');
          });
          // just check one of the posts that its values match with those in db
          // and we'll assume it's true for rest
          resReligion = res.body[0];
          return Religion.findById(resReligion.id);
        })
        .then(religion => {
          resReligion.name.should.equal(religion.name);
          resReligion.historicalRoots.should.equal(religion.historicalRoots);
          resReligion.basicBeliefs.should.equal(religion.basicBeliefs);
          resReligion.practices.should.equal(religion.practices);
          resReligion.organization.should.equal(religion.organization);
          resReligion.books.should.deep.equal(religion.books);
        });
    });
  });

  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the post we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new blog post', function() {

      const newReligion = mockReligions[0];

      return chai.request(app)
        .post('/religion')
        .send(newReligion)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'name', 'historicalRoots', 'basicBeliefs', 
              'practices', 'organization', 'books');
          res.body.name.should.equal(newReligion.name);
          // cause Mongo should have created id on insertion
          res.body.id.should.not.be.null;
          res.body.historicalRoots.should.equal(newReligion.historicalRoots);
          res.body.basicBeliefs.should.equal(newReligion.basicBeliefs);
          res.body.practices.should.equal(newReligion.practices);
          res.body.organization.should.equal(newReligion.organization);
          res.body.books.should.deep.equal(newReligion.books);
          return Religion.findById(res.body.id);
        })
        .then(function(religion) {
          religion.name.should.equal(newReligion.name);
          religion.historicalRoots.should.equal(newReligion.historicalRoots);
          religion.basicBeliefs.should.equal(newReligion.basicBeliefs);
          religion.practices.should.equal(newReligion.practices);
          religion.organization.should.equal(newReligion.organization);
          religion.books.should.deep.equal(newReligion.books);
        });
    });
  });

  describe('PUT endpoint', function() {

    // strategy:
    //  1. Get an existing post from db
    //  2. Make a PUT request to update that post
    //  4. Prove post in db is correctly updated
    it('should update fields you send over', function() {
      const updateData = {
        name: "garbage",
        historicalRoots: "garbage",
        basicBeliefs: "garbage",
        practices: "garbage",
        organization: "garbage",
        books: ["garbage"]
      };

      return Religion
        .findOne()
        .then(religion => {
          updateData.id = religion.id;

          return chai.request(app)
            .put(`/religion/${religion.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return Religion.findById(updateData.id);
        })
        .then(religion => {
          religion.name.should.equal(updateData.name);
          religion.historicalRoots.should.equal(updateData.historicalRoots);
          religion.basicBeliefs.should.equal(updateData.basicBeliefs);
          religion.practices.should.equal(updateData.practices);
          religion.organization.should.equal(updateData.organization);
          religion.books.should.deep.equal(updateData.books);
        });
    });
  });

  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a post
    //  2. make a DELETE request for that post's id
    //  3. assert that response has right status code
    //  4. prove that post with the id doesn't exist in db anymore
    it('should delete a religion by id', function() {

      let religion;

      return Religion
        .findOne()
        .then(_religion => {
          religion = _religion;
          return chai.request(app).delete(`/religion/${religion.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Religion.findById(religion.id);
        })
        .then(_religion => {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_post.should.be.null` would raise
          // an error. `should.be.null(_post)` is how we can
          // make assertions about a null value.
          should.not.exist(_religion);
        });
    });
  });
});
