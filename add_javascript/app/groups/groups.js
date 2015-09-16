'use strict';

angular.module('groups', [
	'ngRoute',
	'ngMaterial',
	'ngResource'
])



.config([
	'$routeProvider',

	function ($routeProvider) {
		$routeProvider
			.when('/groups', {
		    	title    	: 'Groups',
		    	templateUrl	: 'app/groups/groups.html',
		    	controller 	: 'GroupsCtrl' 
		    })
		    .when('/edit-group/:id', {
		    	title    	: 'Edit group',
		    	templateUrl	: 'app/groups/group-add-edit.html',
		    	controller 	: 'GroupAddEditCtrl',
		    	resolve		: {
		    		group: [ '$route', 'Groups', 

		    			function ($route, Groups) {
		    				return Groups.query({
		    					id: $route.current.params.id
		    				}).$promise;
		    			}
		    		]
		    	}
		    });
	}
])


.factory('Groups', [
	'$resource',

	function ($resource) {
		return $resource('/api/v2/db/_table/contact_group/:id', { id: '@id' }, {
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



.controller('GroupsCtrl', [
	'$scope', 'Groups', '$location', '$mdDialog', '$route',

	function ($scope, Groups, $location, $mdDialog, $route) {

		$scope.paginate = { page: 0, limit: 15 }

		$scope.loadData = function (page) {
			$scope.paginate.page = page;

			Groups.query({
				include_count: true,
				offset: $scope.paginate.page * $scope.paginate.limit,
				limit: $scope.paginate.limit
			}).$promise.then(function (result) {
				$scope.groups = result.resource
				$scope.paginate.meta = result.meta;
			});	
		};

		$scope.addEdit = function (ev, item) {
			if (item) {
				$location.path('/edit-group/' + item.id);
			} else {
				$mdDialog.show({
			    	controller: 'GroupAddEditCtrl',
			    	template: [
			    		'<md-dialog>',
			    			'<div ng-include="\'app/groups/group-add-edit.html\'"></div>',
			    		'</md-dialog>'
			    	].join(''),
			    	parent: angular.element(document.body),
			    	targetEvent: ev,
			    	locals: {
			    		group: { }
			    	}
				}).then(function () {
					$route.reload();
				});
			}
		};

		$scope.loadData(0);
	}
])


.controller('GroupAddEditCtrl', [
	'$scope', '$mdDialog', 'Groups', 'group', 'ContactRelationships', 'Contacts', '$filter', '$mdToast', '$location',

	function ($scope, $mdDialog, Groups, group, ContactRelationships, Contacts, $filter, $mdToast, $location) {
		$scope.group = angular.copy(group);

		$scope.allContacts = Contacts.query();

		$scope.loadContacts = function () {
			ContactRelationships.query({
				filter: 'contact_group_id=' + group.id
			}).$promise.then(function (result) {
				if (result.resource) {
					$scope.contacts = result.resource.map(function (item) {
						return {
							relationshipId: item.id,
							data: Contacts.get({ id: item.contact_id })
						};
					});
				}
			});	
		};

		if (group.id) {
			$scope.loadContacts();	
		}

		$scope.showContact = function (contact) {
			$location.path('/edit-contact/' + contact.id);
		};
		
		$scope.removeContact = function  (contact) {
			ContactRelationships.remove({
				id: contact.relationshipId
			}).$promise(function () {
				$scope.loadContacts();
				$mdToast.show($mdToast.simple().content('Contact removed from group!'));
			});
		};

		$scope.addContact = function (contact) {
			var existing = $scope.contacts.filter(function (item) { return item.data.id === contact.id }) [0];
			if (existing) return;

			ContactRelationships.create({
				contact_id: contact.id,
				contact_group_id: group.id
			}).$promise.then(function () {
				$scope.loadContacts();
				$mdToast.show($mdToast.simple().content('Contact added to group!'));
			});

			$scope.selectedContact = null;
			$scope.searchText = '';
		};

		$scope.searchContacts = function (searchText) {
			var items = $filter('filter')($scope.allContacts.resource, searchText);
			return items.filter(function (item) {
				return !$scope.contacts.some(function (contact) {
					return contact.data.id === item.id;
				});
			});
		};

		$scope.submit = function () {
			if (!$scope.group.id) {
				Groups.create($scope.group).$promise.then(function () {
					$scope.cancel();
					$mdToast.show($mdToast.simple().content('Group created!'));
				});	
			} else {
				Groups.update({ id: 
					$scope.group.id 
				}, $scope.group).$promise.then(function () {
					$scope.cancel();
					$mdToast.show($mdToast.simple().content('Group saved!'));
				});
			}
			
		};

		$scope.cancel = function () {
			if ($scope.group.id)
				$location.path('/groups');
			else 
				$mdDialog.cancel();
		};
	}
]);