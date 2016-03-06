'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.taskList',
  'myApp.account',
  'myApp.version',
  'timer'
])
.config(['$routeProvider', function($routeProvider) {
 	$routeProvider
	.when('/', {
		templateUrl: 'common/task-list/taskList.html',
    	controller: 'userController'
	})
	.when('/task-list', {
		templateUrl: 'common/task-list/taskList.html',
    	controller: 'userController'
	})
	.when('/account', {
    	templateUrl: 'common/account/account.html',
    	controller: 'accountCtrl'
	})
  	.otherwise({
  		templateUrl: 'common/404.html',
    });
}]);