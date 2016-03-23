angular.module('starter.controllers', [])

.controller('HomeCtrl', ['$scope', '$ionicPopup', '$timeout', '$location', 'Fetches', 'FetchService', 'UserHistoryService', HomeCtrl])

.controller('AddFetchCtrl', ['$scope', '$location', 'FetchService', '$state', '$cordovaGeolocation', 'AvailableFetchesService', AddFetchCtrl])

.controller('FindFetchCtrl', ['$scope', 'Fetches', FindFetchCtrl])

.controller('AvailableFetches', ['$scope', 'AvailableFetchesService', 'FetchService', '$ionicPopup', '$timeout', '$location', '$state', '$cordovaGeolocation', '$compile', AvailableFetches])

.controller('AccountCtrl', ['$scope', '$location', '$state', 'Password', 'SigninService', 'AddUserService', 'UserHistoryService', AccountCtrl]);

// function latLngConvertToAddress(){
//   var vm = this;
//   vm.fetch = Fetches.all()
//   .then(function(fetchArr){
//     vm.fetches = fetchArr.data;
//     // console.log(vm.fetches)
//
//     var fetchData = vm.fetches;
//     var latitude = {};
//     var longitude = {};
//
//     for(var i=0; i<fetchData.length; i++){
//       // console.log(fetchData[i])
//       latitude.lat = fetchData[i].lat;
//       longitude.lng = fetchData[i].lng;
//       var latLng = Object.assign(latitude, longitude);
//       // console.log(latLng);
//
//       var myLatlng = new google.maps.LatLng(parseFloat(latLng.lat),parseFloat(latLng.lng));
//
//       var geocoder = new google.maps.Geocoder();
//        geocoder.geocode({'location': myLatlng}, function(results, status) {
//          if (status === google.maps.GeocoderStatus.OK) {
//           vm.address = results[0]['formatted_address'];
//         }
//       });
//     }
//   }
// });
// }

function HomeCtrl($scope, $ionicPopup, $timeout, $location, Fetches, FetchService, UserHistoryService){
  var vm = this;
  vm.fetch = Fetches.all()
  .then(function(fetchArr){
    vm.fetches = fetchArr.data;
  });

  //show user claimed fetches
  vm.userClaimedFetch = UserHistoryService.getHistory()
  .then(function(fetchArr){
    // console.log(fetchArr.data);
    vm.userClaimedFetches = fetchArr.data;
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

}


function AddFetchCtrl($scope, $location, FetchService, $state, $cordovaGeolocation, AvailableFetchesService) {
  var vm = this;

// autocomplete
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


// display map
var options = {timeout: 10000, enableHighAccuracy: true};

// var locationData = {};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      //drop pin
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        draggable: true,
        position: latLng
      });


//update address field based on dragged pin
    google.maps.event.addListener(marker, 'dragend', function() {
    // set the new marker location's lat and lng\
      // console.log(marker.getPosition());
      $scope.$apply(function(){
        // console.log(marker);
      marker.position[marker.getPosition()];

      var locationData = JSON.stringify(marker.position);

      var locationObject = JSON.parse(locationData);

      var geocoder = new google.maps.Geocoder();
      $scope.lat = locationObject.lat;
      $scope.lng = locationObject.lng;

      geocoder.geocode({'location': locationObject}, function(results, status) {
        if(status === google.maps.GeocoderStatus.OK){
          $scope.$apply(function(){
            $scope.address = results[0]['formatted_address'];
          });
        }
      });
    });
  });

  // convert latLng to address
      var locationData = JSON.stringify(marker.position);

      var locationObject = JSON.parse(locationData);


      var geocoder = new google.maps.Geocoder();

       geocoder.geocode({'location': locationObject}, function(results, status) {
         if (status === google.maps.GeocoderStatus.OK) {
           $scope.$apply(function(){
            $scope.address = results[0]['formatted_address'];
            $scope.lat = locationObject.lat;
            $scope.lng = locationObject.lng;

          });
        }
      });
    });
  }, function(error){
    console.log("Could not get location");
  });

  vm.postNewFetch = postNewFetch;
  function postNewFetch(fetchObj){
    // console.log(fetchObj);
    FetchService.postNewFetch(fetchObj).then(function(response){
      $location.path('/tab/home');
        });
      }
  }







function AvailableFetches($scope, AvailableFetchesService, FetchService, $ionicPopup, $timeout, $location, $state, $cordovaGeolocation, $compile){
  var vm = this;


  // var socket = io.connect('https://mysterious-waters-23406.herokuapp.com');
  // socket.on('connection', function (socket) {
  //   console.log('alskfjalsk')
  //   socket.on('new fetch', function(data){
  //         console.log(data);
  //   });
  // });




    //   // original without sockets
      vm.fetch = AvailableFetchesService.all()
      .then(function(fetchArr){
        // console.log(fetchArr.data);
        vm.fetches = fetchArr.data;
    });



// accordian to show fetch details
  $scope.toggleItem = function(fetch) {
    // console.log(fetch);
    if ($scope.isItemShown(fetch)) {
      $scope.shownItem = null;
    } else {
      $scope.shownItem = fetch;
    }
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
        // console.log($scope);
        var updateFetch = $scope.shownItem;
        console.log(updateFetch)
        FetchService.claimFetch(updateFetch).then(function(response){
          $location.path('/tab/home');
        });
       }
      else {
        console.log('You are not sure');
      }
    });
  };

  $scope.isItemShown = function(fetch) {
    return $scope.shownItem === fetch;
  };


  vm.initialize = initialize;


  function initialize() {
  // display map
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      var fetchData = $scope.AvailableFetches.fetches
      // console.log($scope.AvailableFetches.fetches)
      infoWindow = new google.maps.InfoWindow();

      loadMarkers(fetchData);
    });
  }, function(error){
    console.log("Could not get location");
  });
}

  vm.initialize();

  vm.loadMarkers = loadMarkers;
  function loadMarkers(fetchData){
    for(var i=0; i<fetchData.length; i++){
      if(!fetchData[i].dateClaimed && !fetchData[i].dateClosed){
        var markerPos = new google.maps.LatLng(fetchData[i].lat, fetchData[i].lng);
        var item = fetchData[i].item;
        var address = fetchData[i].address;
        var id = fetchData[i].id;

        createMarker(markerPos, item, address, id);
      }
    }
  }

function createMarker(markerPos, item, address, id){
  var marker = new google.maps.Marker({
    map: $scope.map,
    animation: google.maps.Animation.DROP,
    position: markerPos,
    item: item,
    address: address,
    id: id
 });

   google.maps.event.addListener(marker, 'click', function(){
    //  console.log(marker);

     var infoWindow = new google.maps.InfoWindow();

     var iwContent = '<div id="iw_container">' +
        '<div>' + address + '<br />' + item + '<br />' +
        // '<button class="button-addClaimFetch">claim</button>' +
        '<button class="button" id="addClaimFetch" ng-click="AvailableFetches.addClaimFetch(iwContent)">claim</button>' +
        '</div>' + '</div>';

        var compile = $compile(iwContent)($scope);
        // var compileArr = compile[0];
        // console.log(compileArr)


      // including content to the infowindow
      infoWindow.setContent(compile[0]);

      // opening the infowindow in the current map and at the current marker location
      infoWindow.open($scope.map, marker);


      vm.addClaimFetch = addClaimFetch;
      function addClaimFetch(iwContent){
        var fetchObjClaim = {
          item: marker.item,
          address: marker.address,
          id: marker.id
        }
        console.log(fetchObjClaim);
        console.log(marker.item);
        FetchService.claimFetch(fetchObjClaim).then(function(response){
               $location.path('/tab/home')

              })
      }



   });
 }

// vm.addClaimFetch = addClaimFetch;
// function addClaimFetch(iwContent){
//   console.log(iwContent)
//
//         var confirmBtn = document.getElementsByClassName('button-addClaimFetch')
//         console.log(document.getElementsByClassName('button-addClaimFetch'))
//         google.maps.event.addDomListener(confirmBtn, 'click', function(event){
//           console.log('hey')
//         })
// }


  //  var fetchObj = {};
   //
   //
  //   for(var i=0; i<fetchData.length; i++){
  //     // console.log(fetchData[i])
  //     var markerDetails = fetchData[i];
  //     if(!markerDetails.dateClaimed && !markerDetails.dateClosed){
  //         var markerPos = new google.maps.LatLng(markerDetails.lat, markerDetails.lng);
  //       // console.log(markerDetails)
  //       // vm.item = markerDetails.item;
  //       // vm.address = markerDetails.address;
  //       fetchObj['item'] = markerDetails.item;
  //       fetchObj['address'] = markerDetails.address;
  //       // console.log(fetchObj)
  //       var marker = new google.maps.Marker({
  //         map: $scope.map,
  //         animation: google.maps.Animation.DROP,
  //         position: markerPos,
  //         content: fetchObj
  //      });
   //
   //
  //      google.maps.event.addListener(marker, 'click', function() {
  //        console.log(marker)
  //         // infoWindow.open($scope.map, marker);
  //           });
  //     }
  //   }

    //  vm.addInfoWindow = addInfoWindow;
    //  function addInfoWindow(marker, message) {
    //   //  var compile = $compile(message)($scope);
    //   //  var compileArr = compile[0];
    //   //  console.log(compileArr)
    //    var infoWindow = new google.maps.InfoWindow({
    //     content: message
    //   });
    //  marker.addListener('click', function() {
    //     infoWindow.open($scope.map, marker);
    //   });
    // }


    // AvailableFetchesService.all()
      // .then(function(fetchArr){
        // console.log(fetchArr.data);

    // var markers = fetchArr.data;
    //
    //
    // for(var i=0; i<markers.length; i++){
    //   $scope.record = markers[i];
    //
    //
    //     if(!$scope.record.dateClaimed && !$scope.record.dateClosed){
    //      var markerPos = new google.maps.LatLng($scope.record.lat, $scope.record.lng);
    //
    //      // Add the markerto the map
    //      var marker = new google.maps.Marker({
    //         map: $scope.map,
    //         animation: google.maps.Animation.DROP,
    //         position: markerPos
    //      });
    //
    //     var fetchObj = {};
    //      $scope.fetchObj = fetchObj;
    //      vm.item = $scope.record.item;
    //      vm.address = $scope.record.address;
    //
    //      fetchObj['item'] = vm.item;
    //      fetchObj['address'] = vm.address;
    //
    //      var contentString = "<div>" +
    //     "<h4>" + "item: " + fetchObj.item + "</h4>" +
    //     // "<p>" + "requested: " + $scope.record.dateRequested  + "</p>" +
    //     // "<p>" + "claimed: " + $scope.record.dateClaimed  + "</p>" +
    //     // "<p>" + "closed: " + $scope.record.dateClosed  + "</p>" +
    //     // "<p>" + "requestor id: " + $scope.record.requestor_id  + "</p>" +
    //     // "<p>" + "claimor id: " + $scope.record.claimor_id  + "</p>" +
    //     "<p>" + "address: " + fetchObj.address  + "</p>" +
    //     // "<p>" + "amount: " + $scope.record.paymentAmount  + "</p>" +
    //
    //   "<button class='button' ng-click='AvailableFetches.addClaimFetch(fetchObj)' data-tap-disabled ='true'>claim</button>" +
    //     "</div>";
    //
    //     // must compile for button ng-click functionality
    //     var compile = $compile(contentString)($scope);
    //     var compileArr = compile[0];
    //     // console.log(compileArr)
    //     $scope.compileArr = compileArr
    //      addInfoWindow(marker, compileArr);
    //
    //       vm.addInfoWindow = addInfoWindow;
    //       function addInfoWindow(marker, message) {
    //         var infoWindow = new google.maps.InfoWindow({
    //          content: message
    //        });
    //       marker.addListener('click', function() {
    //          infoWindow.open($scope.map, marker);
    //        });
    //      }
    //
    //      vm.addClaimFetch = addClaimFetch;
    //      function addClaimFetch(fetchObj){
    //        var fetchObjClaim = $scope.fetchObj;
    //        console.log(fetchObjClaim)
    //
    //        FetchService.claimFetch(fetchObjClaim).then(function(response){
    //          $location.path('/tab/home')
    //      })
    //    }
    //
    //
    //      vm.showConfirmButton = function(fetchObj) {
    //        var confirmPopup = $ionicPopup.confirm({
    //          scope: $scope,
    //          title: 'claim fetch',
    //          template: 'Are you sure you want to claim this fetch?'
    //        });
    //
    //        confirmPopup.then(function(res) {
    //          if(res) {
    //            var fetchObjClaim = $scope.fetchObj;
    //            FetchService.claimFetch(fetchObjClaim).then(function(response){
    //              $location.path('/tab/home');
    //            });
    //           }
    //          else {
    //            console.log('You are not sure');
    //          }
    //        });
    //
    //      };
    //
    //
    //
    //       }
    //     }





      // });





      // vm.showConfirmButton = function(fetchObj) {
      //   // console.log($scope)
      //   console.log(fetchObj)
      //   var confirmPopup = $ionicPopup.confirm({
      //     scope: $scope,
      //     title: 'claim fetch',
      //     template: 'Are you sure you want to claim this fetch?'
      //   });
      //
      //   confirmPopup.then(function(res) {
      //     if(res) {
      //       // console.log($scope);
      //
      //       var fetchObjClaim = $scope.fetchObj;
      //       console.log($scope.fetchObj)
      //       // console.log(recordInput)
      //       // fetchInputObj(item) = record.item
      //       FetchService.claimFetch(fetchObjClaim).then(function(response){
      //         $location.path('/tab/home');
      //       });
      //      }
      //     else {
      //       console.log('You are not sure');
      //     }
      //   });
      //
      // };



    //  vm.addInfoWindow = addInfoWindow;
    //  function addInfoWindow(marker, message) {
    //   //  var compile = $compile(message)($scope);
    //   //  var compileArr = compile[0];
    //   //  console.log(compileArr)
    //    var infoWindow = new google.maps.InfoWindow({
    //     content: message
    //   });
    //  marker.addListener('click', function() {
    //     infoWindow.open($scope.map, marker);
    //   });
    // }




}



function FindFetchCtrl($scope, Fetches){
  var vm = this;
  vm.fetch = Fetches.all()
  .then(function(fetchArr){
    // console.log(fetchArr.data);
    vm.fetches = fetchArr.data;
  });
}



function AccountCtrl($scope, $location, $state, Password, SigninService, AddUserService, UserHistoryService){
  var vm = this;
  vm.signin = signin;
  vm.signup = signup;
  vm.signout = signout;


  vm.fetch = UserHistoryService.getHistory()
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
