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
	$scope.timerPaused = false;
	$scope.timerStarted=false;
	$scope.pausedClass='paused';
	
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
				var logged_time = 0;
				res.data.forEach(function(log){
					logged_time = logged_time+ parseInt(log.logged_time);
				});

				console.log(logged_time);
				$scope.timeLogged = logged_time;
		
				// console.log('Timer Stopped - data = ', data);
			}, function errorCallback(res){
				console.log(res);
			});	
		}
	}

	$scope.getTaskTime();
	
	$scope.stateLog = function(){
		console.log('Timer started:'+$scope.timerStarted);
		console.log('Timer paused:'+$scope.timerPaused);
		console.log('Active state:'+$scope.isActive);
	}

	
	$scope.$on('timer-stopped', function (event, logged_time){
		console.log(timerDataToUnix(logged_time));
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