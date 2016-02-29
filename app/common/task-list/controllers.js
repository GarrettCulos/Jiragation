'use strict';

angular.module('myApp.taskList', ['ngRoute', 'base64', 'tastFilters'])

.controller('userController', ['$base64','$scope', '$http', function($base64,$scope, $http) {
	$scope.userNamePrefered = 'Garrett';
	$scope.userNameFirst = 'Garrett';
	$scope.userNameLast = 'Culos';
	
	$scope.jiraAccounts;
	// 	{url:'http://jira.highwaythreesolutions.com', account:'gculos', password:''},
	// 	{url:'https://vividsolutions.atlassian.net', account:'gculos', password:''},
	// 	{url:'http://projects.markerseven.com', account:'gculos', password:''},
	// ];

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

			$scope.usrAccountData = res.data;

		}, function errorCallback(res){

		});
		// angular.forEach($scope.jiraAccounts, function(account, key) {

		// 	console.log(account);
		// 	var base = account['url'];
		// 	var usr = account['user_name'];
		// 	var password = account['password'];
		// 	var usrPassEncoded = ($base64.encode(usr + ':' + password));// 
		// 	// console.log(usrPassEncoded);

		// 	$http({
			
		// 		method: 'GET',
		// 		url: base+'/rest/api/2/search?jql=assignee='+ usr + '+order+by+duedate',
		// 		headers: {'Content-Type':  'application/json', 'Authorization': 'Basic '+ usrPassEncoded}

		// 	}).then(function successCallback(response) {
			
		// 		// this callback will be called asynchronously
		// 		// when the response is available
		// 		// console.log('Success');
		// 		$scope.usrAccountData.push(response.data);
				
		// 	}, function errorCallback(response) {
		// 		// called asynchronously if an error occurs
		// 		// or server returns response with an error status.
		// 		console.log('http request failure');
		// 	});
			
		// });

	});
	

	// // basic access to jira via user name and password
	// $scope.usrAccountData=[];

	// angular.forEach($scope.jiraAccounts, function(account, key) {
	// 	console.log(account)
	// 	var base = account['url'];
	// 	var usr = account['user_name'];
	// 	var password = account['password'];
	// 	var usrPassEncoded = ($base64.encode(usr + ':' + password));// 
	// 	console.log(usrPassEncoded);

	// 	$http({
	// 		method: 'GET',
	// 		url: base+'/rest/api/2/search?jql=assignee='+ usr + '+order+by+duedate',
	// 		headers: {'Content-Type':  'application/json', 'Authorization': 'Basic '+ usrPassEncoded }

	// 	}).then(function successCallback(response) {
	// 		// this callback will be called asynchronously
	// 		// when the response is available
	// 		// console.log('Success');
	// 		$scope.usrAccountData.push(response.data);
			
	// 	}, function errorCallback(response) {
	// 		// called asynchronously if an error occurs
	// 		// or server returns response with an error status.
	// 		console.log('http request failure');
	// 	});
		
	// });

	$scope.updateRightView = function(accountNumber, taskNumber) {
		$scope.rightView = usrAccountData[accountNumber][taskNumber];
		console.log(rightView);
	}
}]);
