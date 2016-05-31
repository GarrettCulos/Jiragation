'use strict';

angular.module('myApp.logs', ['ngMaterial', 'ngRoute', 'timer'])

.controller('logsCtrl', ['$scope', '$http', function($scope, $http) {
  	
  	$scope.maxDate = new Date();

	$scope.getlogs = function(start_date, end_date){
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth()+1;
		if(month<10){
			month = "0"+month;
		}
		var year = date.getFullYear();
		if(true){
			$http({
				method:  'GET',
				url: 	 '/task/getTrackedTime',
				params:  { 
					earlier_time: start_date,
					later_time: end_date
				},
				headers: {'Content-Type': 'application/json'}

			}).then(function successCallback(res){		
				console.log(res);
			}, function errorCallback(res){
				console.log(res);
			});		
		}
		
	}
	$scope.getlogs();
}]);