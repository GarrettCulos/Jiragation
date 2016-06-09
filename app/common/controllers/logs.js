'use strict';

angular.module('myApp.logs', ['ngMaterial', 'ngRoute', 'timer', 'appFilters'])

.controller('logsCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
  	
  	$scope.maxDate = new Date();
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth()+1;
	if(month<10){
		month = "0"+month;
	}
	var year = date.getFullYear();
	var oneDay = 24*60*60*1000;

	$scope.get_todays_logs = function(){
		var now = new Date();
		var today = new Date(now.getTime()-((now.getMinutes()*60)+(now.getHours()*60*60)+(now.getSeconds()))*1000)
		var tomorrow = new Date( today.getTime()+oneDay);

		$scope.getlogs(today, tomorrow)
	}

	$scope.getlogs = function(start_date, end_date){
		var diffDays = Math.ceil(Math.abs((end_date.getTime() - start_date.getTime())/(oneDay)));
		var day_array = []
		
		for(var i=0; i<diffDays; i++){
			day_array.push({
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

				filter_data(day_array,res).then(function(response){

					summarize_data(response).then(function(res){
						console.log(res);
						$scope.queryLog=res;
					})

				});

			} else{
				console.log('No data');
			}

		}, function errorCallback(res){
			console.log(res);
		});		
		
	}


	function filter_data(day_array, data) {
		var response = day_array;
		var deferred = $q.defer();
		
		angular.forEach(day_array, function(day, day_key){

			angular.forEach(data.data.time_logs, function(task, key){
			
				if (task.start_time > day.date.getTime()  && task.start_time < (day.date.getTime()+oneDay) ) {
					response[day_key].logs.push(task);
					deferred.resolve(response);
				}

			});

		});

		return deferred.promise;
	}

	function summarize_data(data) {

		var response = [];
		var deferred = $q.defer();
		
		angular.forEach(data, function(day, day_key){
			
			response.push({
				date: day.date,
				time_logged: 0, 
				tasks: [],
				tasks_temp: []
			});
			angular.forEach(day.logs, function(task, key){
				
				var task_id = task.task_id;
				var index = response[day_key].tasks_temp.indexOf(task_id)
				if( index == -1 ){
					var logged_time = task.end_time-task.start_time;

					response[day_key].tasks_temp.push(task_id);
					response[day_key].tasks.push({
						task_id: task_id,
						logged_time: [task],
						total_time: logged_time
					});
					response[day_key].time_logged += logged_time;
					deferred.resolve(response);

				} else {
					var logged_time = task.end_time-task.start_time;
					
					response[day_key].tasks[index].total_time += logged_time;
					response[day_key].tasks[index].logged_time.push(task);
					response[day_key].time_logged += logged_time;

					deferred.resolve(response);
				}

			});

		});

		return deferred.promise;
	}
	 	
	// $scope.getlogs('2016-06-06T07:00:00.000Z','2016-06-07T07:00:00.000Z');
}]).directive('logbar', function() {
  return {
  	restrict: 'E',
  	scope: true,
    replace: true,
    templateUrl: './common/logs/log_bar.html',
    link: function(scope, elem, attrs){
      scope.task_log = JSON.parse(attrs.data);
      console.log(scope.task_log.task_id);
    }
  };
});