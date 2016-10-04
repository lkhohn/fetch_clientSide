'use strict';

angular.module('starter.controllers')
	.controller('AvailableFetches', ['$scope', 'AvailableFetchesService','ClaimableFetchService', 'FetchService', '$ionicPopup', '$timeout', '$location', '$state', '$cordovaGeolocation', '$compile', '$ionicLoading','dbURL','styleArray', AvailableFetches]);


function AvailableFetches($scope, AvailableFetchesService, ClaimableFetchService, FetchService, $ionicPopup, $timeout, $location, $state, $cordovaGeolocation, $compile, $ionicLoading, dbURL, styleArray){
  var vm = this;

  vm.fetches = [];

  vm.fetch = ClaimableFetchService.all()
  .then(function(fetchArr){
    vm.fetches = fetchArr.data;
  });
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>loading...</p><ion-spinner></ion-spinner>'
    });
  };

  var socket = io.connect(dbURL.url);
  // console.log(socket);
  socket.on('connect', function (socket) {
    // console.log('connection');
  });

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
      title: 'claim fetch',
      template: 'Are you sure you want to claim this fetch?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        // console.log($scope);
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

  $scope.isItemShown = function(fetch) {
    return $scope.shownItem === fetch;
  };

  vm.initialize = initialize;

  function initialize() {
  // display map
  var options = {timeout: 10000, enableHighAccuracy: true};

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

    var fetchData = $scope.AvailableFetches.fetches;

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

     var infoWindow = new google.maps.InfoWindow();

     var iwContent = '<div id="iw_container">' +
        '<div>' + '<div class="iw_title">' + item + '</div>' + '<br />' + '<div style="margin-bottom:1.25em">' + address + '<br />' + 'reward: $' + paymentAmount + '<br />' + '</div>' +
        '<button class="button" id="addClaimFetch" style="background-color:#7FDBD4" ng-click="AvailableFetches.showButtonConfirm(iwContent)">claim</button>' +
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
            title: item,
            template: 'Are you sure you want to claim this fetch?'
          });

          confirmPopup.then(function(res) {
            if(res) {
              addClaimFetch();
             }
            else {
              console.log('You are not sure');
            }
          });
        };

      vm.addClaimFetch = addClaimFetch;
      function addClaimFetch(iwContent){
        var fetchObjClaim = {
          item: marker.item,
          address: marker.address,
          id: marker.id
        };

        FetchService.claimFetch(fetchObjClaim).then(function(response){
               $location.path('/tab/home');
        });
      }
    });
  }
}

