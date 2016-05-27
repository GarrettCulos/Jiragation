'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.taskList',
  'myApp.logs',
  'myApp.account',
  'myApp.version',
  'myApp.task',
  'timer',
  'appFilters'
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
  .when('/logs', {
      templateUrl: 'common/logs/logs.html',
      controller: 'logsCtrl'
  })
  .otherwise({
    	templateUrl: 'common/404.html',
  });
}]);