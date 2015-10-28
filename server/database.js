var mongoose = require('mongoose');
var config = require('./config');

var Database = function() {};

Database.prototype.connect = function() {
  var url = config.MONGODB_URL;

  console.log('Connecting to MongoDB: ', url);
  mongoose.connect(url);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Database connection error:'));
  db.once('open', function (callback) {
    console.log('MongoDB connected to ', url);
  });

  return db;
}

// Register models. This should only be done once.
require('./models/Invoice').register();


module.exports = new Database();
