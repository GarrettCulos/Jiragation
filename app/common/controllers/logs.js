'use strict';

angular.module('myApp.logs', ['ngRoute','timer'])

.controller('logsCtrl', ['$scope', '$http', function($scope, $http) {
	
	$scope.getTodaysTime = function(){
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth();
		var year = date.getFullYear();

		$http({
			method:  'GET',
			url: 	 '/task/getTrackedTime',
			params:  { 
				earlier_time: year+'-'+month+'-'+day,
				later_time: year+'-'+month+'-'+(day+1)
			},
			headers: {'Content-Type': 'application/json'}

		}).then(function successCallback(res){		
			console.log(Res);
		}, function errorCallback(res){
			console.log(res);
		});	
	}
	$scope.getTodaysTime();
}]);