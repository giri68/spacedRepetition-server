'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;




const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  username: {type: String, required: true, unique:true},
  password: { type: String, required: true},
  userQs: [{
    uqId: { type: Number },
    uqNext: { type: Number },
    uQuestion: { type: String },
    uAnswer: { type: String },
    uRepF: { type: Number }
  }]
});

UserSchema.methods.apiRepr = function (){
  return {
    id: this._id, 
    firstName: this.firstName,
    lastName: this.lastName ,
    username: this.username,
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