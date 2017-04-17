var pgp = require('pg-promise')();
var db = pgp('postgres://cse412proj:ericbilljakesriley@forums.swirlclinic.com:5432/modproject');


module.exports = db;
