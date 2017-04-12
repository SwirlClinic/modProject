//Required packages
var express = require('express');
var db = require('./connection');


//Routes for the api
var router = express.Router();


/*router.use(function(req, res, next) {
	console.log("something is happenin");
	next();
});*/
/*
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
*/


router.get('/secretcookies', function(req,res, next) {

    var query = "SELECT * from website_user WHERE username = $1";
    //Query 28: Get specific user data
    db.any(query, "Fullsteel")
        .then(function (data) {
            res.json(data);
    }).catch(function(err){
            res.json(err);
    });

});


router.route('/users/:username')
    .get(function(req,res) {
        //Query 28: Get specific user data
        db.any("SELECT username,email FROM website_user WHERE username = $1", [req.params.username])
            .then(function (data) {
            res.json(data);
        }).catch(function(err){
            res.json(err);
        });

    })
    .post(function(req, res) {
        //Query 10: Updating Email Address for the User
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
      //Query 27: Get all user data
    	db.any("SELECT * FROM website_user")
			.then(function (data) {
				res.json(data);
		}).catch(function(err){
				res.json(err);
		});


    })
    .post(function(req, res) {
        //Query 6: Creating a New User on the Website
        var query = "INSERT INTO website_user (username,email,password) VALUES ($1, $2, $3);";

        //console.log(query);

        var params = [req.body.username, req.body.email, req.body.password];

        db.any(query, params)
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
        //Query 29: Get a list of all games
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
        //Query 30: Get a list of mods for a game (needs to include game release year)
        db.any("SELECT * FROM mod_for_game WHERE game_name = $1", [req.params.game_name])
            .then(function (data) {
                res.json(data);
        }).catch(function(err){
                res.json(err);
        });


    });

router.route('/login')
    .post(function(req, res) {
    	//console.log(req.body.username);
        //Query 28: Get specific user data
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
            		/*console.log("Hello world!");
            		console.log(req.cookies);*/
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



				/*
        var date;
        date = new Date();
        var monthday = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2);
        var time =
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
				*/
/* Not good! We need to sanitize this
        var query = "BEGIN; INSERT INTO post(username,game_name,game_release_year,title, date, time, body) VALUES('"
         + req.body.username + "','" + req.body.gameinfo.name + "'," + req.body.gameinfo.releaseyear + ",'" + req.body.title + "'," + "current_date" + "," + "current_time" + ",'" + req.body.body + "');";

        query += "INSERT INTO post_features_mod(modId,title,date,time,config_importance_rating) VALUES";

        for (var i = 0; i < req.body.modsAdded.length-1; i++) {
            query += "(" + req.body.modsAdded[i].modid + ",'" + req.body.title + "'," + "current_date" + "," + "current_time" + "," + "10),";
        }
        query += "(" + req.body.modsAdded[i].modid + ",'" + req.body.title + "'," + "current_date" + "," + "current_time" + "," + "10); COMMIT;";
        console.log(query);
*/
        var query = "BEGIN; INSERT INTO post(username,game_name,game_release_year,title, date, time, body) VALUES"
            + "($1, $2, $3, $4, current_date, current_time, $5);"

            + "INSERT INTO post_features_mod(modId,title,date,time,config_importance_rating) VALUES";

        var parameters = [req.body.username, req.body.gameinfo.name, req.body.gameinfo.releaseyear, req.body.title, req.body.body];

        var paramidx = 6;
        var i;

        for (i = 0; i < req.body.modsAdded.length-1; i++) {
            parameters.push(req.body.modsAdded[i].modid);
            parameters.push(req.body.title);

            query += "($" + paramidx;
            paramidx++;
            query += ", $" + paramidx;
            paramidx++;
            query += ", current_date, current_time, 10),";
        }
        parameters.push(req.body.modsAdded[i].modid);
        parameters.push(req.body.title);
        query += "($" + paramidx;
        paramidx++;
        query += ", $" + paramidx;
        query += ", current_date, current_time, 10); COMMIT;";


        db.any(query, parameters)
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



//Query 22: Follow a user
router.route('/follow')
  .post(function(req,res){
    var query = "INSERT INTO follows(is_followed, follower)"
                +" VALUES($1, $2)";
    var params = [req.body.is_followed, req.body.follower];

    db.any(query,params)
      .then(function(data){
        console.log(req.body.follower + " is now following "+req.body.is_followed+"!");
        res.json({message: "Success!"});
      }).catch(function(err){
        res.json({message: "Failure!"});
      });
  });

//Query 23: Unfollow a user
router.route('/unfollow')
  .post(function(req,res){
    var query = "DELETE FROM follows"
                + " WHERE is_followed = $1"
	              + " AND follower = $2";
    var params = [req.body.is_followed, req.body.follower];

    db.any(query,params)
      .then(function(data){
        console.log(req.body.follower + " unfollowed "+req.body.is_followed);
        res.json({message: "Success!"});
      }).catch(function(err){
        res.json({message: "Failure!"});
      });

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
        db.any("SELECT * FROM post ORDER BY date DESC,time DESC LIMIT 10")
            .then(function(data){
                res.json(data);
            }).catch(function(err){
                res.json({"error": err})
            });
    });

router.route('/posts/latest/:off')
    .get(function(req,res){
        db.any("SELECT * FROM post ORDER BY date DESC,time DESC LIMIT 10 OFFSET $1",[parseInt(req.params.off,10)])
            .then(function(data){
                res.json(data);
            }).catch(function(err){
                res.json({"error": err})
            });
    });

//Query 9: Adding a New Game
router.route('/submitGame')
      .post(function(req,res){
        var query = "INSERT INTO game(name,releaseyear,description,genre)"
                    + " VALUES($1, $2, $3, $4)";
        if(parseInt(req.body.releaseyear,10)){
          var params = [req.body.name, parseInt(req.body.releaseyear,10), req.body.description, req.body.genre];
        }
        else{
          res.json({message: "Failure!"});
        }


        db.any(query,params)
          .then(function(data){
            console.log("New game "+req.body.name+" released in "+req.body.releaseyear.toString()
                        +" has been added to the database");
            res.json({message: "Success!"});
          }).catch(function(err){
            console.log(err);
            res.json({message: "Failure!"});
          });
      });

/*
--Query 8: Adding a New Mod to the Website
//TODO: Insert different mod info
INSERT INTO mod_for_game(game_name, game_release_year, name, link, description)
    VALUES ('Game2', 1981, 'Cool Mod for Cool People', 'http://example.com/coolmod', 'Example Description');
*/

router.route('/submitmod')
    .post(function(req, res) {

         var query = "INSERT INTO mod_for_game(game_name, game_release_year, name, link, description) VALUES ($1, $2, $3, $4, $5);"

         var params = [req.body.gameinfo.name, req.body.gameinfo.releaseyear, req.body.name, req.body.link, req.body.description];

         db.any(query, params)
            .then(function (data) {
                    console.log("Submitted mod: " + req.body.name + " for game " + req.body.gameinfo.name);
                    res.json({message: "Success!"});
                }).catch(function(err){
                    console.log(err);
                    console.log('why is this not giving failure');
                    res.json({message: "Failure!"});
            });
    });

//Query 4: Most Visited Posts for a Game
router.route('/mostVisitedPostsForGame')
  .post(function(req,res){
    var query = "SELECT p.title, p.date, p.time, COUNT(v.most_recent_visit_date) AS visit_count"
                + " FROM post p"
                + " INNER JOIN game g ON p.game_name = g.name AND p.game_release_year = g.releaseyear"
                + " LEFT JOIN visits v ON p.title = v.title AND p.date = v.date AND p.time = v.time"
                + " WHERE p.title LIKE $1";
                if(req.body.genre){
                  query +=" AND g.genre = $2";
                }
                query += " GROUP BY p.title, p.date, p.time"
                + " ORDER BY visit_count DESC, p.date DESC, p.time DESC, p.title"
                + " LIMIT 10"
                + " OFFSET $3";

    var params = ["%"+req.body.name+"%",req.body.genre,req.body.offset];

    db.any(query,params)
      .then(function(data){
        res.json(data);
      }).catch(function(err){
        console.log("Issue with most visited posts for game")
        console.log(err);
        res.json({message: "Failure!"});
      });
  });

/*
Query 5

SELECT post.username, post.game_name, post.game_release_year, post.title, post.date, post.time, post.body
FROM post, follows
WHERE post.username = follows.is_followed
AND follower = 'Username0'
ORDER BY post.date DESC, post.time DESC, post.title DESC
LIMIT 10 OFFSET 0;
*/

router.route('/getfollowmods/:username')
    .get(function(req,res) {

        //console.log("Response? : " + db.getUsers());

        var query = "SELECT post.username, post.game_name, post.game_release_year, post.title, post.date, post.time, post.body FROM post, follows WHERE post.username = follows.is_followed"
        query += " AND follower = $1 ORDER BY post.date DESC, post.time DESC, post.title DESC LIMIT 10 OFFSET 0;"



        var params = [req.params.username];


        db.any(query,params)
            .then(function (data) {
                res.json(data);
        }).catch(function(err){
                res.json(err);
        });


    });

router.route('/getfollowmods/:username/:off')
    .get(function(req,res) {

        //console.log("Response? : " + db.getUsers());

        var query = "SELECT post.username, post.game_name, post.game_release_year, post.title, post.date, post.time, post.body FROM post, follows WHERE post.username = follows.is_followed"
        query += " AND follower = $1 ORDER BY post.date DESC, post.time DESC, post.title DESC LIMIT 10 OFFSET $2;"



        var params = [req.params.username,parseInt(req.params.off,10)];


        db.any(query,params)
            .then(function (data) {
                res.json(data);
        }).catch(function(err){
                res.json(err);
        });


    });

//Query 24: Get Content for Post Page
router.route('/posts/mainPostContent')
  .post(function(req,res){
    var query = "SELECT *"
                + " FROM post"
                + " WHERE title = $1"
                + " AND date = $2"
                + " AND time = $3";
    var params = [req.body.title, req.body.date, req.body.time];

    db.any(query, params)
        .then(function(data){
            console.log("Getting post content for post titled "+req.body.title);
            res.json(data);
        }).catch(function(err){
            console.log(err);
            res.json({message: "Failure!"});
        });
  });

//Query 24: Get mods for a Post Page
router.route('/posts/details')
    .post(function(req,res){

        /*
        SELECT m.name, m.link, m.description,ad.hours_added, ad.num_new_items,
       gm.resolution, gm.fps, uopm.version, m.modid
        FROM mod_for_game m
        LEFT OUTER JOIN add_on_mod ad ON m.modid = ad.modid
        LEFT OUTER JOIN graphical_mod gm ON m.modid = gm.modid
        LEFT OUTER JOIN unofficial_patch_mod uopm ON m.modid = uopm.modid
        INNER JOIN post_features_mod p ON p.modid = m.modid
        WHERE p.title = 'gah'
    AND p.date = '2017-04-03T04:00:00.000Z'
    AND p.time = '14:39:09.850278';
        */



        //var query = "SELECT * FROM post_features_mod WHERE title = $1 AND date = $2 AND time = $3";
        var query = "SELECT m.name, m.link, m.description,ad.hours_added, ad.num_new_items,"
        + " gm.resolution, gm.fps, uopm.version, m.modid"
        + " FROM mod_for_game m"
        + " LEFT OUTER JOIN add_on_mod ad ON m.modid = ad.modid"
        + " LEFT OUTER JOIN graphical_mod gm ON m.modid = gm.modid"
        + " LEFT OUTER JOIN unofficial_patch_mod uopm ON m.modid = uopm.modid"
        + " INNER JOIN post_features_mod p ON p.modid = m.modid"
        + " WHERE p.title = $1 AND p.date = $2 AND p.time = $3;";
        var params = [req.body.title, req.body.date, req.body.time];
        //console.log(query);
        //console.log("Params " + params);
        db.any(query, params)



            .then(function(data){
                res.json(data);

            }).catch(function(err){
                console.log(err);
                res.json({message: "Failure!"});
            });
    });

//Query 3: Leaderboard of Users with the Most Favorited Posts
router.route('/userFavoritesLeaderboard')
  .get(function(req,res){
    var query = "SELECT u.username, (SELECT COUNT(wu.username) "
                + " FROM post p, website_user wu, favorites f "
                + " WHERE wu.username = p.username"
                + " AND f.title = p.title"
                + " AND f.date = p.date"
                + " AND f.time = p.time"
                + " AND u.username = wu.username) AS favorite_count"
                + " FROM website_user u"
                + " ORDER BY favorite_count DESC";

    db.any(query,[])
      .then(function(data){
        res.json(data);
      }).catch(function(err){
        console.log(err);
        res.json(err);
      });
  });

//Example Query 2: Most Posted About Games
router.route('/mostPostedAboutGames')
  .get(function(req,res){
    var query = "SELECT g.name, g.releaseyear, (SELECT COUNT(*)"
                + " FROM post p"
                + " WHERE g.releaseyear = p.game_release_year"
                + " AND g.name = p.game_name) AS post_count"
                + " FROM game g"
                + " ORDER BY post_count desc"
                + " limit 25";

    db.any(query,[])
      .then(function(data){
        res.json(data);
      }).catch(function(err){
        res.json(err);
      });
  });

//Example Query 2 (Modified): Most Posted About Games (for a specific genere)
router.route('/mostPostedAboutGames/:genre')
  .get(function(req,res){
    var query = "SELECT g.name, g.releaseyear, (SELECT COUNT(*)"
                + " FROM post p"
                + " WHERE g.releaseyear = p.game_release_year"
                + " AND g.name = p.game_name) AS post_count"
                + " FROM game g"
                + " WHERE g.genre = $1"
                + " ORDER BY post_count desc"
                + " limit 25";

    db.any(query,[req.params.genre])
      .then(function(data){
        res.json(data);
      }).catch(function(err){
        res.json(err);
      });
  });

//Query 11 Adding a comment to a post
router.route('/makeComment')
  .post(function(req,res){
    var query = "INSERT INTO comment_for_post(post_title, post_date, post_time, comment_body, username)"
                +" VALUES($1, $2, $3, $4, $5)";

    var params = [req.body.post_title,req.body.post_date,req.body.post_time,req.body.comment_body,req.body.username];

    db.any(query,params)
      .then(function(data){
        console.log(req.body.username + " just made a comment on a post titled " + req.body.post_title);
        res.json({message: "Success!"});
      }).catch(function(err){
        console.log(err);
        res.json({message: "Failure!"});
      });

  });

//Query 12: Get Comments for a post
router.route('/comments')
  .post(function(req,res){
    var query = "SELECT com.comment_date, com.comment_time, com.comment_body, com.username"
                + " FROM comment_for_post com"
                + " WHERE com.post_title = $1"
	              + " AND com.post_date = $2"
	              + " AND com.post_time = $3"
                + " ORDER BY com.comment_date DESC, com.comment_time DESC";
    var params = [req.body.post_title,req.body.post_date,req.body.post_time];

    db.any(query,params)
      .then(function(data){
        console.log("Getting comments for a post titled " + req.body.post_title);
        res.json(data);
      }).catch(function(err){
        console.log(err);
        res.json({message: "Failure!"});
      });
  });

//Query 34:
router.route('/genres')
.get(function(req,res){
  db.any("select DISTINCT genre from game",[])
    .then(function(data){
      res.json(data);
    }).catch(function(err){
      console.log(err);
      res.json({message: "Failure!"});
    });
});

//Query 13: Favoriting a post
router.route('/favorite')
  .post(function(req,res){
    var query = "INSERT INTO favorites(username, title, date, time)"
                + " VALUES($1, $2, $3, $4)";

    var params = [req.body.username,req.body.title,req.body.date,req.body.time];

    db.any(query,params)
      .then(function(data){
        console.log(req.body.username + " favorited a post titled " + req.body.title);
        res.json({message: "Success!"});
      }).catch(function(err){
        console.log(err);
        res.json({message: "Failure!"});
      });

  });

//Query 14: Unfavorite a post
router.route('/unfavorite')
  .post(function(req,res){
    var query = "DELETE FROM favorites"
                + " WHERE username = $1"
    	          + " AND title = $2"
                + " AND date = $3"
                + " AND time = $4";
    var params = [req.body.username,req.body.title,req.body.date,req.body.time];

    db.any(query,params)
      .then(function(data){
        console.log(req.body.username + " unfavorited a post titled " + req.body.title);
        res.json({message: "Success!"});
      }).catch(function(err){
        console.log(err);
        res.json({message: "Failure!"});
      });
  });

//Query 15: View a user's favorited posts
router.route('/favorites/:username')
  .get(function(req,res){
    var query = "SELECT title, date, time, favorite_date, favorite_time"
                + " FROM favorites"
                + " WHERE username = $1"
                + " ORDER BY date DESC, time DESC";
    var params = [req.params.username];

    db.any(query,params)
      .then(function(data){
        console.log("Getting favorites for "+req.params.username);
        res.json(data);
      }).catch(function(err){
        console.log(err);
        res.json({message: "Failure!"});
      });
  });

//TODO: Query 16

//Query 17: View a User's Visited Posts
router.route('/postsVisited/:username')
  .get(function(req,res){
  var query = "SELECT title, date, time, most_recent_visit_date"
              + " FROM visits"
              + " WHERE username = $1"
              + " ORDER BY most_recent_visit_date DESC";
  var params = [req.params.username];

  db.any(query,params)
    .then(function(data){
      console.log("Getting pages "+req.params.username + " has visited.");
      res.json(data);
    }).catch(function(err){
      console.log(err);
      res.json({message: "Failure!"});
    });
});

//Query 25: Get a list of posts written by a user
router.route('/postsWrittenBy/:username')
  .get(function(req,res){
    var query = "SELECT title, date, time"
                + " FROM post"
                + " WHERE username = $1"
                + " ORDER BY date DESC, time DESC";
    var params = [req.params.username];

    db.any(query,params)
      .then(function(data){
        console.log("Getting pages written by "+req.params.username);
        res.json(data);
      }).catch(function(err){
        console.log(err);
        res.json({message: "Failure!"});
      });
  });

//TODO: Query 26: "Delete" a User from the database

//Query 32: Check if one user follows another user
router.route('/doesFollow')
  .post(function(req,res){
    var query = "SELECT EXISTS(SELECT 1"
    	          + " from follows"
    	          + " where is_followed = $1"
    	          + " and follower = $2) AS result";
    var params = [req.body.is_followed, req.body.follower];

    db.any(query,params)
      .then(function(data){
        console.log("Checking if "+req.body.follower+" follows "+req.body.is_followed);
        res.json(data);
      }).catch(function(err){
        res.json({message: "Failure!"});
      });
  });

//Query 33: Check if user has favorited something
router.route('/doesFavorite')
  .post(function(req,res){
    var query = "SELECT EXISTS(SELECT 1"
      	        + " from favorites"
      	        + " WHERE username = $1"
      		      + " AND title = $2"
      	        + " AND date = $3"
      	        + " AND time = $4) AS result";

    var params = [req.body.username,req.body.title,req.body.date,req.body.time];

    db.any(query,params)
      .then(function(data){
        console.log("Checking if "+req.body.username+" favorited "+req.body.title);
        res.json(data);
      }).catch(function(err){
        res.json({message: "Failure!"});
      });
  });


module.exports = router;
