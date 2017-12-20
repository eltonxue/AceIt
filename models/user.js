const Sequelize = require('sequelize');

const UserModel = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  }
});

UserModel.sync({ force: true }).then(() => {
  // Table created
  return UserModel.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
});

UserModel.findAll().then(users => {
  console.log(users);
});

module.exports = UserModel;
