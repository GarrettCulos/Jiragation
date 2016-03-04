'use strict';

angular.module('myApp.taskList', ['ngRoute'])

.controller('userController', ['$scope', '$http', function($scope, $http) {
	$scope.userNamePrefered = 'Garrett';
	$scope.userNameFirst = 'Garrett';
	$scope.userNameLast = 'Culos';
	
	$scope.jiraAccounts;

	$scope.taskStatuses = [
		{"name":"Open"},
		{"name":"Resolved"},
		{"name":"Closed"}
	];

	$scope.viewStatuses=[];

	$scope.filterStatus = function(status){
		// console.log(status);
		var i = $scope.viewStatuses.indexOf(status);
		// console.log('first' + $scope.viewStatuses);
		// console.log(i);
		if(i > -1){
			$scope.viewStatuses.splice(i, 1);
			// console.log('2' + $scope.viewStatuses);
		} else {
			$scope.viewStatuses.push(status);
			// console.log('3' + $scope.viewStatuses);
		}
	};

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
			console.log(res.data);
			$scope.usrAccountData = res.data;

		}, function errorCallback(res){

		});

	});
	

	$scope.updateRightView = function(accountNumber, taskNumber) {
		$scope.rightView = usrAccountData[accountNumber][taskNumber];
		console.log(rightView);
	}
}]);
