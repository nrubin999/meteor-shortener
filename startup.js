Meteor.startup(function () {
	process.env.RECEIVE_KEY = 'test';
	process.env.RETURN_KEY = 'testreturn';
	process.env.RECEIVE_DOMAIN = 'http://localhost:3000/';
	process.env.CURRENT_URL = 'http://localhost:3000/';
	process.env.REDIRECT_URL = 'http://meansdatabase.com';
});