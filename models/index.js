// Import models
const User = require("./User");
const Question = require("./Question");
const Tag = require("./Tag");
const Answer = require("./Answer");
const QuestionTag = require("./QuestionTag");

Question.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Question, {
  foreignKey: "user_id",
});

Question.hasMany(Answer, {
  foreignKey: "question_id",
});

Answer.hasOne(Question, {
  foreignKey: "question_id",
});

User.hasMany(Answer, {
  foreignKey: "user_id",
});

Answer.hasOne(User, {
  foreignkey: "user_id",
});

Question.hasMany(Tag, {
  through: "product_tag",
});

Tag.hasMany(Question, {
  through: "product_tag",
});

module.exports = {
  Question,
  User,
  Answer,
  Tag,
  QuestionTag,
};
