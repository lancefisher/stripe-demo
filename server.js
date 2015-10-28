var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var config = require('./server/config');
var database = require('./server/database');
database.connect();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');

  app.use('/static', express.static('static'));
} else {
  // When not in production, enable hot reloading

  var chokidar = require('chokidar');
  var webpack = require('webpack');
  var webpackConfig = require('./webpack.config.dev');
  var compiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));

  // Do "hot-reloading" of express stuff on the server
  // Throw away cached modules and re-require next time
  // Ensure there's no important state in there!
  var watcher = chokidar.watch('./server');
  watcher.on('ready', function() {
    watcher.on('all', function() {
      console.log('Clearing /server/ module cache from server');
      Object.keys(require.cache).forEach(function(id) {
        if (/\/server\//.test(id)) delete require.cache[id];
      });
    });
  });
}

app.use('/img', express.static('img'));

// Include server routes as a middleware
app.use(function(req, res, next) {
  require('./server/app')(req, res, next);
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the webserver
var port = config.PORT;
var hostname = config.HOSTNAME;
app.listen(port, hostname, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://' + hostname + ':' + port);
});
