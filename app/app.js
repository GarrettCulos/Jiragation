'use strict';

// Declare app level module which depends on views, and components
angular.module('Jiragation', [
    'ngRoute'
  , 'Jiragation.taskList'
  , 'Jiragation.logs'
  , 'Jiragation.account'
  , 'Jiragation.version'
  , 'Jiragation.task'
  , 'Jiragation.headerNav'
  , 'Jiragation.actionBar'
  , 'timer'
  , 'appFilters'
  , 'ngMaterial'
  , 'ngAnimate'
  , 'ngAria'
  , 'ngMessages'
  // , 'material.svgAssetsCache'
]).config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
 	$routeProvider
  	.when('/', {
  		templateUrl: 'common/login.html'
  	})
  	.when('/task-list', {
  		templateUrl: 'common/task-list/taskList.html',
      controller: 'accountsController'
  	})
  	.when('/account', {
      templateUrl: 'common/account/settings.html',
      controller: 'userAccountController'
  	})
    .when('/logs', {
       templateUrl: 'common/logs/logs.html',
       controller: 'logsCtrl'
    })
    .when('/register',{
      templateUrl:'common/register.html',
      controller:'userController'
    })
    .otherwise({
      templateUrl: 'common/404.html',
    });

  $locationProvider.hashPrefix("");
  $locationProvider.html5Mode(true);  
}]).config(function ($mdThemingProvider) {
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
        '50': '#515e6c',
        '100': '#5c6b7b',
        '200': '#677889',
        '300': '#738596',
        '400': '#8291a1',
        '500': '#909eac',
        '600': '#aeb8c2',
        '700': '#bcc4cd',
        '800': '#cbd1d8',
        '900': '#d9dee3',
        'A100': '#aeb8c2',
        'A200': '#9fabb7',
        'A400': '#909eac',
        'A700': '#e8ebee'
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
}).run(['$rootScope', '$http', '$location', 'Authenticate',  function($rootScope, $http, $location, Authenticate) {
  $rootScope.user = {};
  // set login state
  Authenticate.check(function(res){
    $rootScope.isLoggedIn = res;
    if(res){
        // set user information
        Authenticate.getUser(function(response){
            $rootScope.user = response.data;
            (response.data.is_admin)?$rootScope.isAdmin = true:$rootScope.isAdmin=false;
        });
    }
    else{
      // $location.path('/')
    }
  });

  // Listen to logins
  $rootScope.$on('authLogin', function(event, user) {
    Authenticate.check(function(res){
        (res)?$rootScope.isLoggedIn = true:$rootScope.isLoggedIn =false;
        (user.is_admin)?$rootScope.isAdmin = true:$rootScope.isAdmin=false;
        $rootScope.user = user;
    });
  });

  $rootScope.$on('authLogout', function(event, user) {
    Authenticate.check(function(res){
        (res)?$rootScope.isLoggedIn = true:$rootScope.isLoggedIn = false;
        $rootScope.isAdmin = false;
        $rootScope.user = {};
    });
  });
}]).factory('Authenticate', ['$window','$location','$http', '$rootScope', function($window, $location, $http, $rootScope) {
    return {
        login:function(user, callback){
            $http({
                method:   'PUT',
                url:      '/api/v2/user/login',
                data: user,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(result){
                if(result.data.token){
                    console.log('loggeding in');

                    $http.defaults.headers.common['x-access-token']=result.data.token;
                    $window.localStorage['jwtToken']=result.data.token;

                    $rootScope.$broadcast('authLogin', result.user);
                    // $location.path('/inventory');
                    callback(result);
                }
                else{
                    callback({status:401, message:'An Unknown Error Occured'});
                }
            }, function(error){
                callback({status:401, message:error});
            });
        },
        check:function(callback){
            var token = $window.localStorage['jwtToken'];
            if(!token){
                return callback(null);
            };
            $http.defaults.headers.common['x-access-token'] = token;
            $http({
                method:'GET',
                url:'/api/v1/tokenCheck'
            }).then(function(response){
                // set http header
                callback(true);
            }, function(error){
                if(error.status==401){
                    console.log('session expired');
                    // $location.path('/'); 
                    delete $window.localStorage['jwtToken'];
                    delete $http.defaults.headers.common['x-access-token'];  
                    return callback(null);
                } 
            });
        },
        remove:function(callback){
            delete $window.localStorage['jwtToken'];
            delete $http.defaults.headers.common['x-access-token'];
            $location.path('/');
            callback();
        },
        add:function(token, callback){
            $http.defaults.headers.common['x-access-token']=token;
            $window.localStorage['jwtToken']=token;
            callback();
        },
        getUser:function(callback){
            var token = $window.localStorage['jwtToken'];
            if(!token){
                return callback(null);
            }

            $http({
                method:'GET',
                url:'/api/v1/tokenCheck'
            }).then(function(response){
                if(response.status==401){
                    console.log('session expired');
                    $location.path('/login');   
                    return callback(null);
                } 
                return callback(response);
            });
        },
        getUserInformation:function(callback){
            var token = $window.localStorage['jwtToken'];
            if(!token){
                return callback(null);
            }

            $http({
                method:'GET',
                url:'/api/v2/users'
            }).then(function(response){
                if(response.status >= 400){
                    console.log('session expired');
                    $location.path('/login');   
                    return callback(response);
                } 
                return callback(response);
            });
        },
        getUserName:function(callback){
            var token = $window.localStorage['jwtToken'];
            if(!token){
                return callback(null);
            }
            $http({
                method:'GET',
                url:'/api/v1/tokenCheck'
            }).then(function(response){
                if(response.status==401){
                    return callback(null);
                } 
                return callback(response.data.user_name);
            });
        },
        updateUser:function(user, callback, error){
            $http({
                method:'POST',
                url:'/api/v2/users/'+user.id,
                data:{
                    user:user
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                console.log(response);
                if(response.status==400){
                    return error(response);
                } 
                return callback(response);
            }, function(err){
                error(err);
            });
        }
    };
}]).factory('$currentUser', ['$http', function($http) {
   
    var  $currentUser = {};

    $currentUser.getUserInformation = function() {
        return $http({
            method: 'GET',
            url: '/api/v1/users/get_user_info'
        }).then(function successCallback(response){
            return response;
        }, function errorCallback(response){
            return response;
        });
    }

    $http({
        method:'GET',
        url: '/api/v2/account',
        headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(res){
        $currentUser.user_accounts = res;
        $currentUser.user_accounts_email = [];
        res.data.forEach(function(account,key){
          $currentUser.user_accounts_email.push(account.account_email)
        })

    }, function errorCallback(error){
        $currentUser.user_accounts_email=null;
        console.log(error)
    });

    $currentUser.updateUser = function(user) {
        return $http({
            method: 'POST',
            url: '/api/v1/users/update_user_info',
            data: user
        }).then(function successCallback(response){
            console.log('Updated User')
            return 'Success';
        }, function errorCallback(response){
            console.log(response);
            return response;
        });
    }

    return $currentUser;
}]).factory('$myAccounts', ['$http', '$q', function($http, $q) {

    return $http({
        method:'GET',
        url: '/api/v2/account',
        headers: {'Content-Type': 'application/json'}
    }).then(function(response){
    
        var $accounts ={};
        
        $accounts.user_accounts = response.data;
        $accounts.user_accounts_email  = [];
        
        response.data.forEach(function(account,key){
            $accounts.user_accounts_email.push(account.account_email);
        });

        $accounts.getUrlId = function(url){

            var formatedURL = url.split('://')[1]
            var return_val = null;

            response.data.forEach(function(account,key){
                if( account.url == formatedURL.split('/')[0]){
                    return_val = key;
                }
            });
            return return_val;
        }

        return $accounts;
    });
}]).controller('AppCtrl', function ($scope, $timeout, $http, $mdSidenav, $log, $mdDialog, $mdMedia) {
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
        templateUrl: 'common/account/settings.html',
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
    
}).controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    // Component lookup should always be available since we are not using `ng-if`
    $mdSidenav('right').close()
      .then(function () {
        $log.debug("close RIGHT is done");
      });
  };
}).controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    // Component lookup should always be available since we are not using `ng-if`
    $mdSidenav('left').close()
      .then(function () {
        $log.debug("close LEFT is done");
      });
  };
}).controller('ToastCtrl', function($location, $scope, $mdToast, $mdDialog, params) {
    $scope.closeToast = function() {
        $mdToast.hide().then(function(){});
    };
    $scope.goTo =function(p){
        $location.path(p);
    }

    $scope.params=params;
});
