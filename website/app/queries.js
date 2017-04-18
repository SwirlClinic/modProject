var db = require('./connection');

function getUsers() {
	var result;
	return db.any("SELECT * from website_user")
		.then(function (data) {
			result = data;
			return data;
		});
	return result;
}

module.exports = {
	getUsers: getUsers,
	bleh: getUsers
};