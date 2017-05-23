'use strict'; // strict mode

var path = require('path');
var api = require('./service/shortener.js');
var express = require('express');
var routes = require('./service/index.js');
var mongo = require('mongodb');

require('dotenv').config({
  silent: true
});

var app = express();
mongo.MongoClient.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url-shortener', function(err, db) { // Connect to MongoDB

  if (err) {
    throw new Error('Failure in database connection'); // Throw error is database connection fails
  } else {
    console.log('We have connected to MongoDB on port 27017'); // Success message
  }

  db.createCollection("sites", {
    capped: true,
    size: 5242880,
    max: 5000
  });

  api(app, db);

  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, 'views'));

  var port = process.env.PORT || 8080;
  
  routes(app, db);
  
  app.listen(port, function() {
    console.log('We are listening on ' + port);
  });

});