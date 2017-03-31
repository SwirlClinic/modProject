//Required packages
var express = require('express');
var db = require('./connection');

//Routes for the api
var router = express.Router();

router.use(function(req, res, next) {
	console.log("something is happenin");
	next();
});

router.route('/users')
    .get(function(req,res) {
    	
    	//console.log("Response? : " + db.getUsers());

    	db.any("SELECT * from website_user")
			.then(function (data) {
				res.json(data);		
		});
    	
    	
    })
    .post(function(req, res) {
        var query = "INSERT INTO website_user (username,email,password,isdeleted) VALUES ('"
         + req.body.username + "','" + req.body.email + "','" + req.body.password + "', false)"

        //console.log(query);

        db.any(query)
            .then(function (data) {
                res.json(data);     
        });


        console.log("inserted: " + req.body.name);
        
    });

module.exports = router;