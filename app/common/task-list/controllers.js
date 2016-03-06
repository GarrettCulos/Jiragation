'use strict';

angular.module('myApp.taskList', ['ngRoute','timer'])

.controller('userController', ['$scope', '$http', function($scope, $http) {

	$scope.userNamePrefered = 'Garrett';
	$scope.userNameFirst = 'Garrett';
	$scope.userNameLast = 'Culos';
	
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
		// if($scope.activeTask[accountNumber][taskNumber]==''){
			$scope.$broadcast('timer-clear');	
			console.log('All-Pause');
		// }
	}

	$scope.toggleClick =  function(accountNumber, taskNumber) {
		resetActiveTasks();
		$scope.activeTask[accountNumber][taskNumber]='select-active';
	}

}])


.controller('timeController', ['$scope', '$http', function($scope, $http) {
	$scope.timerRunning = false;
	$scope.timerPaused = false;

			$scope.$on('timer-stopped', function (event, data){
				console.log('Timer Stopped - data = ', data);
			});

	$scope.startPauseResumeTimer = function(){
		if(!$scope.timerRunning && !$scope.timerPaused){
			$scope.$broadcast('timer-start');
			$scope.timerRunning=true;	
			console.log('Timer Started')
		} else if($scope.timerPaused) {
			$scope.$broadcast('timer-resume');
			$scope.timerPaused = false;
			console.log('Timer Resumed')
		}else{
			$scope.$broadcast('timer-stop');
			$scope.timerPaused = true;
			console.log('Timer Paused')
		}
	}

	// $scope.pauseTimer = function (){
	// 	if(!$scope.timerPaused){
	// 		$scope.$broadcast('timer-stop');
	// 		$scope.timerPaused = true;
	// 		console.log('Timer Paused')
	// 	} else {
	// 		$scope.$broadcast('timer-resume');
	// 		$scope.timerPaused = false;
	// 		console.log('Timer Resumed')
 // 		}
	// };
}]);
