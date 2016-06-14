'use strict';

angular.module('myApp', ['ngRoute'])

.controller('userController', ['$scope', '$http', function($scope, $http){
	// $scope.setUserInfo = function(user){
		
	// 	$http({
	// 		method: 'POST',
	// 		url: '/user/get_user_info',
	// 		data: {
	// 			preferedName:user.preferedName,
	// 			firstName:user.firstName,
	// 			lastName:user.lastName
	// 		}
	// 	}).then(function successCallback(response){
			
	// 		console.log(response);

	// 	}, function errorCallback(response){
	// 		console.log(response);
	// 	});
	// }

	// $scope.getUserInfo = function(){
	// 	$http({
	// 		method: 'POST',
	// 		url: '/user/get_user_info'
	// 	}).then(function successCallback(response){
			
	// 		console.log(response);

	// 	}, function errorCallback(response){
	// 		console.log(response);
	// 	});
	// }
	// $scope.getUserInfo();
	// console.log('userController')

}]);