'use strict';

angular.module('starter.controllers')
  .controller('AddFetchCtrl', ['$scope', '$location', 'FetchService', '$state', '$cordovaGeolocation', '$ionicModal', '$ionicHistory', '$ionicLoading', 'AvailableFetchesService', AddFetchCtrl]);


function AddFetchCtrl($scope, $location, FetchService, $state, $cordovaGeolocation, $ionicModal, $ionicHistory, $ionicLoading, AvailableFetchesService) {
  var vm = this;

  // autocomplete
  vm.initialize = initialize;

  function initialize() {
    vm.autocomplete = new google.maps.places.Autocomplete(
         /** @type {HTMLInputElement} */
         (document.getElementById('autocomplete')),
         { types: ['geocode'] });
     google.maps.event.addListener(vm.autocomplete, 'place_changed', function() {
     });
    }

  vm.initialize();

  vm.disableTap = function(){
      var container = document.getElementsByClassName('autocomplete');
      // disable ionic data tab
      angular.element(container).attr('data-tap-disabled', 'true');
      // leave input field if google-address-entry is selected
      angular.element(container).on("click", function(){
          document.getElementById('autocomplete').blur();
      });
  };


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
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styleArray
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
        // can make custom icons.... icon: image name
      });

      // create info window to load current address
      var infoWindow = new google.maps.InfoWindow();
      infoWindow.open($scope.map, marker);

      google.maps.event.addDomListener(infoWindow, 'click', function(){
          console.log('this worked');
      });

      // reload info window if clicked X
      google.maps.event.addListener(marker, 'click', function(){
        infoWindow.open($scope.map, marker);
      });

      // set info window with current address, then display modal
      vm.setInfoWindow = function(){
        infoWindow.setContent("<div id='iw_container'>" + "<div class='iw_title'>" + "fetch delivery location" + "</div>" + "<div style='margin:1em'>" +
        "<a id='location' ng-click='openModal()' style='color:#7FDBD4; font-weight: bold; font-size:1.5em'>" +  $scope.address + "</a>" + "</div>" + "</div>");
        // infoWindow.setContent("<div id='iw_container'>" + "<div class='iw_title'>" + "set drop location" + "</div>"
        // + "<a id='location' ng-click='openModal()'>" + $scope.address + "</a>" + "</div>");

        google.maps.event.addDomListener(infoWindow, 'domready', function(){
          document.getElementById('location').addEventListener('click', function(){
            vm.openModal();
            // to display form without a modal
           //     // $scope.confirmLocation = true;
           //     // $scope.$apply();
          });
        });
      };

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
                  // infoWindow.setContent($scope.address);
                  vm.setInfoWindow();

              });
            }
          });
        });
      });


      // convert latLng to address
      var locationData = JSON.stringify(marker.position);

      var locationObject = JSON.parse(locationData);


      var geocoder = new google.maps.Geocoder();
      $scope.confirmLocation = false;

        geocoder.geocode({'location': locationObject}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            $scope.$apply(function(){
              $scope.address = results[0]['formatted_address'];
              $scope.lat = locationObject.lat;
              $scope.lng = locationObject.lng;

              vm.setInfoWindow();

            });
          }
        });
    }); //End of add listener once

    $ionicModal.fromTemplateUrl('templates/addFetchModalForm.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
      vm.openModal = function(){
        $scope.modal.show();
      };
      vm.closeModal = function(){
        $scope.modal.hide();
      };


  }, function(error){
    console.log("Could not get location");
  });

  vm.postNewFetch = postNewFetch;
  function postNewFetch(fetchObj){
    // console.log(fetchObj);
    FetchService.postNewFetch(fetchObj).then(function(response){
      $ionicHistory.clearCache();
      vm.closeModal();
      $location.path('/tab/home');
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