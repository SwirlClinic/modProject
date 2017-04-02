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

router.route('/users/:username')
    .get(function(req,res) {

        db.any("SELECT * from website_user WHERE username = $1", [req.params.username])
            .then(function (data) {
            res.json(data);
        }).catch(function(err){
            res.json(err);
        });

    })
    .post(function(req, res) {

        db.any("UPDATE website_user SET email = $1 WHERE username = $2", [req.body.email, req.body.username])
            .then(function (data) {
                    console.log("Updated: " + req.body.username);
                    res.json({message: "Success!"});
                }).catch(function(err){
                    console.log(err);
                    res.json({message: "Failure!"});
            });

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
                    res.json({message: "Success!"});
        		}).catch(function(err){
					console.log(err);
                    res.json({message: "Failure!"});
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
    			res.json({message: "Failed!"});
			});

    });

router.route('/submitpost')
/*  Query 1: Adding a post
	BEGIN;
	INSERT INTO post(username,game_name,game_release_year,title,body)
		VALUES ('Username3','Game1',2002,'Example Post Title','Example Post Body');

	INSERT INTO post_features_mod(modId,title,date,time,config_importance_rating) VALUES
		(1019,'Example Post Title',current_date,current_time,7),
	    (1020,'Example Post Title',current_date,current_time,9),
	    (1022,'Example Post Title',current_date,current_time,4);
	COMMIT;
*/
    .post(function(req, res) {
        console.log(req.body.gameinfo);

        


        var date;
        date = new Date();
        var monthday = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2);
        var time = 
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);

        var query = "BEGIN; INSERT INTO post(username,game_name,game_release_year,title, date, time, body) VALUES('"
         + req.body.username + "','" + req.body.gameinfo.name + "'," + req.body.gameinfo.releaseyear + ",'" + req.body.title + "','" + monthday + "','" + time + "','" + req.body.body + "');";

        query += "INSERT INTO post_features_mod(modId,title,date,time,config_importance_rating) VALUES";
        
        for (var i = 0; i < req.body.modsAdded.length-1; i++) {
            query += "(" + req.body.modsAdded[i].modid + ",'" + req.body.title + "','" + monthday + "','" + time + "'," + "10),";
        }
        query += "(" + req.body.modsAdded[i].modid + ",'" + req.body.title + "','" + monthday + "','" + time + "'," + "10); COMMIT;";
        console.log(query);


        db.any(query)
            .then(function (data) {
					console.log("inserted: " + req.body.title);
                res.json({message: "Added post!"});
        		}).catch(function(err){
							console.log(err);
							res.json({message: "Failed!"});
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

router.route('/posts/latest')
    .get(function(req,res){
        db.any("SELECT * FROM post ORDER BY date DESC limit 10")
            .then(function(data){
                res.json(data);
            }).catch(function(err){
                res.json({"error": err})
            });
    });


module.exports = router;
