'use strict';
module.exports = (sequelize, DataTypes) => {
  var Feedback = sequelize.define('Feedback', {
    question: DataTypes.STRING,
    anger: DataTypes.FLOAT,
    fear: DataTypes.FLOAT,
    joy: DataTypes.FLOAT,
    sadness: DataTypes.FLOAT,
    analytical: DataTypes.FLOAT,
    confident: DataTypes.FLOAT,
    tentative: DataTypes.FLOAT
  });

  Feedback.associate = function(models) {
    // associations can be defined here
    Feedback.belongsTo(models.User);
  };
  return Feedback;
};
