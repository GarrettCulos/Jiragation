'use strict';

angular.module('myApp.actionBar', ['ngRoute','ngMaterial', 'ngMessages'])

.controller('actionNavigationBar', ['$scope', '$http', '$location', '$mdDialog', '$timeout', function($scope, $http, $location, $mdDialog, $timeout) {
      
    $scope.hidden = false;
    $scope.isOpen = false;
    $scope.hover = false;
    // On opening, add a delayed property which shows tooltips after the speed dial has opened
    // so that they have the proper position; if closing, immediately hide the tooltips
    $scope.$watch('isOpen', function(isOpen) {
      if (isOpen) {
        $timeout(function() {
          $scope.tooltipVisible = $scope.isOpen;
        }, 600);
      } else {
        $scope.tooltipVisible = $scope.isOpen;
      }
    });

    $scope.items = [
      { name: "Task", icon: "img/svg/ic_playlist_add_black_24px.svg", direction: "top", dialogTemplate: 'common/dialogs/addTask.html'},
      { name: "Note", icon: "img/svg/ic_note_add_black_24px.svg", direction: "bottom", dialogTemplate: 'common/dialogs/addNote.html'},
    ];

    $scope.openDialog = function($event, item) {
      // Show the dialog
      $mdDialog.show({
        clickOutsideToClose: true,
        controller: function($mdDialog) {
          // Save the clicked item
          this.item = item;
          // Setup some handlers
          this.close = function() {
            $mdDialog.cancel();
          };
          this.submit = function() {
            $mdDialog.hide();
          };
        },
        controllerAs: 'dialog',
        templateUrl: item.dialogTemplate,
        targetEvent: $event
      });
    }
}])

.controller('updateTask', ['$scope', '$http', '$location', '$mdDialog', '$timeout', function($scope, $http, $location, $mdDialog, $timeout) {
  
  $http({
    method: 'GET',
    url: '/account/fetch_accounts'

  }).then(function successCallback(response){
    var jiraAccounts = response.data;
    console.log(jiraAccounts);

    $scope.accountSearch = function(query) {
      var matches = [];
      jiraAccounts.forEach(function(account) {
          if (account.url.toLowerCase().indexOf(query.toString().toLowerCase()) >= 0) {
              matches.push(account);
          }
      });
      return matches;
    }

  }, function errorCallback(response){
    console.log(response);
  });

  
  
      
}]);