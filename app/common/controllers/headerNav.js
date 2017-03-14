'use strict';

angular
.module('Jiragation.headerNav', ['ngRoute','timer'])
.controller('HeaderController', ['$scope', '$http', '$location', 'Authenticate', '$rootScope', function($scope, $http, $location, Authenticate, $rootScope) {
	$scope.inputSerachText ='';

	$scope.menu=[
		{
			title: 'Home',
			icon: 'img/svg/ic_home_black_24px.svg',
			link: '/'
		},
		{
			title: 'logs',
			icon: 'img/svg/ic_update_black_24px.svg',
			link: '/logs'
		}];

	$scope.isActive = function(page){
		if( page == $location.path() ){
			return 'active';
		}
		return '';
	};

	$scope.goBack = function(){
		window.history.back();
	}

	$scope.goTo = function(page){
		$location.path(page)
	};

	$scope.logout = function(){
    Authenticate.remove(function(res){
      $rootScope.$broadcast('authLogout',{});
      $location.path('/');
    });    
	}
	
	$scope.changeFilterText = function(searchValue){
		$rootScope.$broadcast('searchTextChange', searchValue);
	}
	

}]).directive('headernav', function(){
  return{
    templateUrl: 'common/headerNav.html'
  }
});