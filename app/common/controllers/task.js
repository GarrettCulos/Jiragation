'use strict';

angular.module('myApp.task', ['ngRoute','timer','appFilters'])

.controller('taskController', ['$scope', '$http', '$currentUser', '$q', function($scope, $http, $currentUser, $q) {

	$scope.isActive=false;
	$scope.timerStarted=false;

	function timerDataToUnix(data) {
		var msPsec = 1000;
		var secPmin = 60;
		var minPhr = 60;
		var hrPday = 24;
		// + msPsec*data.seconds + msPsec*secPmin*data.minutes + msPsec*secPmin*minPhr*data.hours + msPsec*secPmin*minPhr*hrPday *data.days;
		return data.millis 
	}

	function comment_preprocess(comments) {
		var res = [];
 		var deferred = $q.defer();

 		comments.forEach(function(comment, key){
			var comment_push = comment;
			comment_push.isCurrentUser = false;
			if($currentUser.user_accounts_email.indexOf(comment.author.emailAddress) != -1 ){
				comment_push.isCurrentUser = true;
			}
	 		res.push(comment_push);
			deferred.resolve(res);
			
 		})
		return deferred.promise;
	}

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
				if(res.data.logged_time > 0 ) $scope.timeLogged = res.data.logged_time;
			}, function errorCallback(res){
				console.log(res);
			});	
		}
	}
	
	$scope.stateLog = function(){
		console.log('Timer started:'+$scope.timerStarted);
		console.log('Active state:'+$scope.isActive);
	}

	$scope.timerToggle = function(){

		if(!$scope.timerStarted){
			$scope.$broadcast('timer-start');
			$scope.timerStarted=true;
			$scope.isActive=true;
			$scope.getTaskTime();
		}else{
			$scope.$broadcast('timer-stop');
			$scope.timerStarted=false;
			$scope.isActive=false;
			$scope.getTaskTime();
		}
	}

		// Toggle active task		
	$scope.updateRightView = function(acct) {

		var temp = acct.self.split('://');
		temp[1]=temp[1].split('/');
		var account = {
			 protocal:temp[0]
			,url:temp[1][0]
			,user_name: 'gculos'
			,password: 'gummyworms'
		}

		// console.log(account);
		var data_load = {
			issueId: acct.id,
			acct: account
		}
		$scope.currentUser = $currentUser.user_accounts;
		
		// get comments // GET /rest/api/2/issue/{issueIdOrKey}/comment
		$http({
			method: 'GET',
			url: '/pull_jiras/task_comments',
			params: data_load
		}).then(function successCallback(response){

			// pass in comment array for preprocessing
			comment_preprocess(response.data.comments).then(function(comments){
				$scope.task_comments=comments;
			})
			
		});
	}

	$scope.$on('timer-stopped', function (event, logged_time){
		
		var date = new Date();
		var current_date = date.getTime();
		var response = {
			task_id: $scope.task.key,
			end_time: current_date,
			start_time: current_date-timerDataToUnix(logged_time)
		}
		
		// send data to databse
		$http({
			method: 'POST',
			url: 	'/task/trackTime',
			data: 	JSON.stringify(response),
			headers: {'Content-Type': 'application/json'}

		}).then(function successCallback(res){
			$scope.usrAccountData = res.data;

		}, function errorCallback(res){
			console.log('Warning Will Robinson');
		});
	});
	
	$scope.getTaskTime();

	
}])

.directive('taskBar', function(){
	return {
	    link: function(scope, element, attr) {
	    	var scroll = angular.element('#main');
	    	scroll.on('DOMContentLoaded load resize scroll',function(){
	    		if(attr.isactive == "true"){
	    			if(element.offset().top < 0){
	    				element.addClass("sticky");
	    			} else{
	    				console.log(element.offset().top)
	    				element.removeClass("sticky");
	    			}
				} else {
					element.removeClass("sticky")
				}
	    	});
	    },
	}
});
// .directive('taskBar', function(){
// 			var scroll_window = element;
// 	// var scroll_window = document.getElementsById('main');''
// 	// console.log(scroll_window);

// 	// function isVisible(el) {
// 	// 	var rect = el.getBoundingClientRect();
// 	// 	var clw = (scroll_window.innerWidth || scroll_window.documentElement.clientWidth);
// 	// 	var clh = (scroll_window.innerHeight || scroll_window.documentElement.clientHeight) ;

// 	// 	// checks if element is fully visible
// 	// 	//return (rect.top >= 0 && rect.bottom <= clh) && (rect.left >= 0 && rect.right <= clw);

// 	// 	// checks if part of element is visible
// 	// 	console.log(clh);
// 	// 	return (rect.left <= clw && 0 <= rect.right && rect.top <= clh && 0 <= rect.bottom);
// 	// }

// 	// var reg = [];

// 	// function register(element, fn) {
// 	// 	reg.push([element, fn]);
// 	// }

// 	// function deregister(element) {
// 	// 	reg = angular.filter(reg, function (item) {
// 	// 	  return item[0] !== element;
// 	// 	});
// 	// }

// 	// angular.element(scroll_window).on('DOMContentLoaded load resize scroll', function () {
// 	// 	angular.forEach(reg, function (item) {
// 	// 	    item[1](isVisible(item[0]));
// 	// 	});
// 	// });

// 	return {
// 		restrict: 'A',
//         scope: {ranges:'='},
// 		compile: function(scope, element, attrs) {
// 			console.log('compile directive');
// 			var scroll_window = element;
// 			// scroll_window.on('scroll', function () {
// 			// 	return console.log('scroll');
// 			// });
// 			element.on('mouseover', function () {
// 				console.log('mouseover');
// 			});

// 		}
// 		// link: function (scope, element, attrs, controller) {
// 		//   register(element[0], function(isVisible){
// 		//     scope.$apply(function(){
// 		//       scope.isVisible = isVisible;
// 		//     })
// 		//   });
// 		//   scope.$on('$destroy', function(){
// 		//     deregister(element);
// 		//   })
// 		// }
// 	}
// });