'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  username: {type: String, required: true, unique:true},
  password: { type: String, required: true},
  histAtt: { type: Number, default: 0},
  histCorr: { type: Number, default: 0},
  head: { type: Number, default: 0},
  userQs: [{
    uqId: { type: Number },
    uqNext: { type: Number },
    uQuestion: { type: String },
    uAnswer: { type: String },
    m: { type: Number },
    qhistAtt: { type: Number, default: 0},
    qhistCorr: { type: Number, default: 0}
  }]
});

UserSchema.methods.apiRepr = function (){
  return {
    id: this._id, 
    firstName: this.firstName,
    lastName: this.lastName ,
    username: this.username,
    head: this.head,
    userQs: this.userQs
  };
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = { User };