'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'userController'
  });
}])

.controller('userController', ['$scope', '$http', function($scope, $http) {
	$scope.userNamePrefered = 'Garrett';
	$scope.userNameFirst = 'Garrett';
	$scope.userNameLast = 'Culos';
	
	$scope.message = 'Welcome ' + $scope.userNamePrefered;
	
	
	$scope.viewUserUpdate=false;
	$scope.viewAccounts=false;

	$scope.updateUser = function(){
		$scope.viewUserUpdate = true;
	}

	$scope.closeUpdateUser = function(){
		$scope.viewUserUpdate = false;
	}

	$scope.updateAccount = function(){
		$scope.viewAccounts = true;
	}

	$scope.closeAccountUpdater = function(){
		$scope.viewAccounts = false;
	}
	// PLEASE INSERT YOUR USER NAME AND PASSWORDW BELOW
	$scope.jiraAccounts = [
		{url:'http://jira.highwaythreesolutions.com', account:'', password:''},
	];
	$scope.hiddenJiraAccounts = [];

	$scope.addAccount = function(URL,usr,pass){
		$scope.jiraAccounts=$scope.jiraAccounts.concat({url:URL, account:usr, password:pass});
	}
	$scope.hideAccount = function( idx ){
		$scope.hiddenJiraAccounts.push($scope.jiraAccounts[ idx ]);
		$scope.jiraAccounts.splice(idx,1);
	}
	$scope.showAccount = function( idx ){
		$scope.jiraAccounts.push($scope.hiddenJiraAccounts[ idx ]);
		$scope.hiddenJiraAccounts.splice(idx,1);
	}

	$scope.delete = function ( idx ) {
		$scope.jiraAccounts.splice(idx,1);
	}

	// basic access to jira via user name and password
	$scope.usrAccountData=[];

	angular.forEach($scope.jiraAccounts, function(account, key) {
		var base = account['url'];
		var usr = account['account'];
		var password = account['password'];
		var usrPassEncoded = '';// 
		// var usrPassEncoded = base64.encode(usr+':'+password); 
		console.log(usrPassEncoded);

		$http({
			method: 'GET',
			url: base+'/rest/api/2/search?jql=assignee='+ usr + '+order+by+duedate',
			headers: {'Content-Type':  'application/json', 'Authorization': 'Basic '+ usrPassEncoded }

		}).then(function successCallback(response) {
			// this callback will be called asynchronously
			// when the response is available
			// console.log('Success');
			$scope.usrAccountData.push(response.data);
			
		}, function errorCallback(response) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log('Http request failure');
		});
		
	});

	$scope.updateRightView = function(accountNumber, taskNumber) {
		$scope.rightView = usrAccountData[accountNumber][taskNumber];
		console.log(rightView);
	}
}]);
