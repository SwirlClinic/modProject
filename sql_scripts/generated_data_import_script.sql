COPY website_user(username,email,password) from '/var/lib/postgresql/website_users.csv' delimiter ',' csv;
COPY follows(follower,is_followed) from '/var/lib/postgresql/follows.csv' delimiter ',' csv;
COPY game(name,releaseyear,description,genre) from '/var/lib/postgresql/game.csv' delimiter ',' csv;
COPY mod_for_game(game_name,game_release_year,modId,name,link,description) from '/var/lib/postgresql/mod_for_game.csv' delimiter ',' csv;
BEGIN;
COPY post(username,game_name,game_release_year,title,date,time,body) from '/var/lib/postgresql/post.csv' delimiter ',' csv;
COPY post_features_mod(modId,title,date,time,config_importance_rating) from '/var/lib/postgresql/post_features_mod.csv' delimiter ',' csv;
COMMIT;
COPY comment_for_post(post_title,post_date,post_time,comment_date,comment_time,comment_body,username) from '/var/lib/postgresql/comment_for_post.csv' delimiter ',' csv;
COPY visits(username,title,date,time,most_recent_visit_date) from '/var/lib/postgresql/visits.csv' delimiter ',' csv;
COPY favorites(username,title,date,time,favorite_date,favorite_time) from '/var/lib/postgresql/favorites.csv' delimiter ',' csv;
COPY add_on_mod(modId,hours_added,num_new_items) from '/var/lib/postgresql/add_on_mod.csv' delimiter ',' csv;
COPY graphical_mod(modId,resolution,fps) from '/var/lib/postgresql/graphical_mod.csv' delimiter ',' csv;
COPY unofficial_patch_mod(modId,version) from '/var/lib/postgresql/unofficial_patch_mod.csv' delimiter ',' csv;