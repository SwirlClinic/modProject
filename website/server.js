//Base setup

//Required packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
//var mongoose = require('mongoose');
	

//Configure app to use body parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Configure app to use cookie parser
console.log("Using cookie parser");
app.use(cookieParser());


var port = process.env.PORT || 8080;
//var port = 65000;


//Routes for the api
var routeAPI = require('./app/routeAPI');
var routePublic = require('./app/routePublic');





//Register routes
app.use('/api', routeAPI);
app.use('/', routePublic);
/*app.get('/badabing', function (req,res) {
	res.cookie('access_token', "test");
	console.log(req.cookies);

	res.send('badabing');

});*/
//Static files
app.use(express.static( __dirname + '/public' ));


//Start server
app.listen(port);
console.log('listening on ' + port);


