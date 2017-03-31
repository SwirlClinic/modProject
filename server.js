//Base setup

//Required packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
	

//Configure app to use body parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
//var port = 65000;


//Routes for the api
var routeAPI = require('./app/routeAPI');
var routePublic = require('./app/routePublic');





//Register routes
app.use('/api', routeAPI);
app.use('/', routePublic);
//Static files
app.use(express.static( __dirname + '/public' ));


//Start server
app.listen(port);
console.log('listening on ' + port);


