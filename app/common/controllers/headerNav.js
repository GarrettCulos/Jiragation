'use strict';

angular.module('myApp.headerNav', ['ngRoute','timer'])

.controller('HeaderController', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.isActive = function(page){
		if( page == $location.path() ){
			return 'active';
		}
		return '';
	}

}])

.directive('header', function() {
	return{
		templateUrl: 'common/headerNav.html'
	}
});