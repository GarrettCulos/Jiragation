'use strict';

angular.module('myApp.logs', ['ngMaterial', 'ngRoute', 'timer'])

.controller('logsCtrl', ['$scope', '$http', function($scope, $http) {
  	
  	$scope.maxDate = new Date();
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth()+1;
	if(month<10){
		month = "0"+month;
	}
	var year = date.getFullYear();

	$scope.getlogs = function(start_date, end_date){
		var oneDay = 24*60*60*1000;
		var diffDays = Math.ceil(Math.abs((end_date.getTime() - start_date.getTime())/(oneDay)));
		$scope.queryLog = []
		
		for(var i=0; i<diffDays; i++){
			$scope.queryLog.push({
				date: new Date(start_date.getTime() + i*(oneDay)),
				logs: []
			})
		}

		$http({
			method:  'GET',
			url: 	 '/task/getTrackedTime',
			params:  { 
				earlier_time: start_date,
				later_time: end_date
			},
			headers: {'Content-Type': 'application/json'}

		}).then(function successCallback(res){		
			
			if(res.data.time_logs.length>0){
				angular.forEach($scope.queryLog, function(day, day_key){
					angular.forEach(res.data.time_logs, function(task, key){
						if (task.start_time > day.date.getTime()  && task.start_time < (day.date.getTime()+oneDay) ) {
							$scope.queryLog[day_key].logs.push(task);
						}
					});
				});
				console.log($scope.queryLog);
			} else{
				console.log('No data');
			}

		}, function errorCallback(res){
			console.log(res);
		});		
		
	}
	// $scope.getlogs('2016-06-06T07:00:00.000Z','2016-06-07T07:00:00.000Z');
}]);