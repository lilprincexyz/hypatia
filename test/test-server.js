const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const {closeServer, runServer, app} = require('../server');

chai.use(chaiHttp);

describe('Hypatia API resource', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  describe('homepage', function() {
  	it('should return homepage', function() {
  		return chai.request(app)
  		.get('/')
  		.then(res => {
  			res.should.have.status(200);
  			res.should.be.html;
  		});
    });
  });
});

