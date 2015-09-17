'use strict';


angular.module('login', [
	'ngRoute',
	'ngResource',
	'ngCookies'
])


.config([

	'$routeProvider', 

	function ($routeProvider) {
		$routeProvider
			.when('/login', {
				title		: 'Login',
				controller	: 'LoginCtrl',
				templateUrl	:  'app/login/login.html'
			})
	}
])

.service('LoginHelper', [
	'$http', '$q', '$cookies',

	function ($http, $q, $cookies) {
		this.initiate = function (options) {
			var deferred = $q.defer();
			
			$http.post('/api/v2/user/session/', options).then(function (result) {
				$http.defaults.headers.common['X-DreamFactory-Session-Token'] = result.data.session_token;
				$cookies.session_token = result.data.session_token;
 				deferred.resolve();
			}, deferred.reject);

			return deferred.promise;
		};

		this.register = function (options) {
			var deferred = $q.defer();
			
			$http.post('/api/v2/user/register?login=true', options).then(function (result) {
				console.log(result);
 				deferred.resolve();
			}, deferred.reject);

			return deferred.promise;
		};
	}
])

.controller('LoginCtrl', [
	'$scope', 'LoginHelper', '$location', '$rootScope',

	function ($scope, LoginHelper, $location, $rootScope) {
		$rootScope.isLoggedIn = false;
		$scope.submit = function () {
			LoginHelper.initiate({
				email: $scope.username,
				password: $scope.password
			}).then(function () {
				$rootScope.isLoggedIn = true;
				$location.path('/contacts');
			});
		};

		$scope.register = function () {
			LoginHelper.register({
				email: $scope.username,
				password: $scope.password,
				first_name: 'Address',
				last_name: 'Book',
				name: 'Address Book User'
			});
		};
	}
])