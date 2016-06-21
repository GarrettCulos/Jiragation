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
        '50': '#ffffff',
        '100': '#ffffff',
        '200': '#ffffff',
        '300': '#ffffff',
        '400': '#ffffff',
        '500': '#ffffff',
        '600': '#f0f0f0',
        '700': '#e0e0e0',
        '800': '#d1d1d1',
        '900': '#000000',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#e0e0e0',
        // 'contrastDarkColors': '50 100 200 300 400 500 600 700 800 900 A100 A200 A400 A700'
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

.controller('AppCtrl', function ($scope, $timeout, $http, $mdSidenav, $log, $mdDialog, $mdMedia) {
  $scope.toggleLeft = buildToggler('left');
  $scope.toggleRight = buildToggler('right');


  // --------------------------------------------- //
  //                  Left/Right navs              //
  // --------------------------------------------- //

    $scope.isOpenLeft = function(){
      return $mdSidenav('left').isOpen();
    };

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
    

  // --------------------------------------------- //
  //                  Settings Popup               //
  // --------------------------------------------- //


    // Show Settings Modal (see https://material.angularjs.org/latest/demo/dialog)
    $scope.status = '  ';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    
    $scope.showSettings = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'common/account/account.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
      
      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.save = function(answer) {
        $mdDialog.hide(answer);
      };
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
})

.factory('$currentUser', ['$http', function($http) {
   
  var  $currentUser = {};
  $currentUser.userNamePrefered = 'Garrett';
  $currentUser.userNameFirst = 'Garrett';
  $currentUser.userNameLast = 'Culos';
  $currentUser.userProfileImage = null;

  $http({
    method:'GET',
    url: '/account/fetch_accounts',
    headers: {'Content-Type': 'application/json'}
  }).then(function successCallback(res){
    $currentUser.user_accounts = res;
    $currentUser.user_accounts_email = [];
    res.data.forEach(function(account,key){
      $currentUser.user_accounts_email.push(account.account_email)
    })

  }, function errorCallback(error){
    $scope.user_accounts_email=null;
    console.log(error)
  });



  return $currentUser;
 }]);

