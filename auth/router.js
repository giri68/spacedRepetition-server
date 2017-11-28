'use strict';

const express  = require('express');
const router = express.Router();
const config = require('../config');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const createAuthToken = function (user){
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const basicAuth = passport.authenticate('basic', { session: false});
const jwtAuth = passport.authenticate('jwt', {session: false});

router.post('/login', basicAuth, (req, res) => {
  const authToken = createAuthToken(req.user.apiRepr());
  const { username, firstName, lastName} = req.user.apiRepr();
  res.json({ authToken , username, firstName, lastName });
});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = { router };
