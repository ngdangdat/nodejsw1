var Router = require('./lib/Router')();
var Home = require('./controllers/Home');
var currentPage;
var body;
var Register = require('./controllers/Register');
var Login = require('./controllers/Login');
var UserModel = require('./models/User');

var showPage = function(newPage) {
	if(currentPage) currentPage.teardown();
	currentPage = newPage;
	body.innerHTML = '';
	currentPage.render(body);
	currentPage.on('navigation.goto', function(e, route) {
		Route.navigate(route);
	})
}

window.onload = function() {
	body = document.querySelector('body');
	userModel = new UserModel();
	userModel = fetch(function(error, result) {
		//...router setting
	});

	Router
	.add('home', function() {
		var p = new Home();
		showPage(p);
	})
	.add(function() {
		Router.navigate('home');
	})
	.listen()
	.check();
	Router
	.add('register', function() {
		var p = new Register();
		showPage(p);
	});
	Route
	.add('login', function (){
		var p = new Login();
		showPage(p);
	})
}