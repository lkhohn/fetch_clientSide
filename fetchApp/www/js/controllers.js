angular.module('starter.controllers', [])

.controller('HomeCtrl', ['$scope', '$ionicPopup', '$timeout', '$location', '$stateParams', 'Fetches', 'FetchService', 'AvailableFetchesService', HomeCtrl])

.controller('AddFetchCtrl', ['$scope', '$location', 'FetchService', '$state', '$cordovaGeolocation', AddFetchCtrl])

.controller('FindFetchCtrl', ['$scope', 'Fetches', FindFetchCtrl])

.controller('FetchDetailCtrl', ['$scope', '$stateParams', 'Fetches', FetchDetailCtrl])

.controller('AvailableFetches', ['$scope', 'AvailableFetchesService', 'FetchService', '$ionicPopup', '$timeout', '$location', AvailableFetches])

.controller('AccountCtrl', ['$scope', '$location', '$state', 'Password', 'SigninService', 'AddUserService', AccountCtrl]);


function HomeCtrl($scope, $ionicPopup, $timeout, $location, $stateParams, Fetches, FetchService, AvailableFetchesService){
  var vm = this;
  vm.fetch = Fetches.all()
  .then(function(fetchArr){
    vm.fetches = fetchArr.data;
  });
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

// close button to update dateClosed
  vm.showClosed = function() {
    var confirmPopup = $ionicPopup.confirm({
      scope: $scope,
      title: 'claim fetch',
      template: 'Are you sure you want to claim this fetch?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        var updateFetch = $scope.shownItem;
        FetchService.closeFetch(updateFetch).then(function(response){
          $location.path('/tab/home');
        });
       }
      else {
        console.log('You are not sure');
      }
    });
  };

// show user claimed fetches
  vm.userClaimedFetch = AvailableFetchesService.all()
  .then(function(fetchArr){
    var fetchData = fetchArr.data
    // console.log($scope)
    // console.log($scope.Home.userClaimedFetches);
    // for(var i=0; i<fetchData.length; i++){
      // if(fetchData[i].requestor_id === $stateParams(id)){
        // console.log(fetchData[i].requestor_id)
      // }
    // }
    // console.log(fetchArr.data[requestor_id])
    // if(fetchArr.data.requestor_id)
    vm.userClaimedFetches = fetchArr.data;
  });
}


function AddFetchCtrl($scope, $location, FetchService, $state, $cordovaGeolocation) {
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

  vm.disableTap = function(){
      container = document.getElementsByClassName('autocomplete');
      // disable ionic data tab
      angular.element(container).attr('data-tap-disabled', 'true');
      // leave input field if google-address-entry is selected
      angular.element(container).on("click", function(){
          document.getElementById('autocomplete').blur();
      });
  };


  vm.postNewFetch = postNewFetch;
  function postNewFetch(fetchObj){
    FetchService.postNewFetch(fetchObj).then(function(response){
      console.log('post new fetch worked!');
      $location.path('/tab/home');
      });
    }

// display map

var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  }, function(error){
    console.log("Could not get location");
  });


  }



function FindFetchCtrl($scope, Fetches){
  var vm = this;
  vm.fetch = Fetches.all()
  .then(function(fetchArr){
    // console.log(fetchArr.data);
    vm.fetches = fetchArr.data;
  });
}



function FetchDetailCtrl($scope, $stateParams, Fetches){
  // CURRENTLY NOT BEING USED. USE AVAILABLE FETCHES CONTROLLER
    var vm = this;
    // console.log($stateParams)
    vm.fetch = Fetches.all()
    .then(function(fetchArr){
      // console.log(fetchArr.data)
      var fetchesData = fetchArr.data;
      for (var i = 0; i < fetchesData.length; i++) {
        // console.log(fetches[i].id)
        // console.log($stateParams['fetch_id'])
        var currentId = $stateParams['fetch_id'];
          if (fetchesData[i].id === parseInt(currentId)) {
            vm.fetchDetails = fetchesData[i];
            // return fetches[i];
          }
        }
        return null;
    });
}



function AvailableFetches($scope, AvailableFetchesService, FetchService, $ionicPopup, $timeout, $location){
  var vm = this;
  vm.fetch = AvailableFetchesService.all()
  .then(function(fetchArr){
    vm.fetches = fetchArr.data;
});

// accordian to show fetch details
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

// confirm fetch claim
 vm.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     scope: $scope,
     title: 'claim fetch',
     template: 'Are you sure you want to claim this fetch?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       var updateFetch = $scope.shownItem;
       FetchService.claimFetch(updateFetch).then(function(response){
         $location.path('/tab/home');
       });
      }
     else {
       console.log('You are not sure');
     }
   });
 };
}





function AccountCtrl($scope, $location, $state, Password, SigninService, AddUserService){
  var vm = this;
  vm.signin = signin;
  vm.signup = signup;
  vm.signout = signout;

  function signin(user){
    SigninService.signin(user).then(function(response){
      localStorage.setItem('Authorization', 'Bearer ' + response.data.token);
      // $location.path('/tab/home');
      $state.go('tab.home');

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
      $location.path('/signin');
    });
  }

  function signout() {
    localStorage.setItem('Authorization', null);
    $location.path('/landingPage');
    vm.loggedStatus = false;
  }
}
