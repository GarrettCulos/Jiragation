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
	
	$scope.stateLog = function(){
		console.log('Timer started:'+$scope.timerStarted);
		console.log('Timer paused:'+$scope.timerPaused);
		console.log('Active state:'+$scope.isActive);
	}

	
	$scope.$on('timer-stopped', function (event, data){
		var date = new Date();
		var response = {
			// task_id: $scope.task.key,
			// end_time: date.getTime(),
			// task_time: timerDataToUnix(data)
			task_id: $scope.task.key,
			end_time: 1231,
			task_time: 145123412
		}
		console.log(response)
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