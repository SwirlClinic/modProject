CREATE FUNCTION checkPostGameMatchesGameForMod()
	RETURNS TRIGGER AS
$BODY$
BEGIN
IF NOT ((SELECT COUNT(*)
		FROM post p, mod_for_game m, post_features_mod pfm
        WHERE pfm.title = p.title
        AND pfm.date = p.date
        AND pfm.time = p.time
        AND pfm.modId = m.modId
        AND ((p.game_name <> m.game_name) OR
			  (p.game_release_year <> m.game_release_year))) 
              = 0)
		THEN RAISE EXCEPTION 'Error: Post game does not match mod.';
END IF;
RETURN NULL;
END
$BODY$
LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER checkPostGameMatchesGameForModTrigger
AFTER INSERT ON post_features_mod
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE PROCEDURE checkPostGameMatchesGameForMod();

CREATE CONSTRAINT TRIGGER checkPostGameMatchesGameForModTriggerUdate
AFTER UPDATE ON post_features_mod
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE PROCEDURE checkPostGameMatchesGameForMod();

CREATE CONSTRAINT TRIGGER checkPostGameMatchesGameForModTriggerDelete
AFTER DELETE ON post_features_mod
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE PROCEDURE checkPostGameMatchesGameForMod();

CREATE FUNCTION totalParticipationPostToMod()
	RETURNS TRIGGER AS
$BODY$
BEGIN
IF NOT((SELECT COUNT(*)
		FROM post p
        WHERE NOT EXISTS(
			SELECT * FROM post_features_mod m
				WHERE p.title = m.title
                AND p.date = m.date
                AND p.time = m.time
        )) = 0)
        THEN RAISE EXCEPTION 'Error: Post not having mod violates total participation constraint.';
END IF;
RETURN NULL;
END
$BODY$
LANGUAGE plpgsql;


CREATE CONSTRAINT TRIGGER totalParticipationPostToModTrigger
AFTER INSERT ON post
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE PROCEDURE totalParticipationPostToMod();

CREATE CONSTRAINT TRIGGER totalParticipationPostToModTriggerOnPostDelete
AFTER DELETE ON post
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE PROCEDURE totalParticipationPostToMod();

CREATE CONSTRAINT TRIGGER totalParticipationPostToModTriggerOnPostUpdate
AFTER UPDATE ON post
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE PROCEDURE totalParticipationPostToMod();

CREATE CONSTRAINT TRIGGER totalParticipationPostToModTriggerOnPostFeaturesModInsert
AFTER INSERT ON post_features_mod
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE PROCEDURE totalParticipationPostToMod();

CREATE CONSTRAINT TRIGGER totalParticipationPostToModTriggerOnPostFeaturesModDelete
AFTER DELETE ON post_features_mod
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE PROCEDURE totalParticipationPostToMod();

CREATE CONSTRAINT TRIGGER totalParticipationPostToModTriggerOnPostFeaturesModUpdate
AFTER UPDATE ON post_features_mod
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE PROCEDURE totalParticipationPostToMod();