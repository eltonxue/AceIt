'use strict';
module.exports = (sequelize, DataTypes) => {
  var Question = sequelize.define(
    'Question',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
        }
      }
    }
  );
  return Question;
};
