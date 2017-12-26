var Sequelize = require('sequelize');

const sequelize = new Sequelize('main', 'eltonxue', null, {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Sequelize successfully connected with database: 'main'");
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// load models
let models = ['user'];
models.forEach(function(model) {
  module.exports[model] = sequelize.import(__dirname + '/models/' + model);

  module.exports[model]
    .sync({ force: true, logging: console.log })
    .then(response => {
      // Table created
      console.log(response);
      // return User.create(userData);
    });
});

module.exports.sequelize = sequelize;
