'use strict';

angular.module('myApp.taskList', ['ngRoute','timer','appFilters'])

.controller('userController', ['$scope', '$http', function($scope, $http) {

	$scope.userNamePrefered = 'Garrett';
	$scope.userNameFirst = 'Garrett';
	$scope.userNameLast = 'Culos';
	$scope.isActive = false;

	$scope.jiraAccounts;

	// Fetch Jira Data
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
			
			// This should be proprocessed server side
			$scope.usrAccountData = res.data;

		}, function errorCallback(res){

		});

	});

	// Task Status Filters
	$scope.taskStatuses = [
		{	"name": 	"Open",
			"isActive": true},
		{	"name": 	"Resolved",
			"isActive": false},
		{	"name": 	"Closed",
			"isActive": false},
		{	"name": 	"To Do",
			"isActive": true},
		{	"name": 	"Reopened",
			"isActive": true},
		{	"name": 	"In Progress",
			"isActive": true},
		// {	"name": 	"To Do",
		// 	"isActive": true}
	];

	// Task Status Filter Toggle
	$scope.changeStatus = function(status){
		// console.log($scope.taskStatuses);
		for(var i=0; i<$scope.taskStatuses.length; i++){
			// console.log($scope.taskStatuses[i]);
			if(status == $scope.taskStatuses[i].name){
				if($scope.taskStatuses[i].isActive === false){
					$scope.taskStatuses[i].isActive = true;
				}else{
					$scope.taskStatuses[i].isActive =false;
				}		
			}
		}	
	};

	// Return Task Url
	$scope.taskUrl = function(taskKey, taskUrl) {
		return taskUrl.substring(0,taskUrl.indexOf('/rest/'))+'/browse/'+taskKey;
	}

	// Toggle active task		
	var accountNumber = 0;
	var taskNumber = 0;
	$scope.updateRightView = function(accountNumber, taskNumber) {
		var acct = $scope.usrAccountData[accountNumber].issues;
		$scope.rightView = acct[taskNumber];
	}

	$scope.activeTask=[];
	function resetActiveTasks(){
		$scope.allTimerPaused = false;
		angular.forEach($scope.usrAccountData, function(value,key1){
			$scope.activeTask[key1]=[];
			var acct = value.issues;
			angular.forEach(acct, function(task,key2){
				$scope.activeTask[key1][key2]='';
			});
		});	
	}

	// $scope.pauseAllTimers=function(accountNumber,taskNumber) {
	// 		$scope.$broadcast('timer-clear');	
	// 		$scope.isActive = false;
	// 		// console.log('All-Pause');
	// 		// console.log('isActive:'+$scope.isActive);
	// }


	// sort list by predicate
	$scope.predicate = 'task.fields.created';
	$scope.reverse = true;
	$scope.order = function(predicate) {
		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	};

	$scope.toggleClick =  function(accountNumber, taskNumber) {
		resetActiveTasks();
		$scope.activeTask[accountNumber][taskNumber]='select-active';
	}

}])


