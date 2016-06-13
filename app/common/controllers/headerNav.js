'use strict';

angular.module('myApp.headerNav', ['ngRoute','timer'])

.controller('HeaderController', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.isActive = function(page){
		if( page == $location.path() ){
			return 'active';
		}
		return '';
	};

	$scope.goTo = function(page){
		$location.path(page)
	};

	$scope.menu=[{
			title: 'Home',
			icon: 'img/svg/ic_home_black_24px.svg',
			link: '/'
		},
		{
			title: 'logs',
			icon: 'img/svg/ic_update_black_24px.svg',
			link: '/logs'
		}];

}])

.directive('headernav', function(){
  return{
    templateUrl: 'common/headerNav.html'
  }
});