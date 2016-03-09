'use strict';

angular.module('myApp.account', ['ngRoute'])

.controller('accountCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.userNamePrefered = 'Garrett';
	$scope.userNameFirst = 'Garrett';
	$scope.userNameLast = 'Culos';
	$scope.jiraAccounts	=[];
	$scope.message = 'Welcome ' + $scope.userNamePrefered;
	
	
	$scope.viewUserUpdate=false;
	$scope.viewAccounts=false;

	function syncAccounts(){
		$scope.hiddenJiraAccounts = [];
		$http({
		
			method: 'GET',
			url: '/account/fetch_accounts'

		}).then(function successCallback(response){

			console.log(response.data);
			$scope.jiraAccounts = response.data;

		}, function errorCallback(response){

		});
	}

	$scope.updateUser = function(){
		syncAccounts();
		$scope.viewUserUpdate = true;
	}

	$scope.closeUpdateUser = function(){
		$scope.viewUserUpdate = false;
	}

	$scope.updateAccount = function(){
		syncAccounts();
		$scope.viewAccounts = true;
	}

	$scope.closeAccountUpdater = function(){
		$scope.viewAccounts = false;
	}
	// PLEASE INSERT YOUR USER NAME AND PASSWORDW BELOW
	$scope.hiddenJiraAccounts = [];

	$scope.addAccount = function(URL,usr,pass){
		$http({
		
			method: 'POST',
			url: '/account/add_accounts',
			data: {url:URL, account:usr, password:pass}
		})
		.then(function successCallback(response){

			syncAccounts();
		}, function errorCallback(response){

		});
		$scope.jiraAccounts=$scope.jiraAccounts.concat();
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