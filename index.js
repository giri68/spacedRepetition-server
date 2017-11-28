'use strict';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
const passport = require('passport');
// const {dbConnect} = require('./db-knex');

const app = express();

const { router: userRouter } = require('./users');
const { router: questionRouter } = require('./questions');
const { router: authRouter, basicStrategy, jwtStrategy } = require('./auth');
passport.use(basicStrategy);

passport.use(jwtStrategy);
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/questions', questionRouter);

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});
function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
