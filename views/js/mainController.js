angular.module('app')
.controller('MainController', ['$scope', '$http', MainController])
.controller('LandingPageController', ['$scope', LandingPageController])
.controller('NewFetchController', ['$scope', '$location', 'FetchService', NewFetchController])
.controller('SignupController', ['$scope','$location', 'Password', 'AddUserService', SignupController])
.controller('SigninController', ['$scope', '$location', 'SigninService', SigninController]);


// .controller('NavController', ['$scope', 'NavService', NavController])
// function NavController($scope, NavService){
//   var vm = this;
    // vm.name = NavService.name;
// }

function MainController ($scope, $http) {
  var vm = this;
}


function LandingPageController(){
  var vm = this;
}




function NewFetchController($scope, $location, FetchService) {
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
  function postNewFetch(newFetch){
    FetchService.postNewFetch(newFetch).then(function(response){
      console.log('post new fetch worked!');
      $location.path('/landingPage');
      });
    }
  }



function SignupController($scope, $location, Password, AddUserService){
  var vm = this;
  vm.signup = signup;
  function signup(user) {
    console.log(user);
    AddUserService.signup(user).then(function(response){
      $location.path('/signin');
    });
  }

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
}

function SigninController($scope, $location, SigninService){
  var vm = this;
  vm.signin = signin;
  function signin(user){
    SigninService.signin(user).then(function(response){
      localStorage.setItem('Authorization', 'Bearer ' + response.data.token);
      $location.path('/');
    });
  }
}
