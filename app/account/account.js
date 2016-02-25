'use strict';

angular.module('myApp.account', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/account', {
    templateUrl: 'account/account.html',
    controller: 'accountCtrl'
  });
}])

.controller('accountCtrl', ['$scope', function($scope) {
	$scope.userNamePrefered = 'Garrett';
	$scope.userNameFirst = 'Garrett';
	$scope.userNameLast = 'Culos';
	
	$scope.message = 'Welcome ' + $scope.userNamePrefered;
	
	
	$scope.viewUserUpdate=false;
	$scope.viewAccounts=false;

	$scope.updateUser = function(){
		$scope.viewUserUpdate = true;
	}

	$scope.closeUpdateUser = function(){
		$scope.viewUserUpdate = false;
	}

	$scope.updateAccount = function(){
		$scope.viewAccounts = true;
	}

	$scope.closeAccountUpdater = function(){
		$scope.viewAccounts = false;
	}
	// PLEASE INSERT YOUR USER NAME AND PASSWORDW BELOW
	$scope.jiraAccounts = [
		{url:'http://jira.highwaythreesolutions.com', account:'', password:''},
	];
	$scope.hiddenJiraAccounts = [];

	$scope.addAccount = function(URL,usr,pass){
		$scope.jiraAccounts=$scope.jiraAccounts.concat({url:URL, account:usr, password:pass});
	}
	$scope.hideAccount = function( idx ){
		$scope.hiddenJiraAccounts.push($scope.jiraAccounts[ idx ]);
		$scope.jiraAccounts.splice(idx,1);
	}
	$scope.showAccount = function( idx ){
		$scope.jiraAccounts.push($scope.hiddenJiraAccounts[ idx ]);
		$scope.hiddenJiraAccounts.splice(idx,1);
	}

	$scope.delete = function ( idx ) {
		$scope.jiraAccounts.splice(idx,1);
	}
}]);