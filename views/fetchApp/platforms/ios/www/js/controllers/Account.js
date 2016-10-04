'use strict';

angular.module('starter.controllers')
	.controller('AccountCtrl', ['$scope', '$location', '$state', '$ionicLoading', 'SigninService', 'AddUserService', AccountCtrl]);

function AccountCtrl($scope, $location, $state, $ionicLoading, SigninService, AddUserService){
  var vm = this;
  vm.signin = signin;
  vm.signup = signup;



  function signin(user){
    SigninService.signin(user).then(function(response){

      $scope.show = function() {
        $ionicLoading.show({
          template: '<p>loading...</p><ion-spinner></ion-spinner>'
        });
      };
      $scope.show($ionicLoading);

      $scope.hide = function(){
             $ionicLoading.hide();
       };

      localStorage.setItem('Authorization', 'Bearer ' + response.data.token);
      // $location.path('/tab/home');
      $scope.hide($ionicLoading);
      $state.go('tab.home');

      vm.loggedStatus = true;
    });
  }

  function signup(user) {
    console.log(user);
    AddUserService.signup(user).then(function(response){


      $scope.show = function() {
        $ionicLoading.show({
          template: '<p>loading...</p><ion-spinner></ion-spinner>'
        });
      };
      $scope.show($ionicLoading);

      $scope.hide = function(){
             $ionicLoading.hide();
       };

      localStorage.setItem('Authorization', 'Bearer ' + response.data.token);

      $ionicLoading.hide();

      $state.go('tab.home');
      vm.loggedStatus = true;
    });
  }

}