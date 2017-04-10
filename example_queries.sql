--CSE 412 Project - Group 23 - Queries
--Queries are written in order so some queries may be using data created by a query
--above it. This shouldn't be too much of a problem but just a warning.

--Query 1: Making a Post on the Website
--Insert a post into the database
--where the post has at least 3 mods featured
--we will have to store the info for each mod in the post in some struct and in an array,
--then iterate over the array and insert each mod into the post_features_mod table

BEGIN;
INSERT INTO post(username,game_name,game_release_year,title,body)
	VALUES ('Username3','Game1',2002,'Example Post Title','Example Post Body');

INSERT INTO post_features_mod(modId,title,date,time,config_importance_rating) VALUES
	(1019,'Example Post Title',current_date,current_time,7),
    (1020,'Example Post Title',current_date,current_time,9),
    (1022,'Example Post Title',current_date,current_time,4);
COMMIT;

--Example Query 2: Most Posted About Games
--List the top 10 games with the most posts about them and order them by the number of posts about them.
--This can be used as a most talked about games section so that users can see what games a lot
--of users are making mod configfurations for.
CREATE INDEX post_games_index on post(game_name,game_release_year);
--Index was created in order to speed up query.
SELECT g.name, g.releaseyear, (SELECT COUNT(*)
                               FROM post p
                               WHERE g.releaseyear = p.game_release_year
                               AND g.name = p.game_name) AS post_count
FROM game g
ORDER BY post_count desc
LIMIT 10;


--Query 3: Leaderboard of Users with the Most Favorited Posts
--See the number of favorites each user has for any posts they have
--created (and still show users even if they haven't made a post)

--This query was also used to test how indexes can help to improve
--query performance since favorites had over 100,000 tuples when testing.

--Before Index
---------------------------------------
--Planning time: 1.821 ms
--Execution time: 124518.133 ms

--After Index
-----------------------------
--Planning time: 4.286 ms
--Execution time: 4506.405 ms

CREATE INDEX favorites_index on favorites(title,date,time);

--DELETE COMMENT BELOW TO SEE RUNNING TIME AND STEPS
--EXPLAIN ANALYZE
SELECT u.username, (SELECT COUNT(wu.username)
    FROM post p, website_user wu, favorites f
    WHERE wu.username = p.username
        AND f.title = p.title
        AND f.date = p.date
        AND f.time = p.time
        AND u.username = wu.username) AS favorite_count
FROM website_user u
ORDER BY favorite_count DESC;

--Query 4: Most Visited Posts for a Game (in Example the game is 'Game1553')
--So, going off of query 2, let's assume that the most posted about game is 'Game1553'
--with a 1982 release year and the user clicks on the game name to see all posts about that game.
--This query will return a list of all posts (from most visited to least) and the number of
--visits the post has received. However, it will not give the content of the post (like a search
--result, clicking on post name will give you the post page).

CREATE VIEW number_of_visits_for_post AS
SELECT p.title, p.date, p.time, COUNT(v.title) as visit_count
FROM post p
LEFT OUTER JOIN visits v
ON p.title = v.title
	AND p.date = v.date
    AND p.time = v.time
GROUP BY p.title, p.date, p.time;

SELECT p.title, p.date, p.time, p.username, n.visit_count
FROM post p, number_of_visits_for_post n
WHERE p.title = n.title
	AND p.date = n.date
    AND p.time = n.time
    AND p.game_name = 'Game1553'
    AND p.game_release_year = 1982
ORDER BY n.visit_count DESC;

--Query 5: Populating the users news feed
--This query returns all posts that the logged in user will see on their news feed
--based on following preferences. 'Username0' will be replaced by the logged in users' name.
--In addition, we don't want to initally send all posts from people the user is following (cause
--there could be hundreds) so we will send the 10 most recent and if the user requests more, we will
--change the offset number in order to get more posts.

SELECT post.username, post.game_name, post.game_release_year, post.title, post.date, post.time, post.body
FROM post, follows
WHERE post.username = follows.is_followed
AND follower = 'Username0'
ORDER BY post.date DESC, post.time DESC, post.title DESC
LIMIT 10 OFFSET 0;

--Now we'll improve the news feed by also getting the mod data for each post.
--As with the above info, we will only get the 10 most recent posts (until
--more are requested) and the example user is 'Username0'. The web server will handle
--combining the post data with the mod data in order to get the complete news feed.

SELECT x.title as post_title, x.date as post_date, x.time as post_time, x.name as mod_name, x.link as link_to_mod,
       x.description as mod_description, x.config_importance_rating, x.hours_added, x.num_new_items,
       x.resolution, x.fps, x.version
FROM
(
SELECT pfm.title, pfm.date, pfm.config_importance_rating, pfm.time, mod_for_game.name, 
	   mod_for_game.link, mod_for_game.description, ad.hours_added, ad.num_new_items, 
       gm.resolution, gm.fps, uopm.version
FROM mod_for_game
LEFT JOIN add_on_mod ad ON mod_for_game.modid = ad.modid
LEFT JOIN graphical_mod gm ON mod_for_game.modid = gm.modid
LEFT JOIN unofficial_patch_mod uopm ON mod_for_game.modid = uopm.modid
INNER JOIN post_features_mod pfm ON pfm.modid = mod_for_game.modid
) as x
INNER JOIN
(
    SELECT post.title, post.date, post.time
    FROM post, follows
    WHERE post.username = follows.is_followed
    AND follower = 'Username0'
    ORDER BY post.date DESC, post.time DESC, post.title DESC
    LIMIT 10 OFFSET 0
) as sub
ON sub.title = x.title
AND sub.date = x.date
AND sub.time = x.time
ORDER BY x.date DESC, x.time DESC, x.title DESC;


--Query 6: Creating a New User on the Website
--simply try and insert into the website user table, if successful then they can now log in. If it fails, then the username is already taken.
INSERT INTO website_user(username, email, password)
    VALUES ('exampleUsername', 'example@example.com', '7f9bc6dd66d4c2116beaa73b02593413');


--Query 7: Login to Website
--Will return a 1 if the login is successful
--Will return a 0 if the login failed (bad username or password isn't correct)
--The query will also check if the account is deleted and return 0 if it is.

SELECT COUNT(username)
FROM website_user
WHERE username = 'exampleUsername'
	AND password = '7f9bc6dd66d4c2116beaa73b02593413'
    AND isdeleted = false;

--Query 8: Adding a New Mod to the Website
--TODO

INSERT INTO mod_for_game(game_name, game_release_year, name, link, description)
    VALUES ('Game2', 1981, 'Cool Mod for Cool People', 'http://example.com/coolmod', 'Example Description');

--The MODTYPE is chosen from drop down list (This is not necessary, this is just if user wants
--to add additional class info to the mod). Below are some examples of inserts into these tables.

--IF MODTYPE == Add-On
--{
	INSERT INTO add_on_mod(modid, hours_added, num_new_items)
		VALUES(1000, 150, 1597);
--}

--Else if MODTYPE == Graphical
--{
	INSERT INTO graphical_mod(modid, resolution, fps)
		VALUES(1001, '1600x900', 60);
--}

--Else if MODTYPE == unofficial_patch_mod
--{
	INSERT INTO unofficial_patch_mod(modid, version)
		VALUES(1002, '10.0.1');
--}


--Query 9: Adding a New Game
INSERT INTO game(name,releaseyear,description,genre)
    VALUES('Cool New Game', 2017, 'This a description of the game.', 'Horror');

--Query 10: Updating Email Address for the User
UPDATE website_user
SET email = 'oogabooga@gmail.com'
WHERE username = 'Username1';

--Query 11: Adding a New Comment to a Post
INSERT INTO comment_for_post(post_title, post_date, post_time, comment_body, username)
    VALUES('ESJvKqAdKZb', '1991-08-11', '16:27:29', 'This is my angry comment. Grrrr.', 'Username1');

--Query 12: Get Comments for a give Post
SELECT com.comment_date, com.comment_time, com.comment_body, com.username
FROM comment_for_post com
WHERE com.post_title = 'ESJvKqAdKZb'
	AND com.post_date = '1991-08-11'
	AND com.post_time = '16:27:29'
ORDER BY com.comment_date DESC, com.comment_time DESC;

--Query 13: Favoriting a Post
INSERT INTO favorites(username, title, date, time)
    VALUES('Username1', 'ESJvKqAdKZb', '1991-08-11', '16:27:29');

--Query 14: Un-Favorite a Post
DELETE FROM favorites
WHERE username = 'Username1'
	AND title = 'ESJvKqAdKZb'
    AND date = '1991-08-11'
    AND time = '16:27:29';

--Query 15: View a user's favorited posts
SELECT title, date, time, favorite_date, favorite_time
FROM favorites
WHERE username = 'Username1'
ORDER BY date DESC, time DESC;

--Query 16: Saving User Visit
--First, we need to check if the user has visited this page

SELECT COUNT(*)
FROM visits
WHERE username = 'Username1'
	AND title = 'ESJvKqAdKZb'
    AND date = '1991-08-11'
    AND time = '16:27:29';

--If the count is 0, we need to insert the visit into the table

INSERT INTO visits(username, title, date, time)
    VALUES('Username1', 'ESJvKqAdKZb', '1991-08-11', '16:27:29');

--If the count is 1, we just need to update the most_recent_visit_date
UPDATE visits
SET most_recent_visit_date = current_date
WHERE username = 'Username1'
	AND title = 'ESJvKqAdKZb'
    AND date = '1991-08-11'
    AND time = '16:27:29';

--Query 17: View a User's Visited Posts
SELECT title, date, time, most_recent_visit_date
FROM visits
WHERE username = 'Username1'
ORDER BY most_recent_visit_date DESC;

--Query 18: Get the Follower Count for a user.
SELECT COUNT(*)
FROM follows
WHERE is_followed = 'Username0'
GROUP BY is_followed;

--Query 19: Get a list of followers for the user.
SELECT follower
FROM follows
WHERE is_followed = 'Username0';

--Query 20: Get the Following Count for a user (number of people a user is following)
SELECT COUNT(*)
FROM follows
WHERE follower = 'Username0'
GROUP BY follower;

--Query 21: Get the list of users a person is following
SELECT is_followed
FROM follows
WHERE follower = 'Username0';

--Query 22: Follow a user
INSERT INTO follows(is_followed, follower)
    VALUES('Username1', 'Username0');

--Query 23: Unfollow a user
DELETE FROM follows
WHERE is_followed = 'Username1'
	AND follower = 'Username0';

--Query 24: Get Data for Post Page
--Used with Query 12 (Getting comments for a post) to get all the data for a post page

SELECT *
FROM post
WHERE title = 'ESJvKqAdKZb'
    AND date = '1991-08-11'
    AND time = '16:27:29';

SELECT m.name, m.link, m.description,ad.hours_added, ad.num_new_items,
	   gm.resolution, gm.fps, uopm.version
FROM mod_for_game m
LEFT OUTER JOIN add_on_mod ad ON m.modid = ad.modid
LEFT OUTER JOIN graphical_mod gm ON m.modid = gm.modid
LEFT OUTER JOIN unofficial_patch_mod uopm ON m.modid = uopm.modid
INNER JOIN post_features_mod p ON p.modid = m.modid
WHERE p.title = 'ESJvKqAdKZb'
    AND p.date = '1991-08-11'
    AND p.time = '16:27:29';

--Query 25: Get List of Posts Written by a User
--Used to generate list of links to the corresponding post pages
--of posts created by a user.
SELECT title, date, time
FROM post
WHERE username = 'Username1'
ORDER BY date DESC, time DESC;

--Query 26: "Delete" a User from the Database
--Since we don't want to delete users (since they are connected to a lot
--of data), set isdeleted to true for a user who wants to delete their account
UPDATE website_user
SET isdeleted = true
WHERE username = 'Username9';

--Query 27: Get all user data
SELECT * 
FROM website_user;

--Query 28: Get specific user data
SELECT * 
FROM website_user 
WHERE username = 'Username1';

--Query 29: Get a list of all games
SELECT *
FROM game;

--Query 30: Get a list of mods for a game
SELECT * 
FROM mod_for_game 
WHERE game_name = 'Game1553'
AND game_release_year = 1982;

--Query 31: List of the most recent posts
SELECT * 
FROM post 
ORDER BY date DESC,time DESC 
LIMIT 10;