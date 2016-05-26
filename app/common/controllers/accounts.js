'use strict';

angular.module('myApp.account', ['ngRoute'])

.controller('accountCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.userNamePrefered = 'Garrett';
	$scope.userNameFirst = 'Garrett';
	$scope.userNameLast = 'Culos';
	$scope.JiraAccounts	=[];
	$scope.message = 'Welcome ' + $scope.userNamePrefered;
	
	
	$scope.viewUserUpdate=false;
	$scope.viewAccounts=false;

  syncAccounts();
  
	function syncAccounts(){
		$scope.hiddenJiraAccounts = [];
		$http({
		
			method: 'GET',
			url: '/account/fetch_accounts'

		}).then(function successCallback(response){
			$scope.JiraAccounts = response.data;

		}, function errorCallback(response){
			console.log(response);
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

	$scope.addAccount = function(URL,usr,pass,prot){
		$http({
			method: 'POST',
			url: '/account/add_account',
			data: {url:URL, user_name:usr, password:pass, protocal:prot}
		}).then(function successCallback(response){
			syncAccounts();
		}, function errorCallback(response){
			console.log(response);
		});
		$scope.JiraAccounts=$scope.JiraAccounts.concat();
	}
	$scope.delete = function(id){
		var account = $scope.JiraAccounts[id];
		$http({
			method: 'POST',
			url: '/account/remove_account',
			data: {url:account.url, user_name:account.user_name}
		}).then(function successCallback(response){
			syncAccounts();
		}, function errorCallback(response){
			console.log(response);
		});
		$scope.JiraAccounts=$scope.JiraAccounts.concat();
	}

	

	$scope.hideAccount = function( idx ){
		$scope.hiddenJiraAccounts.push($scope.JiraAccounts[ idx ]);
		$scope.JiraAccounts.splice(idx,1);
	}
	$scope.showAccount = function( idx ){
		$scope.JiraAccounts.push($scope.hiddenJiraAccounts[ idx ]);
		$scope.hiddenJiraAccounts.splice(idx,1);
	}


}]);