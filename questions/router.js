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

module.exports = { router };