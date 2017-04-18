var pgp = require('pg-promise')();
var db = pgp('postgres://postgres:cse412@localhost:5432/testdump');


module.exports = db;
