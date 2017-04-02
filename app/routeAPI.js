//Required packages
var express = require('express');
var db = require('./connection');


//Routes for the api
var router = express.Router();


/*router.use(function(req, res, next) {
	console.log("something is happenin");
	next();
});*/

router.get('/secretcookies', function(req,res, next) {
	console.log(req.cookies.access_token);
	if (!req.cookies.access_token) {
		res.redirect('/login.html');
		//res.json({message: "no cookies?"});
	}
	else {
		res.json({message: req.cookies.access_token});
	}
});

router.route('/users')
    .get(function(req,res) {

    	//console.log("Response? : " + db.getUsers());

    	db.any("SELECT * from website_user")
			.then(function (data) {
				res.json(data);
		}).catch(function(err){
				res.json(err);
		});


    })
    .post(function(req, res) {
        var query = "INSERT INTO website_user (username,email,password) VALUES ('"
         + req.body.username + "','" + req.body.email + "','" + req.body.password + "')"

        //console.log(query);

        db.any(query)
            .then(function (data) {
								console.log("inserted: " + req.body.username);
                res.json(data);
        		}).catch(function(err){
							console.log(err);
							res.json({"error": err})
						});

    });

router.route('/games')
    .get(function(req,res) {

        //console.log("Response? : " + db.getUsers());

        db.any("SELECT * from game")
            .then(function (data) {
                res.json(data);
        }).catch(function(err){
                res.json(err);
        });


    });

router.route('/modfor/:game_name')
    .get(function(req,res) {

        //console.log("Response? : " + db.getUsers());

        db.any("SELECT * from mod_for_game WHERE game_name = $1", [req.params.game_name])
            .then(function (data) {
                res.json(data);
        }).catch(function(err){
                res.json(err);
        });


    });

router.route('/login')
    .post(function(req, res) {
    	//console.log(req.body.username);
        db.one("SELECT * FROM website_user WHERE username = $1", [req.body.username])
            .then(function (data) {
            	//console.log(data.password);
            	if(req.body.password == data.password.trim()) {
            		//res.json(data);	

            		var userInfo = {
            			username: data.username,
            			email: data.email
            		};

            		res.cookie('access_token', data.username);
            		console.log("Hello world!");
            		console.log(req.cookies);
            		res.json({message: "Success!"});

            	}
            	else {
            		res.json({message: "Failed!"});
            	}

            	
            	
    		}).catch(function(err){

			});

    });

router.route('/logout')
    .get(function(req, res) {
    	res.clearCookie('access_token');
    	res.redirect('/login.html');
    });

    

//Query 21: Get the list of users a person is following
router.route('/following/:username')
	.get(function(req,res){
		db.any("SELECT is_followed FROM follows WHERE follower = $1",[req.params.username])
			.then(function(data){
				res.json(data);
			}).catch(function(err){
				res.json({"error": err})
			});
	});

//Query 20: Get the Following Count for a user (number of people a user is following)
router.route('/followingCount/:username')
	.get(function(req,res){
		db.any("SELECT COUNT(*) FROM follows WHERE follower = $1 GROUP BY follower",[req.params.username])
			.then(function(data){
				res.json(data);
			}).catch(function(err){
				res.json({"error": err})
			});
	});

//Query 19: Get a list of followers for the user.
router.route('/followers/:username')
	.get(function(req,res){
		db.any("SELECT follower FROM follows WHERE is_followed = $1",[req.params.username])
			.then(function(data){
				res.json(data);
			}).catch(function(err){
				res.json({"error": err})
			});
	});

//Query 18: Get the Follower Count for a user.
router.route('/followersCount/:username')
	.get(function(req,res){
		db.any("SELECT COUNT(*) FROM follows WHERE is_followed = $1 GROUP BY is_followed",[req.params.username])
			.then(function(data){
				res.json(data);
			}).catch(function(err){
				res.json({"error": err})
			});
	});

module.exports = router;
