angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope) {})

.controller('AddFetchCtrl', ['$scope', '$location', 'FetchService', AddFetchCtrl])

.controller('FindFetchCtrl', ['$scope', 'FetchService', FindFetchCtrl])

.controller('AccountCtrl', ['$scope', '$location', 'Password', 'SigninService', 'AddUserService', AccountCtrl]);


function AddFetchCtrl($scope, $location, FetchService) {
  var vm = this;
  vm.initialize = initialize;
  vm.autocomplete;

  function initialize() {
     autocomplete = new google.maps.places.Autocomplete(
         /** @type {HTMLInputElement} */(document.getElementById('autocomplete')),
         { types: ['geocode'] });
     google.maps.event.addListener(autocomplete, 'place_changed', function() {
     });
    }

  vm.initialize();
  vm.postNewFetch = postNewFetch;

  function postNewFetch(fetchObj){
    FetchService.postNewFetch(fetchObj).then(function(response){
      console.log('post new fetch worked!');
      $location.path('/tab/home');
      });
    }
  }



function FindFetchCtrl($scope, FetchService){
  var vm = this;
  vm.fetch = {};
  vm.test = 'this is a test';

  FetchService.showAvailFetches().then(function(response){
    // console.log(response);
    // console.log(response.data);
    vm.fetch = response.data;
  });
}



function AccountCtrl($scope, $location, Password, SigninService, AddUserService){
  var vm = this;
  vm.signin = signin;
  vm.signup = signup;
  vm.signout = signout;

  function signin(user){
    SigninService.signin(user).then(function(response){
      localStorage.setItem('Authorization', 'Bearer ' + response.data.token);
      $location.path('/tab/home');
      vm.loggedStatus = true;
    });
  }

  function signup(user) {
    var vm = this;
    console.log(user);
    // AddUserService.signup(user).then(function(response){
    //   $location.path('/tab/account');
    // });
    this.regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;


    $scope.$watch('user.password', function(pass) {
      // console.log(Password.getStrength(pass))
    	$scope.passwordStrength = Password.getStrength(pass);

    	if($scope.isPasswordWeak()) {
        if($scope.form !== undefined && $scope.form.password !== undefined){
    		    $scope.form.password.$setValidity('strength', false);
        }
        // else {
        //   $scope.form.password = "";
        //   $scope.form.password.$setValidity('strength', false);
        // }
    	} else {
    		$scope.form.password.$setValidity('strength', true);
    	}
    });

    $scope.isPasswordWeak = function() {
      if($scope.form !== undefined && $scope.form.password !== undefined){
        return $scope.passwordStrength < 20;
      }
      else {
        return true;
      }

    };
    $scope.isPasswordOk = function() {
    	return $scope.passwordStrength >= 20 && $scope.passwordStrength <= 50;
    };
    $scope.isPasswordStrong = function() {
    	return $scope.passwordStrength > 50;
    };
    $scope.isInputValid = function(input) {
    	return input.$dirty && input.$valid;
    };
    $scope.isInputInvalid = function(input) {
    	return input.$dirty && input.$invalid;
    };


    AddUserService.signup(user).then(function(response){
      $location.path('/tab/account');
    });
  }

  function signout() {
    localStorage.setItem('Authorization', null);
    $location.path('/tab/new');
    vm.loggedStatus = false;
  }
}
