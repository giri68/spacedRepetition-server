'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {TEST_DATABASE_URL} = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');
const { app } = require('../index');
const { User } = require('../users');
const { Question } = require('../questions');
// const {dbConnect, dbDisconnect} = require('../db-knex');

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

const expect = chai.expect;
chai.use(chaiHttp);

before(function() {
  return dbConnect(TEST_DATABASE_URL);
});

after(function() {
  return dbDisconnect();
});
afterEach(function() {
  return User.remove({});
});

const username = 'exampleUser1';
const password = 'examplePass';
const usernameB = 'exampleUserB';
const passwordB = 'examplePassB';
const firstName = 'exampleFirstName';
const lastName = 'exampleLastName';
const histAtt = 0;
const histCorr = 0;
const head = 0;
const userQs = [{uqId: 1, uqNext: 2, uQuestion: 'test', uAnswer: 'test', m: 1}];
// histAtt: { type: Number, default: 0},
// histCorr: { type: Number, default: 0},
// head: { type: Number, default: 0},
// userQs: [{


// uqId: { type: Number },
// uqNext: { type: Number },
// uQuestion: { type: String },
// uAnswer: { type: String },
// m: { type: Number },
// qhistAtt: { type: Number, default: 0},
// qhistCorr: { type: Number, default: 0}

describe('Mocha and Chai', function() {
  it('should be properly setup', function() {
    expect(true).to.be.true;
  });
});
describe('/api/users', function () {
  describe('POST', function () {
    it('Should reject users with missing username', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({ password })
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Missing field');
          expect(res.body.location).to.equal('username');
        });
    });

    it('Should reject users with missing password', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({ username })
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Missing field');
          expect(res.body.location).to.equal('password');
        });
    });

    it('Should reject users with non-string username', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({firstName,lastName, username: 1234, password })
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal(
            'Incorrect field type: expected string'
          );
          expect(res.body.location).to.equal('username');
        });
    });

    it('Should reject users with non-string password', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({ username, password: 1234, firstName, lastName })
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal(
            'Incorrect field type: expected string'
          );
          expect(res.body.location).to.equal('password');
        });
    });

    it('Should reject users with non-trimmed username', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({ username: ` ${username} `, password, firstName: ` ${firstName} `, lastName: ` ${lastName} ` })
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal(
            'Cannot start or end with whitespace'
          );
          expect(res.body.location).to.equal('username');
        });
    });

    it('Should reject users with non-trimmed password', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({ username, password: ` ${password} `, firstName, lastName })
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal(
            'Cannot start or end with whitespace'
          );
          expect(res.body.location).to.equal('password');
        });
    });

    it('Should reject users with empty username', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({ username: '', password, firstName: '', lastName: '' })
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal(
            'Must be at least 1 characters long'
          );
          expect(res.body.location).to.equal('username');
        });
    });

    it('Should reject users with password less than ten characters', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({ username, password: '123456789', firstName, lastName })
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal(
            'Must be at least 10 characters long'
          );
          expect(res.body.location).to.equal('password');
        });
    });

    it('Should reject users with password greater than 72 characters', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({ username, password: new Array(73).fill('a').join(''), firstName, lastName })
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal(
            'Must be at most 72 characters long'
          );
          expect(res.body.location).to.equal('password');
        });
    });

    it('Should reject users with duplicate username', function () {
      // Create an initial user
      return User.create({ username, password, firstName, lastName })
        .then(() =>
          // Try to create a second user with the same username
          chai.request(app)
            .post('/api/users')
            .send({ username, password, firstName, lastName })
        )
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal(
            'Username already taken'
          );
          expect(res.body.location).to.equal('username');
        });
    });

    it('Should create a new user', function () {
      return chai
        .request(app)
        .post('/api/users')
        .send({ username, password, firstName, lastName, histAtt, userQs })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('username','firstName','lastName', 'id', 'head', 'userQs');
          expect(res.body.username).to.equal(username);
          return User.findOne({ username });
        })
        .then(user => {
          expect(user).to.not.be.null;
          return user.validatePassword(password);
        })
        .then(passwordIsCorrect => {
          expect(passwordIsCorrect).to.be.true;
        });
    });
  });
});

describe('/api/questions', function () {
  describe('GET', function () {

    it('Should return all existing questions', function() {
      return chai
        .request(app)
        .get('/api/questions')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res.body.length).to.be.above(0);
          expect(res.body).to.be.an('array');
          res.body.forEach(function(question) {
            expect(question).to.be.an('object');
            expect(question).to.include.keys('question');
          });
          expect(res).to.be.json;
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
    });

    describe('POST', function() {
      it('Should add a question', function () {
        const newQuestion = {question: '10-20', answer: 'in progress'};
        return chai
          .request(app)
          .post('/api/questions')
          .send(newQuestion)
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.an('object');
            expect(res.body).to.include.keys('question');
            return Question
              .findById(res.body._id)
              .then(function (question) {
                expect(res.body.question).to.deep.equal(newQuestion.question);
              });
          });
      });
    });
  });
});

// question: { type: String },
// answer: { type: String }