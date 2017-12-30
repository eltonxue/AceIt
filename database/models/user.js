'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      history: {
        type: DataTypes.ARRAY(DataTypes.JSON), // [ Feedback ]
        defaultValue: []
      },
      questionBanks: {
        type: DataTypes.JSON, // { title: String, questions: [ String ] }
        defaultValue: {}
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
  return User;
};
