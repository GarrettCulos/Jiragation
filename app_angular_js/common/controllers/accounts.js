'use strict';

angular
.module('Jiragation.account', ['ngRoute'])
.controller('userAccountController', ['$scope', '$http', 'Authenticate', '$mdDialog', '$mdToast', function($scope, $http, Authenticate, $mdDialog, $mdToast) {	
	$scope.viewUserUpdate=false;
	$scope.viewAccounts=false;
	$scope.account = {};
	$scope.userChanges = {};
 	syncAccounts();
  
	Authenticate.getUserInformation(function(res){
		console.log(res);
		$scope.user = res.data
		$scope.userChanges.id = res.data.id

	});

	function syncAccounts(){
		$http({
			method: 'GET',
			url: '/api/v2/accounts'

		}).then(function successCallback(response){
			$scope.JiraAccounts = response.data;
		}, function errorCallback(response){
			console.log(response);
		});
	}

	$scope.closeUpdateUser = function(){
		
		$scope.viewUserUpdate = false;
	}

	$scope.updateAccount = function(){
		
		syncAccounts();
		$scope.viewAccounts = true;
	}

	$scope.closeAccountUpdater = function(){
		
		$scope.viewAccounts = false;
	}
	
	$scope.addAccount = function(form, data){
		console.log(data);
		$http({
			method: 'POST',
			url: '/api/v1/accounts',
			data: {
				url:data.jira_url.split('://')[1], 
				user_name:data.user_name, 
				password:data.password, 
				protocal:data.jira_url.split('://')[0], 
				account_email:data.account_email
			}
		}).then(function successCallback(response){
			$scope.JiraAccounts.push({
				account_email:data.account_email,
				protocal:data.jira_url.split('://')[0],
				url:data.jira_url.split('://')[1],
				user_name:data.user_name
			});
			$scope.account = {};
            form.$setPristine();
            form.$setUntouched();
		}, function errorCallback(response){
			console.log(response);
		});
	}
	
	$scope.deleteAccount = function(ev, id){
		var confirm = $mdDialog.confirm()
            .title('Are you sure you want to remove this account?')
            .textContent('Account: ' + $scope.JiraAccounts[id].url )
            .ariaLabel('Remove Account')
            .targetEvent(ev)
            .ok('Remove Account')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            var account = $scope.JiraAccounts[id];
			$http({
				method: 'DELETE',
				url: '/api/v2/account/'+account.id,
				params: {url:account.url, user_name:account.user_name}
			}).then(function successCallback(response){
				$mdToast.show({
                    hideDeplay:5000,
                    position:'bottom left',
                    controller  : 'ToastCtrl',
                    locals:{
                        params:{
                            text:'Account Removed'
                        }
                    },
                    templateUrl: 'common/dialogs/toastTemplate.html'
                });
				syncAccounts();
			}, function errorCallback(response){
				console.log(response);
			});

        }, function() {
            console.log('canceled decklis removal');
        });
	}

	$scope.updateUser = function(form, u){
		console.log(u);
		Authenticate.updateUser(u, function(response){
			console.log(response);
			$mdToast.show({ 
				hideDeplay:5000, 
				position:'bottom right', 
				controller: 'ToastCtrl', 
				locals:{ params:{
					text:'Account Updated'
                }}, 
                templateUrl: 'common/dialogs/toastTemplate.html'
            });
		}, function(error){
			console.log(error)
		});
	}
}]);