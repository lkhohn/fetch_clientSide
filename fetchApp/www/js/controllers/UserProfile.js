'use strict';

angular.module('starter.controllers')
	.controller('UserProfileCtrl', ['$scope', '$location', '$state', 'Fetches', 'UserHistoryService', 'UserInformation', UserProfileCtrl]);


function UserProfileCtrl($scope, $location, $state, Fetches, UserHistoryService, UserInformation){
  var vm = this;
  var connectionURL = 'http://localhost:2000';
  
  vm.signout = signout;
  function signout() {
    localStorage.setItem('Authorization', null);
    $location.path('/signin');
    vm.loggedStatus = false;
    }

	console.log($scope);
   //
   vm.userName = UserInformation.all()
   .then(function(data){
     console.log(data);
     vm.userNameDetails = data.data[0].email;
   });

    vm.fetches = [];
    vm.claimedFetches = [];

    var socket = io.connect(connectionURL);
    // console.log(socket);
    socket.on('connect', function (socket) {
      // console.log('connection');
    });

    socket.on('update', function(newFetch){
      vm.fetches.push(newFetch);
      $scope.$apply();
    });

// claimor_id is the current user
    vm.fetch = UserHistoryService.getHistory()
    .then(function(fetchArr){
      vm.fetches = fetchArr.data;
    });

// requestor_id is the current user
    vm.claimedFetch = Fetches.all()
    .then(function(fetchArr){
      vm.claimedFetches = fetchArr.data;
      // console.log(fetchArr.data);
    });


    // display fetch history
    vm.fetchDeliveryHistoryDisplay = function(){
      $scope.deliveryFetches = true;
      $scope.retrievedFetches = false;
    };

    vm.fetchRetrievedHistoryDisplay = function(){
      $scope.deliveryFetches = false;
      $scope.retrievedFetches = true;
    };


   $scope.toggleItem= function(fetch) {
     if ($scope.isItemShown(fetch)) {
       $scope.shownItem = null;
     } else {
       $scope.shownItem = fetch;
     }
   };
   $scope.isItemShown = function(fetch) {
     return $scope.shownItem === fetch;
   };

}