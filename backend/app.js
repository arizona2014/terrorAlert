/*jshint node:true*/
'use strict';

var express = require('../node_modules/express');
var app = express();
var bodyParser = require('../node_modules/body-parser');
var favicon = require('../node_modules/serve-favicon');
var logger = require('../node_modules/morgan');
var port = process.env.PORT || 8001;
var four0four = require('./utils/404')();
var _ = require('../node_modules/lodash');
var environment = process.env.NODE_ENV;

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
    
});

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/api', require('./routes'));

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
  case 'build':
    console.log('** BUILD **');
    app.use(express.static('./build/'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function(req, res, next) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./build/index.html'));
    break;
  default:
    console.log('** DEV **');
    app.use(express.static('./src/client/'));
    app.use(express.static('./'));
    app.use(express.static('./tmp'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function(req, res, next) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./src/client/index.html'));
    break;
}

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
  console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname +
    '\nprocess.cwd = ' + process.cwd());
});

