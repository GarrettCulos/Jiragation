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
	$scope.timerRunning=[];
	function resetActiveTasks(){
		angular.forEach($scope.usrAccountData, function(value,key1){
			$scope.activeTask[key1]=[];
			$scope.timerRunning[key1]=[];
			var acct = value.issues;
			angular.forEach(acct, function(task,key2){
				$scope.activeTask[key1][key2]='';
				$scope.timerRunning[key1][key2]=false;
			});
		});	
	}

	$scope.toggleClick =  function(accountNumber, taskNumber) {
		resetActiveTasks();
		$scope.activeTask[accountNumber][taskNumber]='select-active';
		$scope.timerRunning[accountNumber][taskNumber]=true;

	}

	// Timer 
	// $scope.$on('timer-stopped', function (event, data){
	// 	console.log('Timer Stopped - data = ', data);
	// });
	// $scope.startTimer = function (){
	// 	$scope.$broadcast('timer-start');
	// 	$scope.timerRunning = true;
	// };

	// $scope.stopTimer = function (){
	// 	$scope.$broadcast('timer-stop');
	// 	$scope.timerRunning = false;
	// };

	// $scope.$on('timer-stopped', function (event, data){
	// 	console.log('Timer Stopped - data = ', data);
	// });

}])
.controller('timeController', ['$scope', '$http', function($scope, $http) {
	$scope.timerRunning = false;

	// Timer 
	$scope.$on('timer-stopped', function (event, data){
		console.log('Timer Stopped - data = ', data);
	});

	$scope.pauseTimer = function (){
		if($scope.timerRunning){
			$scope.$broadcast('timer-stop');
			console.log('timer Stoped')
			$scope.timerRunning = false;
		} else {
			$scope.$broadcast('timer-start');
			console.log('timer started')
			$scope.timerRunning = true;
		}
	};

	$scope.$on('timer-stopped', function (event, data){
		console.log('Timer Stopped - data = ', data);
	});

}]);
