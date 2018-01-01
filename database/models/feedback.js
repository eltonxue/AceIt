'use strict';
module.exports = (sequelize, DataTypes) => {
  var Feedback = sequelize.define('Feedback', {
    question: {
      type: DataTypes.STRING,
      defaultValue: 'Example Feedback'
    },
    anger: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    fear: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    joy: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    sadness: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    analytical: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    confident: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    tentative: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    }
  });

  Feedback.associate = function(models) {
    // associations can be defined here
    Feedback.belongsTo(models.User);
  };
  return Feedback;
};
