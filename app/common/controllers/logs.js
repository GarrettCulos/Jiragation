'use strict';

angular
.module('Jiragation.logs', ['ngMaterial', 'ngRoute', 'timer', 'appFilters'])
.controller('logsCtrl', ['$scope', '$http', '$q', '$mdDialog', '$mdToast', '$mdMedia', '$filter', function($scope, $http, $q, $mdDialog, $mdToast, $mdMedia, $filter) {
  
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

	$scope.logTime = function(ev, task, date){

		$mdDialog.show({
			templateUrl: 'common/dialogs/logTime.html',
			scope:$scope.$new(),
			targetEvent: ev,
        	clickOutsideToClose:true,
			fullscreen: $mdMedia('xs'),
			locals:{
				task:task
			},
			controller: ['$scope', '$mdDialog', '$http', '$mdToast', 'task', 'moment', function($scope, $mdDialog, $http, $mdToast, task, moment) {
                $scope.task = task;
                var log_min = 15;
                var logged_time = task.total_time/60/1000;
                $scope.log_min = log_min;
                $scope.suggested_time = Math.ceil(logged_time/log_min)*log_min;
                $scope.total_time = task.total_time/60/1000;

                $scope.log = {
                	date:date,
                	account_id: task.account.account_id,
                	task_id:task.task_id,
                	time: Math.ceil(logged_time/log_min)*log_min,
                	account:""+task.account.protocal+"://"+task.account.url,
                	assignToReporter:false
                }

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.submitLogRequest = function(data) {
                	var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

                	// var date_string = data.date.getFullYear()+"-"
                	// 	date_string +=data.date.getMonth()+1+"-"
                	// 	date_string +=data.date.getDate()+"'T'"
                	// 	date_string +=((data.date.getHours()<10)?"0"+data.date.getHours():data.date.getHours())+":"+((data.date.getMinutes()<10)?"0"+data.date.getHours():data.date.getHours())+":"+((data.date.getSeconds()<10)?"0"+data.date.getHours():data.date.getHours())+" "
                		// var format = "YYYY-MM-DD[T]HH:mm:ss.SSSZ";
    					var date_string = moment(data.date).format("YYYY-MM-DD[T]HH:mm:ss.SSSZZ");
    					console.log(date_string);
                		// console.log(String(date_string).replace(' ', 'T'))
                		// date_string = new Date("yyyy-MM-dd`T`HH:mm:ss.SSSZ");

                	var payload = {
                		account:data.account,
						account_id:data.account_id,
						assignToReporter:data.assignToReporter,
						comment:data.comment,
						task_id:data.task_id,
						time:data.time,
                		date:date_string
                	}
					$http({
	                    method:   'POST',
	                    url:      '/jira/logTime',
	                    data: JSON.stringify(payload), 
	                    headers: {
	                      'Content-Type': 'application/json'
	                    }
	                }).then(function successCallback(res){
	                    $mdDialog.cancel();
	                    $mdToast.show({
		                    hideDeplay:5000,
		                    position:'bottom left',
		                    controller  : 'ToastCtrl',
		                    locals:{
		                        params:{
		                            text: data.time+'m Logged to '+data.task_id
		                        }
		                    },
		                    templateUrl: 'common/dialogs/toastTemplate.html'
		                });
	                }, function errorCallback(res){
	                    console.log(res);
	                });
                }
        	}]
		}).then(function(answer) {
			$scope.status = 'You said the information was "' + answer + '".';
		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});
	}

	function getlogs(startD, endD){

		var start_date = new Date(startD);
		var end_date = new Date(endD);

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

		// query should subquery for this information.
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
						logged_time: [{start_time:task.start_time, end_time: task.end_time}],
						total_time: logged_time,
						account:{
							account_id:task.account_id,
							protocal:task.protocal,
							url:task.url,
							user_name:task.user_name
						}
					});
					response[day_key].time_logged += logged_time;
					deferred.resolve(response);

				} else {
					var logged_time = task.end_time-task.start_time;
					
					response[day_key].tasks[index].total_time += logged_time;
					response[day_key].tasks[index].logged_time.push({start_time:task.start_time, end_time: task.end_time});
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
				scope.scales = {day_begin:response.day_begin,day_end:response.day_end};
				scope.task_lines = response.tasks;
			});
			
			scope.inactive = true;
			scope.isActive = function(){
				scope.inactive = !scope.inactive;
			}

			function linearize(data) {

				var deferred = $q.defer();
				var colorVars = 'ABCDEF0123456789';
				var colorTemp = ['','','','','',''];
				var response = {
					day_begin:{
						date:day_start+oneDay
					},
					day_end:{
						date:day_start
					},
					tasks: []
				}

				angular.forEach(data, function(task, task_key){
					response.tasks.push({
						task_id: task.task_id,
						color: "#"+colorTemp.map(function(num){ return colorVars[Math.floor((Math.random() * 15))]}).join(''),
						lines : []
					})

					angular.forEach(task.logged_time, function(log, log_key){
						response.tasks[task_key].lines.push({
							day_start: day_start,
							width: (parseInt(log.end_time) - parseInt(log.start_time))*100/oneDay,
							start_time: log.start_time,
							end_time:log.end_time,
							start: (parseInt(log.start_time) - day_start)/oneDay*100,
							end: (parseInt(log.end_time) - day_start)/oneDay*100
						});
						if(parseInt(log.start_time) < response.day_begin.date){
							response.day_begin = {
								date: parseInt(log.start_time),
								location: (parseInt(log.start_time) - day_start)/oneDay*100
							};
						}
						if(parseInt(log.end_time) > response.day_end.date){
							response.day_end = {
								date: parseInt(log.start_time),
								location: (parseInt(log.end_time) - day_start)/oneDay*100
							} 
						}
						deferred.resolve(response);
					});
				});

				return deferred.promise;
			}

		}
	};
}]).directive('taskLine', function(){
	return {
	    link: function(scope, elem, attr) {
			scope.hoverIn = function(){
			    scope.hoverEdit = true;
			};

			scope.hoverOut = function(){
			    scope.hoverEdit = false;
			};
	    }
	}
});