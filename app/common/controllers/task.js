'use strict';

angular.module('myApp.task', ['ngRoute','timer','appFilters'])

.controller('taskController', ['$scope', '$http', function($scope, $http) {

	function timerDataToUnix(data) {
		var msPsec = 1000;
		var secPmin = 60;
		var minPhr = 60;
		var hrPday = 24;
		return data.millis + msPsec*data.seconds + msPsec*secPmin*data.minutes + msPsec*secPmin*minPhr*data.hours + msPsec*secPmin*minPhr*hrPday *data.days;
	}

	$scope.isActive=false;
	$scope.timerStarted=false;
	
	$scope.taskLink = function(){	
	}

	$scope.getTaskTime = function(){
		if($scope.task.key){
			// var taskID = ;
			$http({
				method:  'GET',
				url: 	 '/task/getTaskTime',
				params:  { task_id: $scope.task.key},
				headers: {'Content-Type': 'application/json'}

			}).then(function successCallback(res){		
				if(res.data.logged_time > 0 ) $scope.timeLogged = res.data.logged_time;
			}, function errorCallback(res){
				console.log(res);
			});	
		}
	}

	$scope.getTaskTime();
	
	$scope.stateLog = function(){
		console.log('Timer started:'+$scope.timerStarted);
		console.log('Active state:'+$scope.isActive);
	}

	$scope.$on('timer-stopped', function (event, logged_time){
		var date = new Date();
		var response = {
			task_id: $scope.task.key,
			start_time: date.getTime(),
			end_time: date.getTime()+timerDataToUnix(logged_time)
		}
		// send data to databse
		$http({
			method: 'POST',
			url: 	'/task/trackTime',
			data: 	JSON.stringify(response),
			headers: {
			  	'Content-Type': 'application/json',
			}

		}).then(function successCallback(res){
			console.log(res.data);
			// console.log('Timer Stopped - data = ', data);
			$scope.usrAccountData = res.data;

		}, function errorCallback(res){
			console.log('Warning Will Robinson');
		});
	});
	
	$scope.timerToggle = function(){
		if(!$scope.timerStarted){
			$scope.$broadcast('timer-start');
			$scope.timerStarted=true;
			$scope.isActive=true;
			$scope.getTaskTime();
		}else{
			$scope.$broadcast('timer-stop');
			$scope.timerStarted=false;
			$scope.isActive=false;
			$scope.getTaskTime();
		}
	}

}]);