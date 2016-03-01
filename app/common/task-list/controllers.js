'use strict';

angular.module('myApp.taskList', ['ngRoute', 'base64', 'tastFilters'])

.controller('userController', ['$base64','$scope', '$http', function($base64,$scope, $http) {
	$scope.userNamePrefered = 'Garrett';
	$scope.userNameFirst = 'Garrett';
	$scope.userNameLast = 'Culos';
	
	$scope.jiraAccounts;

	$http({
		
		method: 'GET',
		url: '/account/fetch_accounts'

	}).then(function successCallback(response){

		$scope.jiraAccounts = response.data;

	}, function errorCallback(response){

	}).then(function(){

		$http({
		
			method: 'GET',
			url: '/pull_jiras/jira_accounts'

		}).then(function successCallback(res){
			console.log(res);
			$scope.usrAccountData = res.data;

		}, function errorCallback(res){

		});

	});
	

	$scope.updateRightView = function(accountNumber, taskNumber) {
		$scope.rightView = usrAccountData[accountNumber][taskNumber];
		console.log(rightView);
	}
}]);
