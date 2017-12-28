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
        type: DataTypes.ARRAY(DataTypes.JSON),
        defaultValue: []
      },
      questionBanks: {
        type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
        defaultValue: []
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
  // Sync model for view in DataGrip
  User.sync({ force: false }).then(() => console.log('Model synced'));
  return User;
};
