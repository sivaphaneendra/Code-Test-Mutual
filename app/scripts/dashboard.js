// Create a submodule with controller named as dashboardController

angular.module('dashboard', []).controller('dashboardController', ['FriendsListService', '$scope', function (FriendsListService, $scope) {
    var self = this;
    self.msg = 'Welcome to the Dashboard';
    self.users = [];
    self.showThread = false;
    self.showMessage = false;

    function init() {
        var promise = FriendsListService.getFriendsList();
        promise.then(function (response) {
            if (response.length === 0)
                self.loginError = "Unable to get friends details";
            else {
                self.users = response;
            }
        }, function (error) {
            self.loginError = "Error occured";
        });
    }

    init();

    self.showConversationThread = function () {
        var details = { userId: "1", friendId: "2" };

        var promise = FriendsListService.getConversations(details);
        promise.then(function (response) {
            if (response.length === 0)
                self.loginError = "Unable to get friends details";
            else {
                if (response[0].notafriend)
                    self.showMessage = true;
                else {
                    self.messages = response;
                    self.showThread = true;
                }
            }
        }, function (error) {
            self.loginError = "Error occured";
        });
    };

    var socket = io();
    socket.on('refresh friendslist', function (msg) {
        $scope.$applyAsync(function () {
            self.users = msg;
        });
    });

}]).factory('FriendsListService', function ($http, $log, $q) {
    return {
        getFriendsList: function () {
            var deferred = $q.defer();
            $http.get('http://localhost:3000/getFriendsList')
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (msg, code) {
                    deferred.reject(msg);
                });
            return deferred.promise;
        },
        getConversations: function (details) {
            var config = {
                params: { "username": details.userId, "password": details.friendId }
            };
            var deferred = $q.defer();
            $http.get('http://localhost:3000/getConversations', config)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (msg, code) {
                    deferred.reject(msg);
                });
            return deferred.promise;
        }
    }
});