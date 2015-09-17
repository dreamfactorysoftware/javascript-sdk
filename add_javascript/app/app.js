'use strict';


angular.module('addressbook', [
	'ngRoute',
	'ngMaterial',
	'ngCookies',

	'login',
	'contacts',
	'groups'

])

.constant('DSP_API_KEY', '6b8254f00acce6fed8ac6d16ea5a8300b32f4123d34d3cfb97e82cdcf85494ab')

.run([
	'$cookies', 'DSP_API_KEY', '$http', '$rootScope',

	function ($cookies, DSP_API_KEY, $http, $rootScope) {
    	$http.defaults.headers.common['X-Dreamfactory-API-Key'] = DSP_API_KEY;
		$http.defaults.headers.common['X-DreamFactory-Session-Token'] = $cookies.session_token;
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			$rootScope.isMobile = true;
		}
	}
])

// Config - configure applicaiton routes and settings
.config([ 
	'$routeProvider', '$httpProvider', 'DSP_API_KEY', '$mdThemingProvider',
	
	function ($routeProvider, $httpProvider, DSP_API_KEY, $mdThemingProvider) {
		$routeProvider
		    .otherwise({
		      redirectTo:'/contacts'
		    });

		$httpProvider.interceptors.push('httpInterceptor');

		// Configure the theme of the whole app
		$mdThemingProvider.theme('default')
		    .primaryPalette('blue-grey')
		    .accentPalette('blue');
	}
])


// Authentication interceptor. Executes a function everytime before sending any request.
.factory('httpInterceptor', [
	'$location',

	function ($location) {

		return {
			responseError: function (result) {

				// If status is 401 then redirect
				if (result.status === 401) {
					$location.path('/login');	
				}
				return result;
			}
		}
	}
])

// Header controller
.controller('HeaderCtrl', [ 
	'$scope', '$mdSidenav', '$mdUtil', '$http', '$location', '$rootScope',

	function ($scope, $mdSidenav, $mdUtil, $http, $location, $rootScope) {
		$rootScope.isLoggedIn = true;
		
		$scope.toggleSidebar = $mdUtil.debounce(function () {
	        $mdSidenav('left-sidebar').toggle();
      	}, 200);

      	$scope.logout = function () {
      		$http({
      			method: 'DELETE',
      			url: '/user/session'
      		}).success(function () {
      			$location.path('/login');
      		});
      	};
	}

])


// Sidebar controller
.controller('SidebarCtrl', [
	'$scope', '$mdSidenav', '$mdUtil',

	function ($scope, $mdSidenav, $mdUtil) {
		$scope.toggleSidebar = $mdUtil.debounce(function () {
	        $mdSidenav('left-sidebar').toggle();
      	}, 200);
	}
]);
