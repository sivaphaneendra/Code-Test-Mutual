// Create AngularJS application
var app = angular.module('myapp', ['ngRoute', 'home', 'dashboard']);

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