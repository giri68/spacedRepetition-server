'use strict';

const express = require('express');
const router = express.Router();

const { Question } = require('./models');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false});

router.get('/', (req, res) => {
  return Question.find()
    .then (questions => {
      let questionArray = questions.map(question => question.apiRepr());
      return res.status(200).json(questionArray);
    });
});

router.post('/', jsonParser, (req, res) => {
  const requiredFs = ['question', 'answer'];
  const missingF = requiredFs.find( field => !(field in req.body));
  if (missingF) {
    return res.status(422).json({
      code: 422,
      reason: 'validationError',
      message: 'Missing field',
      location: missingF
    });
  }
  let {question, answer} = req.body;
  return   Question.create({question, answer})
    .then(patron => res.status(201).json(patron.apiRepr())
    )
    .catch( err => {
      if (err.reason === 'validationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = { router };