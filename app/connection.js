var pgp = require('pg-promise')();
var db = pgp('postgres://user:pass@host:port/database');


module.exports = db;