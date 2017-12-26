module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    username: String,
    password: String,
    email: String,
    history: Array,
    questionBanks: Array
  });
};
