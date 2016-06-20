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
 		console.log($scope.user_accounts);
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
		// get comments // GET /rest/api/2/issue/{issueIdOrKey}/comment
		$http({
			method: 'GET',
			url: '/pull_jiras/task_comments',
			params: data_load
		}).then(function successCallback(response){

			// pass in comment array for preprocessing
			comment_preprocess(response.data.comments).then(function(comments){
				$scope.task_comments=comments;
				console.log(comments);
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
			console.log(res.data);
			$scope.usrAccountData = res.data;

		}, function errorCallback(res){
			console.log('Warning Will Robinson');
		});
	});
	
	$scope.getTaskTime();

	
}]);