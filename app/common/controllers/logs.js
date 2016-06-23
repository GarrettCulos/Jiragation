'use strict';

angular.module('myApp.logs', ['ngMaterial', 'ngRoute', 'timer', 'appFilters'])

.controller('logsCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
  
  $scope.queryTodays = false;
  $scope.maxDate = new Date();
  $scope.logdate={};

	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth()+1;
	var year = date.getFullYear();
	var oneDay = 24*60*60*1000;
	if(month<10){
		month = "0"+month;
	}
	
	$scope.get_todays_logs = function(){
		var now = new Date();
		var today = new Date(now.getTime()-((now.getMinutes()*60)+(now.getHours()*60*60)+(now.getSeconds()))*1000)
		var tomorrow = new Date( today.getTime()+oneDay);

		getlogs(today, tomorrow);
	}

	$scope.getRangeLogs = function(){
		console.log($scope);
		
		var startDate = new Date($scope.logdate.start);
		var endDate = new Date($scope.logdate.end);

		getlogs(startDate.getTime(), endDate.getTime()+oneDay);
	}

	function getlogs(startD, endD){
		console.log(startD);
		console.log(endD);
		var start_date = new Date(startD);
		var end_date = new Date(endD);
		console.log(start_date);
		console.log(end_date);
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
	 	
}]).directive('logbar', ['$q', function($q) {
	return {
		restrict: 'E',
		scope: true,
		replace: true,
		templateUrl: './common/logs/log_bar.html',
		link: function(scope, elem, attrs){
			scope.task_log = JSON.parse(attrs.data);
			var oneDay = 24*60*60*1000;
			var day_start = (new Date(scope.task_log.date)).getTime()

			linearize(scope.task_log.tasks).then(function(response){
				console.log(response);
				scope.task_lines = response;
			});
			
			scope.inactive = true;
			scope.isActive = function(){
				scope.inactive = !scope.inactive;
			}

			function linearize(data) {

				var response = [];
				var deferred = $q.defer();
				var colors = [
					'#FFB429'
					, '#BBFF29'
					, '#29FF3B'
					, '#29FFF4'
					, '#2986FF'
					, '#6D29FF'
					, '#FF2942'
					, '#C57BE0'
					, '#7BC7E0'
				]

				angular.forEach(data, function(task, task_key){
					response.push({
						task_id: task.task_id,
						color: colors[task_key],
						lines : []
					})

					angular.forEach(task.logged_time, function(log, log_key){
						response[task_key].lines.push({
							day_start: day_start,
							width: (parseInt(log.end_time) - parseInt(log.start_time))*100/oneDay,
							start_time: log.start_time,
							end_time:log.end_time,
							start: (parseInt(log.start_time) - day_start)/oneDay*100,
							end: (parseInt(log.end_time) - day_start)/oneDay*100
						});
						deferred.resolve(response);
					});
				});

				return deferred.promise;
			}
		}
	};
}]);