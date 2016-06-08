'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute'
  , 'myApp.taskList'
  , 'myApp.logs'
  , 'myApp.account'
  , 'myApp.version'
  , 'myApp.task'
  , 'myApp.headerNav'
  , 'timer'
  , 'appFilters'
  , 'ngMaterial'
  , 'ngAnimate'
  , 'ngAria'
  , 'ngMessages'
  // , 'material.svgAssetsCache'
])
.config(['$routeProvider', function($routeProvider) {
 	$routeProvider
	.when('/', {
		templateUrl: 'common/task-list/taskList.html',
    	controller: 'userController'
	})
	.when('/task-list', {
		templateUrl: 'common/task-list/taskList.html',
    	controller: 'userController'
	})
	.when('/account', {
    	templateUrl: 'common/account/account.html',
    	controller: 'accountCtrl'
	})
  .when('/logs', {
      templateUrl: 'common/logs/logs.html',
      controller: 'logsCtrl'
  })
  .otherwise({
    	templateUrl: 'common/404.html',
  });
}])
.config(function ($mdThemingProvider) {
    var customPrimary = {
        '50': '#ad18ff',
        '100': '#a400fe',
        '200': '#9300e4',
        '300': '#8300cb',
        '400': '#7200b1',
        '500': '#620098',
        '600': '#52007e',
        '700': '#410065',
        '800': '#31004b',
        '900': '#200032',
        'A100': '#b632ff',
        'A200': '#bf4bff',
        'A400': '#c865ff',
        'A700': '#100018'
    };
    var customAccent = {
        '50': '#6f0004',
        '100': '#880004',
        '200': '#a20005',
        '300': '#bb0006',
        '400': '#d50007',
        '500': '#ee0008',
        '600': '#ff222a',
        '700': '#ff3c42',
        '800': '#ff555b',
        '900': '#ff6f74',
        'A100': '#ff222a',
        'A200': '#ff0911',
        'A400': '#ee0008',
        'A700': '#ff888c'
    };
    var customWarn = {
        '50': '#ff8080',
        '100': '#ff6666',
        '200': '#ff4d4d',
        '300': '#ff3333',
        '400': '#ff1a1a',
        '500': '#ff0000',
        '600': '#e60000',
        '700': '#cc0000',
        '800': '#b30000',
        '900': '#990000',
        'A100': '#ff9999',
        'A200': '#ffb3b3',
        'A400': '#ffcccc',
        'A700': '#800000'
    };
    var customBackground = {
        '50': '#d2d6d6',
        '100': '#c5caca',
        '200': '#b8bebe',
        '300': '#abb1b1',
        '400': '#9da5a5',
        '500': '#909999',
        '600': '#838d8d',
        '700': '#768080',
        '800': '#6a7373',
        '900': '#5d6666',
        'A100': '#e0e2e2',
        'A200': '#edeeee',
        'A400': '#fafbfb',
        'A700': '#515858'
    };

    $mdThemingProvider.definePalette('customPrimary', customPrimary);
    $mdThemingProvider.definePalette('customAccent', customAccent);
    $mdThemingProvider.definePalette('customWarn', customWarn);
    $mdThemingProvider.definePalette('customBackground', customBackground);

    $mdThemingProvider.theme('default')
       .primaryPalette('customPrimary')
       .accentPalette('customAccent')
       .warnPalette('customWarn')
       .backgroundPalette('customBackground')
})
.controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function(){
    return $mdSidenav('right').isOpen();
  };
  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }, 200);
  }
  function buildToggler(navID) {
    return function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }
  }
})
.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    // Component lookup should always be available since we are not using `ng-if`
    $mdSidenav('right').close()
      .then(function () {
        $log.debug("close RIGHT is done");
      });
  };
})
.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    // Component lookup should always be available since we are not using `ng-if`
    $mdSidenav('left').close()
      .then(function () {
        $log.debug("close LEFT is done");
      });
  };
});