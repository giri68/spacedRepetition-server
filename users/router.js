'use strict';
const express = require('express');
const router = express.Router();
var qs = require('qs');
// var assert = require('assert');


const { User } = require('./models');
const { Question } = require('../questions');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', {session: false});

function validateUserFields(user) {
  // split this into 3 PURE helper functions
  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in user && typeof user[field] !== 'string'
  );

  if (nonStringField) {
    return {
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    };
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => user[field].trim() !== user[field]
  );

  if (nonTrimmedField) {
    return {
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    };
  }

  const sizedFields = {
    username: { min: 1 },
    password: { min: 10, max: 72 }
  };
  const tooSmallField = Object.keys(sizedFields).find(field =>
    'min' in sizedFields[field] &&
    user[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(field =>
    'max' in sizedFields[field] &&
    user[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return {
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    };
  }

  return { valid: true };
}

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password', 'firstName', 'lastName'];
  const missingField = requiredFields.find(field => !(field in req.body));
  console.log('new user request body', req.body);
  console.log('new user missing field', missingField);
  // only used when creating user
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
  let userValid = {};
  // used whenever changing or creating user
  if (validateUserFields(req.body).valid === true) {
    userValid = req.body;
  } else {
    let code = validateUserFields(req.body).code || 422;
    return res.status(code).json(validateUserFields(req.body));
  }

  console.log('user validated');
  let { username, password, lastName, firstName } = userValid;
  let head = 0;
  return User.find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      password = hash;

      return getUserQs();
    })
    .then( userQs => {
      return User.create({ username, password, lastName, firstName, head, userQs });
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

function getUserQs() {
  return Question.find()
    .then( questions => {
      return questions.map ( (item, index) => ({
        uqId: index,
        uqNext: (index + 1) === (questions.length) ? 0 : index + 1,
        uQuestion: item.question,
        uAnswer: item.answer,
        m: 1
      }));
    });
}

router.get('/', (req, res) => {
  return User.find()
  
    .then(users => {
      let usersJSON = users.map(user=>user.apiRepr());
      return res.status(200).json(usersJSON);
    })
    .catch(err => {
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});


router.get('/userquestion/:userId', (req, res) => {
  //console.log('res', res);
  const selQ = Math.floor(Math.random()*10);
  console.log(selQ);
  return User.findById(req.params.userId)
    .then(user => {
      return res.status(200).json(user.userQs[selQ]);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

router.put('/userquestion/:userId', (req, res) => {
  //console.log('res', res);
  
  const answerCorrect = req.body.qCorrect;
  const questionId = req.body._id;
  console.log(req.body);
  //return User.findByIdAndUpdate(req.params.userId,
  // { $set: { answerCorrect }}
  // .then(user => {
  return res.status(201).json({message: 'updated'});
    
  // .catch(err => {
  //   console.log(err);
  //   res.status(500).json({ code: 500, message: 'Internal server error' });
  // });
});

router.delete('/:id', jwtAuth, (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      return res.status(500).json({ message: 'something went wrong' });
    });
});

module.exports = { router };