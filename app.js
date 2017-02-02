// Create AngularJS application
var app = angular.module('myapp', ['ngRoute']);

// routes configuration

app.config(function ($routeProvider) {

	$routeProvider

		.when('/home', {
			templateUrl: 'templates/home.html',
			controller: 'homeController',
			controllerAs: 'homeCtrl'
		})

		.when('/dashboard', {
			templateUrl: 'templates/dashboard.html',
			controller: 'dashboardController',
			controllerAs: 'dashboardCtrl'
		}).otherwise({
			redirectTo: '/home'
		});
});

// Create Controller with name mainCtrl

app.controller('homeController', ['DataService', '$location', function (DataService, $location) {
	var self = this;
	self.msg = 'Welcome to AngularJS Application Main Page';
	self.user = {};

	self.checkAuth = function () {
		//DataService.checkUser(self.user);
		$location.path('/dashboard');
		//self.user = {};
	};
}]);

app.service('DataService', function () {
	var data = [];

	this.checkUser = function (input) {
		data.push(input);
		console.log("data", data);
	};

	this.get = function () {
		return data;
	};
});

// Create Controller with name contactCtrl

app.controller('dashboardController', function () {
	var self = this;
	self.msg = 'Welcome to the Dashboard';

	self.users = [{ name: 'User1', status: 'Active' },
	{ name: 'User2', status: 'InActive' },
	{ name: 'User3', status: 'Active' }];
});