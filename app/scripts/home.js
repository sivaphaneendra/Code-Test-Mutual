// Create a submodule with controller named as homeController

angular.module('home', []).controller('homeController', ['DataService', '$location', '$rootScope',
	function (DataService, $location, $rootScope) {
		var self = this;
		self.msg = 'Welcome to AngularJS Application Main Page';
		self.user = {};

		self.checkAuth = function () {
			var promise = DataService.checkUser(self.user);
			promise.then(function (response) {
				if (response.length === 0)
					self.loginError = "Invalid login details";
				else {
					$rootScope.loginUserDetails = response[0];
					$location.path('/dashboard');
				}
			}, function (error) {
				self.loginError = "Error occured";
			});
		};
	}]).service('DataService', ['$q', '$http', function ($q, $http) {
		var data = [];

		this.checkUser = function (details) {
			var config = {
				params: { "username": details.name, "password": details.password }
			};
			var deferred = $q.defer();
			$http.get('http://localhost:3000/checkuser', config)
				.success(function (data) {
					deferred.resolve(data);
				}).error(function (msg, code) {
					deferred.reject(msg);
				});
			return deferred.promise;
		};
	}]);