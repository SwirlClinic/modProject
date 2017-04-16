CREATE INDEX mod_for_game_index_for_game on mod_for_game(game_name,game_release_year);
CREATE INDEX pfm_index_for_post on post_features_mod(title,date,time);
CREATE INDEX post_username_index on post(username);
CREATE INDEX post_game_index on post(game_name,game_release_year);
CREATE INDEX favorites_index on favorites(title,date,time);
CREATE INDEX following_index on follows(is_followed,follower);
