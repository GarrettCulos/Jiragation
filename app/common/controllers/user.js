'use strict';

angular.module('myApp')

.controller('userInformationController', ['$scope', '$http', '$currentUser', function($scope, $http, $currentUser){

	// Update User Information
	$scope.updateUser = function(){
		$currentUser.updateUser($scope.user)
		.then(function() {  
			console.log('successful');
		});
	}

	// Set User Information
  $currentUser.getUserInformation()
  .then(function(result) {  
		$scope.user = result.data[0];		
		console.log(result.data[0]);
	});

}]);