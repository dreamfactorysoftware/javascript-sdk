
'use strict';


angular.module('contact-info', [
	'ngResource',
	'ngRoute',
	'ngMaterial',
	'ngAnimate',
	'contacts',
	'groups'
])

.config([
	'$routeProvider',

	function ($routeProvider) {

		// Routes
		$routeProvider
		    .when('/contact-info/:id', {
		    	title    	: 'Contact Info',
		    	templateUrl	: 'app/contact-info/contact-info.html',
		    	controller 	: 'ContactInfoCtrl' 
		    });

	}
])

.factory('ContactInfo', [
	'$resource',

	function ($resource) {
		return $resource('/api/v2/db/_table/contact_info/:id', { id: '@id' }, {
			query: {
				method: 'GET',
				isArray: false
			},
			create: {
				method: 'POST'
			},
			update: {
				method: 'PUT'
			},
			remove: {
				method: 'DELETE'
			}
		});
	}
])


.controller('ContactInfoCtrl', [
	'$scope', '$location', '$route', '$mdDialog', '$mdToast', 'ContactInfo',

	function ($scope, $location, $route, $mdDialog, $mdToast, ContactInfo) {
		$scope.contactName = $route.current.params.name;
		$scope.paginate = { page: 0, limit: 15 }

		$scope.loadData = function (page) {
			$scope.paginate.page = page;

			ContactInfo.query({ 
				include_count: true,
				filter: 'contact_id=' + $route.current.params.id 
			}).$promise.then(function (result) {
				$scope.contactInfo = result.resource;
				$scope.paginate.meta = result.meta;
			});
		};


		$scope.addEditContactInfo = function (ev, item) {
			$mdDialog.show({
		    	controller: 'ContactInfoUpdateCtrl',
		    	templateUrl: 'app/contact-info/contact-info-add-edit.html',
		    	parent: angular.element(document.body),
		    	targetEvent: ev,
		    	locals: {
		    		contactInfo: item || { contact_id: $route.current.params.id, id: '' }
		    	}
			}).then(function () {
				$scope.loadData();
			});
		};

		$scope.loadData(0);
	}
])


.controller('ContactInfoUpdateCtrl', [
	'$scope', '$mdDialog', 'ContactInfo', 'contactInfo', '$mdToast',

	function ($mdScope, $mdDialog, ContactInfo, contactInfo, $mdToast) {
		$mdScope.contactInfo = angular.copy(contactInfo);
		$mdScope.info_types = [ 'home', 'work', 'mobile' ];

		$mdScope.submit = function () {
			if (!$mdScope.contactInfo.id) {
				ContactInfo.create($mdScope.contactInfo).$promise.then(function () {
					$mdToast.show($mdToast.simple().content('Contact saved!'));
    				$mdDialog.hide($mdScope.contactInfo);
				});	
			} else {
				ContactInfo.update({ id: 
					contactInfo.id 
				}, $mdScope.contactInfo).$promise.then(function () {
					$mdToast.show($mdToast.simple().content('Contact saved!'));
    				$mdDialog.hide($mdScope.contactInfo);
				});
			}
			
		};

		$mdScope.cancel = function () {
			$mdDialog.cancel();
		};
	}
]);