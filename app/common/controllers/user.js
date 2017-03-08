'use strict';

angular
.module('Jiragation')
.controller('userController', ['$scope', '$http', 'Authenticate', '$location', function($scope, $http, Authenticate, $location){
	// Update User Information
	$scope.user={};
	
	// $scope.updateUser = function(){
	// 	Authenticate.updateUser($scope.user).then(function() {  
	// 		console.log('successful');
	// 	});
	// }

	// Set User Information
 //  	Authenticate.getUser(function(result) {  
	// 	$scope.user = result.data[0];		
	// 	console.log(result.data[0]);
	// });
        
	$scope.login = function(form, user){
		delete $scope.message;
		Authenticate.login(user, function(res){
			if(res.status == 401){
				$scope.message = res.message.data;
			}
			else{
				$location.path('task-list');
			}
		});
	}
	$scope.goTo = function(place) {
		$location.path(place);
	}
}]);