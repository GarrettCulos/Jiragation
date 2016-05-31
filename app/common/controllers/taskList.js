'use strict';

angular.module('myApp.taskList', ['ngRoute','timer','appFilters'])

.controller('userController', ['$scope', '$http', '$q', function($scope, $http, $q) {
	// ---------------------------
	// This should be a directive
	$('img.svg').each(function(){
	    var $img = $(this);
	    var imgID = $img.attr('id');
	    var imgClass = $img.attr('class');
	    var imgURL = $img.attr('src');

	    $.get(imgURL, function(data) {
	        // Get the SVG tag, ignore the rest
	        var $svg = $(data).find('svg');

	        // Add replaced image's ID to the new SVG
	        if(typeof imgID !== 'undefined') {
	            $svg = $svg.attr('id', imgID);
	        }
	        // Add replaced image's classes to the new SVG
	        if(typeof imgClass !== 'undefined') {
	            $svg = $svg.attr('class', imgClass+' replaced-svg');
	        }

	        // Remove any invalid XML tags as per http://validator.w3.org
	        $svg = $svg.removeAttr('xmlns:a');

	        // Replace image with new SVG
	        $img.replaceWith($svg);

	    }, 'xml');
	});    
	// ---------------------------

	$scope.userNamePrefered = 'Garrett';
	$scope.userNameFirst = 'Garrett';
	$scope.userNameLast = 'Culos';
	$scope.isActive = false;
	$scope.JiraAccounts;

	// Task Status Filters
	$scope.taskStatuses = [
		{	"name": 	"Open",
			"isActive": true},
		{	"name": 	"Resolved",
			"isActive": false},
		{	"name": 	"Closed",
			"isActive": false},
		{	"name": 	"To Do",
			"isActive": true},
		{	"name": 	"Reopened",
			"isActive": true},
		{	"name": 	"In Progress",
			"isActive": true},
		{	"name": 	"Done",
			"isActive": false}
	];

	$scope.fetching_tasks = false;
	
	$scope.getJiraTasks = function(){

		// Fetch Jira Data`
		$scope.fetching_tasks = true;
		
		$http({
			method: 'GET',
			url: '/account/fetch_accounts'
		
		}).then(function successCallback(response){

			$scope.JiraAccounts = response.data;

			$http({
				method: 'GET',
				url: '/pull_jiras/jira_accounts'
			
			}).then(function successCallback(res){
				
				$scope.fetching_tasks = false;
				
				modifyTaskList(
					res.data
				).then(function(response){		
					$scope.taskList = response;
					console.log($scope.taskList);
				});

			}, function errorCallback(res){
				$scope.fetching_tasks = false;
			});
		
		}, function errorCallback(response){
			// console.log(response);
			$scope.fetching_tasks = false;
		
		});
	}

	function modifyTaskList(taskList) {
		var res = []
 		var deferred = $q.defer();

		taskList.forEach(function(task, key){	
			// convert created date to unix time
			task.fields.created = parseInt(Date.parse(task.fields.created));
			
			// push data
			res.push(task);
			deferred.resolve(res);
		});

		return deferred.promise;
	}

	// Task Status Filter Toggle
	$scope.changeStatus = function(status){
		// console.log($scope.taskStatuses);
		for(var i=0; i<$scope.taskStatuses.length; i++){
			// console.log($scope.taskStatuses[i]);
			if(status == $scope.taskStatuses[i].name){
				if($scope.taskStatuses[i].isActive === false){
					$scope.taskStatuses[i].isActive = true;
				}else{
					$scope.taskStatuses[i].isActive =false;
				}		
			}
		}	
	};

	// Return Task Url
	$scope.taskUrl = function(taskKey, taskUrl) {
		
		return taskUrl.substring(0,taskUrl.indexOf('/rest/'))+'/browse/'+taskKey;
	}

	// Toggle active task		
	var taskNumber = 0;
	$scope.updateRightView = function(taskNumber) {
	
		$scope.rightView = $scope.taskList[taskNumber];
	}

	$scope.activeTask=[];
	function resetActiveTasks(){
		$scope.allTimerPaused = false;
	}


	// sort list by predicate
	$scope.predicate = 'task.fields.created';
	$scope.predicate = 'task.key'
	$scope.reverse = true;
	$scope.order = function(predicate) {
		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	};

	$scope.getJiraTasks();
}])


