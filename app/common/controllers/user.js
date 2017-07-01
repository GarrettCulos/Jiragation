'use strict';

angular
.module('Jiragation')
.controller('userController', ['$scope', '$http', 'Authenticate', '$location', function($scope, $http, Authenticate, $location){
	// Update User Information
	$scope.user={};
  Authenticate.getUser(function(response){
    if(response != null){
      $location.path('/task-list');      
    }
  });
	
 	$scope.register = function(registration, user){
    $http({
        method:'POST',
        url: '/api/v2/user',
        data: user,
        headers: {
          'Content-Type': 'application/json'
        }
    }).then(function(response){
      Authenticate.login(response.data,function(){
        delete $scope.user;
        registration.$setPristine();
        registration.$setUntouched();
        $location.path('task-list');
      });
    }, function(errors){
      errors.data = [errors.data];
      angular.forEach(errors.data, function(error,index){ 
        if(error[0].type == 'password'){
          console.log('password error');
          registration.passwordConfirm.$error.match=true;
          registration.passwordConfirm.$setValidity('match', false);
        }
        else if(error[0].type == 'email'){
          console.log('email error');
          registration.email_address.$error.taken=true;
          registration.email_address.$setValidity('taken', false);
        }
        else if(error[0].type == 'user_name'){
          console.log('username error');
          registration.user_name.$error.match=true;
          registration.user_name.$setValidity('match', false);
        }
      });
    });
	}

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