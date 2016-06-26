'use strict';

angular.module('myApp.taskList', ['ngRoute','timer','appFilters'])

.controller('accountsController', ['$scope', '$http', '$q', function($scope, $http, $q) {

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

	// sort list by predicate
	$scope.predicate = 'task.fields.created';
	$scope.predicate = 'task.key'
	$scope.reverse = true;
	
	$scope.activeTask=[];
		
  // --------------------------------------------- //
  //            Jira Related functions             //
  // --------------------------------------------- //
	
	// Toggle active task		
	var taskNumber = 0;

	$scope.fetching_tasks = false;

	function resetActiveTasks(){
		
		$scope.allTimerPaused = false;
	}

	function modify_task_list(taskList) {
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

				modify_task_list(
					res.data
				).then(function(response){		
					$scope.taskList = response;
					// console.log($scope.taskList);
				});

			}, function errorCallback(res){
				$scope.fetching_tasks = false;
			});
		
		}, function errorCallback(response){
			// console.log(response);
			$scope.fetching_tasks = false;
		
		});
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


	$scope.order = function(predicate) {
		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	};

	$scope.getJiraTasks();
}])

.directive('taskBar', function(){
	return {
	    link: function(scope, element, attr) {
	    	var scroll = angular.element('#main');
	    	var navHeight = angular.element('headernav')[0].offsetHeight+10;

	    	scroll.on('DOMContentLoaded load resize scroll',function(){
	    		if(attr.isactive == "true"){

	    			var active_bars = element.parent().parent().find('task-bar.select-active');
	    			console.log(active_bars);

	    			if(element.parent().offset().top - navHeight < 0){
	    				element.parent().css({paddingTop: element[0].offsetHeight+10});
	    				element.css({top:(navHeight-10)});
	    				element.addClass("sticky");
	    			} 

	    			if(element.parent().offset().top - navHeight +10 > 0) {
	    				element.parent().css({paddingTop: '0'});
	    				element.removeClass("sticky");
	    			}

					} else {
						element.removeClass("sticky")
						element.parent().css({paddingTop: '0'});
		    				
					}
	    	});
	    },
	}
});;