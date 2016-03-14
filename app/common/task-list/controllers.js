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
			// console.log(res.data);
			$scope.usrAccountData = res.data;

		}, function errorCallback(res){

		});

	});

	// Filters
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
		// {	"name": 	"To Do",
		// 	"isActive": true},
		// {	"name": 	"To Do",
		// 	"isActive": true}
	];

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

	$scope.pauseAllTimers=function(accountNumber,taskNumber) {
			$scope.$broadcast('timer-clear');	
			$scope.isActive = false;
			// console.log('All-Pause');
			// console.log('isActive:'+$scope.isActive);
	}

	$scope.toggleClick =  function(accountNumber, taskNumber) {
		resetActiveTasks();
		$scope.activeTask[accountNumber][taskNumber]='select-active';
	}

}])


.controller('timeController', ['$scope', '$http', function($scope, $http) {
	$scope.isActive=false;
	$scope.timerPaused = false;
	$scope.timerStarted=false;
	$scope.pausedClass='paused';
	
	$scope.stateLog = function(){
		console.log('Timer started:'+$scope.timerStarted);
		console.log('Timer paused:'+$scope.timerPaused);
		console.log('Active state:'+$scope.isActive);
	}

	$scope.$on('timer-stopped', function (event, data){
		console.log('Timer Stopped - data = ', data);
	});
	
	$scope.timerControl = function(){
		if(!$scope.timerStarted){
			$scope.$broadcast('timer-start');
			$scope.timerStarted=true;
			$scope.isActive=true;
			$scope.pausedClass='';
		}else{
			if($scope.isActive ){
				$scope.isActive=true;
				if($scope.timerPaused){
					$scope.$broadcast('timer-resume');
					$scope.timerPaused = false;
					$scope.pausedClass='';
					
					console.log('Resumed');
				}else{
					$scope.$broadcast('timer-stop');
					$scope.timerPaused = true;
					$scope.pausedClass='paused';

					console.log('Paused');
				}
				// console.log('isActive:'+$scope.isActive);
			}else{
				$scope.isActive = true;	
				
				if($scope.timerPaused){
					// $scope.$broadcast('timer-resume');
					// $scope.pausedClass='';
					// $scope.timerPaused = false;
					
					// console.log('Timer Resumed');
				}else{
					$scope.$broadcast('timer-stop');
					$scope.timerPaused = true;
					$scope.pausedClass='paused';

					console.log('Paused');
				}
			// console.log('isActive:'+$scope.isActive);
			}
		}
	}

}]);