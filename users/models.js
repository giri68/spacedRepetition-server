'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;




const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  userName: {type: String, required: true, unique:true},
  password: { type: String, required: true}
  
});

UserSchema.methods.apiRepr = function (){
  return {
    firstName: this.firstName,
    lastName: this.lastName ,
    userName: this.userName
  };
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = { User };