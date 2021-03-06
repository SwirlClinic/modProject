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

--Example Query 2: Most Posted About Games for a Genre
--List the top 25 games with the most posts about them for a given genre and order them by the number of posts about them.
--This can be used as a most talked about games section so that users can see what games a lot
--of users are making mod configfurations for.
SELECT g.name, g.releaseyear, (SELECT COUNT(*)
                               FROM post p
                               WHERE g.releaseyear = p.game_release_year
                               AND g.name = p.game_name) AS post_count
FROM game g
WHERE g.genre = 'Comedy'
ORDER BY post_count desc,g.releaseyear desc, g.name
LIMIT 25
OFFSET 0;


--Query 3: Leaderboard of Users with the Most Favorited Posts
--See the number of favorites each user has for any posts they have
--created (and still show users even if they haven't made a post)
--CREATE INDEX favorites_index on favorites(title,date,time);

SELECT u.username, COUNT(f.favorite_time) as favorite_count
FROM website_user u
LEFT OUTER JOIN post p ON p.username = u.username
LEFT OUTER JOIN favorites f ON f.title = p.title
    AND f.date = p.date
    AND f.time = p.time
GROUP BY u.username
ORDER BY favorite_count DESC, username;


--Query 4: Top Visited Posts for a Game With Genre Filter and Title Search (in Example the game is 'Game1553')
--So, going off of query 2, let's assume that the most posted about game is 'Game1553'
--with a 1982 release year and the user clicks on the game name to see all posts about that game.
--This query will return a list of all posts (from most visited to least) and the number of
--visits the post has received. However, it will not give the content of the post (like a search
--result, clicking on post name will give you the post page).


SELECT p.title, p.date, p.time, COUNT(v.most_recent_visit_date) AS visit_count
FROM post p
INNER JOIN game g ON p.game_name = g.name
	AND p.game_release_year = g.releaseyear
LEFT JOIN visits v ON p.title = v.title
	AND p.date = v.date
	AND p.time = v.time
WHERE p.title LIKE '%%' AND g.genre = 'Comedy'
GROUP BY p.title, p.date, p.time
ORDER BY visit_count DESC, p.date DESC, p.time DESC, p.title
LIMIT 10
OFFSET 0;

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


--Query 6: Creating a New User on the Website
--simply try and insert into the website user table, if successful then they can now log in. If it fails, then the username is already taken.
INSERT INTO website_user(username, email, password)
    VALUES ('exampleUsername', 'example@example.com', '7f9bc6dd66d4c2116beaa73b02593413');


--Query 7: Login to Website
--We use this query to get the user information from the database
--and we check the login information on the server side.

SELECT *
FROM website_user
WHERE username = 'Username1'
	AND isdeleted = false;

--Query 8: Adding a New Mod to the Website

INSERT INTO mod_for_game(game_name, game_release_year, name, link, description)
    VALUES ('Game2', 1981, 'Cool Mod for Cool People', 'http://example.com/coolmod', 'Example Description')
		RETURNING modid;

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
WHERE is_followed = 'Username0';

--Query 19: Get a list of followers for the user.
SELECT follower
FROM follows
WHERE is_followed = 'Username0';

--Query 20: Get the Following Count for a user (number of people a user is following)
SELECT COUNT(*)
FROM follows
WHERE follower = 'Username0';

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
	   gm.resolution, gm.fps, uopm.version, p.config_importance_rating
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

SELECT EXISTS(SELECT 1
FROM website_user
WHERE username = 'exampleUsername'
	AND password = '7f9bc6dd66d4c2116beaa73b02593413'
		AND isdeleted = false) as result;

UPDATE website_user
SET isdeleted = true
WHERE username = 'Username9';

--Query 27: Getting user data for a specific user
SELECT username, email
FROM website_user
WHERE username = 'Username1';

--Query 28: Get a list of all games
SELECT *
FROM game;

--Query 29: Get a list of mods for a game
SELECT *
FROM mod_for_game
WHERE game_name = 'Game1553'
AND game_release_year = 1982;

--Query 30: List of the most recent posts
SELECT *
FROM post
ORDER BY date DESC,time DESC
LIMIT 10
OFFSET 0;

--Query 31: Check if user is following another user
--CREATE INDEX following_index on follows(is_followed,follower);

SELECT EXISTS(SELECT 1
	from follows
	where is_followed = 'Username1'
	and follower = 'Username0') AS result;

--Query 32: Check if user has favorited something
SELECT EXISTS(SELECT 1
	from favorites
	WHERE username = 'Username1'
		AND title = 'ESJvKqAdKZb'
	    AND date = '1991-08-11'
	    AND time = '16:27:29') AS result;


--Query 33: Get a list of genres in the database
SELECT DISTINCT genre
FROM game;

--Query 34: Experts for a game
--Users who have written about all the mods for a certain game
--with their posts. Game search with it (so it uses user input)

--CREATE INDEX mod_for_game_index_for_game on mod_for_game(game_name,game_release_year);
--CREATE INDEX pfm_index_for_post on post_features_mod(title,date,time);
--CREATE INDEX post_username_index on post(username);
--CREATE INDEX post_game_index on post(game_name,game_release_year);

SELECT DISTINCT p.username, p.game_name, p.game_release_year
FROM post p
WHERE p.game_name LIKE '%Game1%' AND
NOT EXISTS(
    (SELECT m.modid
    FROM mod_for_game m
    WHERE m.game_name = p.game_name
        AND m.game_release_year = p.game_release_year
    )
    EXCEPT
    (SELECT pfm.modid
    FROM post_features_mod pfm, post p2
    WHERE p2.title = pfm.title
        AND p2.date = pfm.date
        AND p2.time = pfm.time
        AND p2.username = p.username
        AND p2.game_name = p.game_name
        AND p2.game_release_year = p.game_release_year
    )
)
ORDER BY p.game_name,p.game_release_year DESC, p.username
LIMIT 25
OFFSET 0;

--Query 35: Talkative Users
--Gets the users with the most comments on other peoples' posts and who have
--made comments on at least 50 different peoples' posts
SELECT cfp.username, COUNT(*) as num_comments_on_others_posts, COUNT(DISTINCT p.username) as num_users_commented_for
FROM comment_for_post cfp, post p
WHERE cfp.post_title = p.title
    AND cfp.post_time = p.time
    AND cfp.post_date = p.date
		AND cfp.username <> p.username
GROUP BY cfp.username
HAVING COUNT(DISTINCT p.username) >= 50
ORDER BY num_comments_on_others_posts DESC, username;

--Query 36: Getting Info About a Specific Game
SELECT *
FROM game
WHERE game_name = 'Game1'
AND releaseyear = 2000;

--Query 37: Top Visited Posts for a Game
select p.title, p.date, p.time, COUNT(v.most_recent_visit_date) as visits_count
FROM post p
LEFT OUTER JOIN visits v
ON p.title = v.title
    AND p.date = v.date
    AND p.time = v.time
WHERE p.game_name = 'Game0'
    AND p.game_release_year = 2000
GROUP BY p.title, p.date, p.time
ORDER BY visits_count DESC;

--Query 38: All Add-On Mods for a Game
select m.*, a.hours_added, a.num_new_items
FROM add_on_mod a, mod_for_game m
WHERE a.modid = m.modid
    AND game_name = 'Game0'
    AND game_release_year = 2000;

--Query 39: All Graphical Mods for a Game
select m.*, g.resolution, g.fps
FROM graphical_mod g, mod_for_game m
WHERE g.modid = m.modid
    AND game_name = 'Game0'
    AND game_release_year = 2000;

--Query 40: All Unofficial Path Mods for a Game
select m.*, u.version
FROM unofficial_patch_mod u, mod_for_game m
WHERE u.modid = m.modid
    AND game_name = 'Game0'
    AND game_release_year = 2000;

--Query 41: Mods Without a Type for a game (mods which don't have a type)
select *
FROM mod_for_game m
WHERE game_name = 'Game0'
	AND game_release_year = 2000
	AND NOT EXISTS (SELECT 1
						FROM unofficial_patch_mod u
						WHERE u.modId = m.modId)
	AND NOT EXISTS (SELECT 1
						FROM graphical_mod g
						WHERE g.modId = m.modId)
	AND NOT EXISTS (SELECT 1
						FROM add_on_mod a
						WHERE a.modId = m.modId);
