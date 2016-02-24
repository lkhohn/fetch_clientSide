angular.module('app')
.controller('MainController', ['$scope', '$http', MainController]);
function MainController ($scope, $http) {
  var vm = this;
}

angular.module('app')
.controller('LandingPageController', ['$scope', LandingPageController]);
function LandingPageController(){
  var vm = this;

}


angular.module('app')
.controller('NewScoutController', ['$scope', 'ScoutService', NewScoutController]);
function NewScoutController($scope, ScoutService) {
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
  vm.postNewScout = postNewScout;
  function postNewScout(newScout){
    ScoutService.postNewScout(newScout).then(function(response){
      console.log('post new scout worked!');
      });
    }
  }



angular.module('app')
.controller('SignupController', ['$scope','$location', 'Password', 'addUserService', SignupController]);
function SignupController($scope, $location, Password, addUserService){
  var vm = this;
  this.regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

  $scope.$watch('user.password', function(pass) {
    // console.log(Password.getStrength(pass))
  	$scope.passwordStrength = Password.getStrength(pass);

  	if($scope.isPasswordWeak()) {
  		$scope.form.password.$setValidity('strength', false);
  	} else {
  		$scope.form.password.$setValidity('strength', true);
  	}
  });

  $scope.isPasswordWeak = function() {
  	return $scope.passwordStrength < 20;
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

  vm.signup = signup;

  function signup(user) {
    addUserService.addUser(user).then(function(response){
      $location.path('/signin');
    });
  }
}


angular.module('app')
.controller('SigninController', ['$scope', '$location', 'signinService', SigninController]);
function SigninController($scope, $location, signinService){
  var vm = this;
  vm.signin = signin;
  function signin(user){
    signinService.signin(user).then(function(response){
      $location.path('/');
    });
  }
}
