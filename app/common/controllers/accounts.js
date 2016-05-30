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
  
  // PLEASE INSERT YOUR USER NAME AND PASSWORDW BELOW
	$scope.hiddenJiraAccounts = [];

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
	
	$scope.addAccount = function(URL,usr,pass){
		var url_prot = URL.split('://');
		$http({
			method: 'POST',
			url: '/account/add_account',
			data: {url:url_prot[1], user_name:usr, password:pass, protocal:url_prot[0]}
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