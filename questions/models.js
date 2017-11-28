'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
  question: { type: String },
  answer: { type: String }
  
});

QuestionSchema.methods.apiRepr = function () {
  return {
    question: this.question
  };
};

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

module.exports = { Question };