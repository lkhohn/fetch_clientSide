'use strict';

angular.module('starter.controllers')
  .controller('LandingPageCtrl', ['$scope', '$ionicPopup', '$timeout', '$location', '$state', '$cordovaGeolocation', '$compile', '$ionicLoading', 'AvailableFetchesService', 'styleArray', LandingPageCtrl]);


function LandingPageCtrl($scope, $ionicPopup, $timeout, $location, $state, $cordovaGeolocation, $compile, $ionicLoading, AvailableFetchesService, styleArray){
  var vm = this;
  var connectionURL = 'http://localhost:2000';
  
  vm.fetch = AvailableFetchesService.all()
  .then(function(fetchArr){
    vm.fetches = fetchArr.data;
  });

  var socket = io.connect(connectionURL);
  // console.log(socket);
  socket.on('connect', function (socket) {
    // console.log('connection');
  });
  // socket.on('check', function(data){
  //   console.log(data);
  // });
  socket.on('update', function(newFetch){
    vm.fetches.push(newFetch);
    $scope.$apply();
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
      title: 'retrieve a fetch',
      template: 'you must be signed in to retrieve a fetch'
    });

    confirmPopup.then(function(res) {
      if(res) {
          $location.path('/signin');
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

  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>loading...</p><ion-spinner></ion-spinner>'
    });
  };

  $scope.show($ionicLoading);

  $scope.hide = function(){
         $ionicLoading.hide();
   };

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    $scope.hide($ionicLoading);

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styleArray
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

    var fetchData = $scope.LandingPageFindFetch.fetches;

      // socket for adding new fetch marker
      var newFetchArray = [];
        socket.on('update', function(newFetch){
          newFetchArray.push(newFetch);
          loadMarkers(newFetchArray);
          emptyNewFetchArray(newFetchArray);
        });

        function emptyNewFetchArray(newFetchArray){
          newFetchArray.pop();
          // console.log(newFetchArray);
        }

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
        var paymentAmount = fetchData[i].paymentAmount;

        createMarker(markerPos, item, address, id, paymentAmount);
      }
    }
  }

function createMarker(markerPos, item, address, id, paymentAmount){
  var marker = new google.maps.Marker({
    map: $scope.map,
    animation: google.maps.Animation.DROP,
    position: markerPos,
    item: item,
    address: address,
    id: id,
    paymentAmount: paymentAmount
 });

   google.maps.event.addListener(marker, 'click', function(){
    //  console.log(marker);

     var infoWindow = new google.maps.InfoWindow();

     var iwContent = '<div id="iw_container">' +
        '<div>' + '<div class="iw_title">' + item + '</div>' + '<br />'  + '<div style="margin-bottom:1.25em">' + address + '<br />' + 'reward: $' + paymentAmount + '<br />' + '</div>' +
        '<button class="button" id="addClaimFetch" style="background-color:#7FDBD4" ng-click="LandingPageFindFetch.showButtonConfirm(iwContent)">retrieve</button>' +
        '</div>' + '</div>';


        var compile = $compile(iwContent)($scope);
        // var compileArr = compile[0];
        // console.log(compileArr)

      // including content to the infowindow
      infoWindow.setContent(compile[0]);

      // opening the infowindow in the current map and at the current marker location
      infoWindow.open($scope.map, marker);


      // confirm fetch claim
        vm.showButtonConfirm = function() {
          var confirmPopup = $ionicPopup.confirm({
            scope: $scope,
            title: 'retrieve a fetch',
            template: 'you must be signed in to retrieve a fetch'
          });

          confirmPopup.then(function(res) {
            if(res) {
              // addClaimFetch();
              $location.path('/signin');
             }
            else {
              console.log('You are not sure');
            }
          });
        };


    });
  }

}

var styleArray = [
{
    "featureType": "administrative",
    "elementType": "all",
    "stylers": [
        {
            "visibility": "on"
        },
        {
            "lightness": 33
        }
    ]
},
{
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
        {
            "color": "#f2e5d4"
        }
    ]
},
{
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
        {
            "color": "#c5dac6"
        }
    ]
},
{
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [
        {
            "visibility": "on"
        },
        {
            "lightness": 20
        }
    ]
},
{
    "featureType": "road",
    "elementType": "all",
    "stylers": [
        {
            "lightness": 20
        }
    ]
},
{
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
        {
            "color": "#c5c6c6"
        }
    ]
},
{
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
        {
            "color": "#e4d7c6"
        }
    ]
},
{
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
        {
            "color": "#fbfaf7"
        }
    ]
},
{
    "featureType": "water",
    "elementType": "all",
    "stylers": [
        {
            "visibility": "on"
        },
        {
            "color": "#7fdbd4"
        }
    ]
}
];