angular.module('starter.controllers', [])

.controller('LandingPageCtrl', ['$scope', '$ionicPopup', '$timeout', '$location', '$state', '$cordovaGeolocation', '$compile', '$ionicLoading', 'AvailableFetchesService', LandingPageCtrl])

.controller('HomeCtrl', ['$scope', '$ionicPopup', '$timeout', '$location', '$ionicModal', '$ionicHistory', 'Fetches', 'FetchService', 'UserHistoryService', 'UserInformation', 'RetrievingFetchContactInfo', HomeCtrl])

.controller('AddFetchCtrl', ['$scope', '$location', 'FetchService', '$state', '$cordovaGeolocation', '$ionicModal', '$ionicHistory', '$ionicLoading', 'AvailableFetchesService', AddFetchCtrl])

.controller('AvailableFetches', ['$scope', 'AvailableFetchesService','ClaimableFetchService', 'FetchService', '$ionicPopup', '$timeout', '$location', '$state', '$cordovaGeolocation', '$compile', '$ionicLoading', AvailableFetches])

.controller('AccountCtrl', ['$scope', '$location', '$state', '$ionicLoading', 'SigninService', 'AddUserService', AccountCtrl])

.controller('UserProfileCtrl', ['$scope', '$location', '$state', 'Fetches', 'UserHistoryService', 'UserInformation', UserProfileCtrl]);


function LandingPageCtrl($scope, $ionicPopup, $timeout, $location, $state, $cordovaGeolocation, $compile, $ionicLoading, AvailableFetchesService){
  var vm = this;

  vm.fetch = AvailableFetchesService.all()
  .then(function(fetchArr){
    vm.fetches = fetchArr.data;
  });

  var socket = io.connect('https://mysterious-waters-23406.herokuapp.com');

  socket.on('connect', function (socket) {
    // console.log('connection');
  });

  socket.on('update', function(newFetch){
    vm.fetches.push(newFetch);
    $scope.$apply();
  });

  $scope.toggleItem = function(fetch) {
    if ($scope.isItemShown(fetch)) {
      $scope.shownItem = null;
    } else {
      $scope.shownItem = fetch;
    }
  };

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

      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
        var fetchData = $scope.LandingPageFindFetch.fetches;

        var newFetchArray = [];
          socket.on('update', function(newFetch){
            newFetchArray.push(newFetch);
            loadMarkers(newFetchArray);
            emptyNewFetchArray(newFetchArray);
          });

        function emptyNewFetchArray(newFetchArray){
          newFetchArray.pop();
        }

        loadMarkers(fetchData);
      });
    }, function(error){
      console.log('Could not get location');
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

    var iwContent = "<div id='iw_container'>" +
        "<div>" + "<div class='iw_title'>" + item + "</div>" + "<br />"  + "<div style='margin-bottom:1.25em'>" + address + "<br />" + "reward: $" + paymentAmount + "<br />" + "</div>" +
        "<button class='button' id='addClaimFetch' style='background-color:#7FDBD4' ng-click='LandingPageFindFetch.showButtonConfirm(iwContent)''>retrieve</button>" +
        "</div>" + "</div>";

    var compile = $compile(iwContent)($scope);
      infoWindow.setContent(compile[0]);
      infoWindow.open($scope.map, marker);

      vm.showButtonConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
          scope: $scope,
          title: 'retrieve a fetch',
          template: 'you must be signed in to retrieve a fetch'
        });

        confirmPopup.then(function(res) {
          if(res) {
            $location.path('/signin')
           }
          else {
            console.log('You are not sure');
          }
        });
      };
    });
  }
}

function HomeCtrl($scope, $ionicPopup, $timeout, $location, $ionicModal, $ionicHistory, Fetches, FetchService, UserHistoryService, UserInformation, RetrievingFetchContactInfo){
  var vm = this;

  vm.fetch = Fetches.all()
    .then(function(fetchArr){
      vm.fetches = fetchArr.data;
      var data = fetchArr.data;
      tossedFetches(data);
      tossedToBeClosed(data);
    });

  vm.userInformation = RetrievingFetchContactInfo.all()
    .then(function(userDataArr){
      vm.userClaimedFetches = userDataArr.data;
      var data = userDataArr.data;
      retrievedFetches(data);
    });

  $ionicModal.fromTemplateUrl('templates/mapDirections.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modalMap) {
    $scope.modalMap = modalMap;
  });

  vm.mapPopup = function(){
    $scope.modalMap.show();
    var markerPos = new google.maps.LatLng($scope.shownItem.lat, $scope.shownItem.lng);
    initMap(markerPos);
  };

  vm.closeModalMap = function(){
    $scope.modalMap.hide();
  };

  vm.initMap = initMap;

  function initMap(markerPos) {
    var map = new google.maps.Map(document.getElementById('mapDirection'), {
      center: markerPos,
      zoom: 15
    });

    var marker = new google.maps.Marker({
      position: markerPos,
      map: map,
      title: $scope.shownItem.address
    });

    var infowindow = new google.maps.InfoWindow({
      content: $scope.shownItem.address
    });

    infowindow.open(map, marker);
  }

  vm.tossedFetches = tossedFetches;

  function tossedFetches(data){
    var tossedFetchCount = [];
    if(data.length === 0){
      vm.noTossedFetches = true;
    } else {
      for(var i=0; i<data.length; i++){
        if(data[i].dateClosed === null && data[i].dateClaimed === null){
          tossedFetchCount.push(data[i]);
          if(tossedFetchCount.length === 0 ){
            vm.noTossedFetches = true;
          } else {
            vm.noTossedFetches = false;
          }
        }
      }
    }
  }

  vm.tossedToBeClosed = tossedToBeClosed;

  function tossedToBeClosed(data){
    var needToBeClosedFetchCount = [];
    if(data.length===0) {
      vm.fetchToBeClosed = true;
    } else {
      for(var i=0; i<data.length; i++){
        if(data[i].dateClosed === null && data[i].dateClaimed != null){
          needToBeClosedFetchCount.push(data[i]);
          if(needToBeClosedFetchCount.length === 0){
            vm.fetchToBeClosed = true;
          }
        }
      }
    }
  }

  vm.retrievedFetches = retrievedFetches;

  function retrievedFetches(data){
    var retrievedFetchesArr = [];
    if(data.length === 0){
      vm.retrievedFetches = true;
    } else {
      for(var i=0; i<data.length; i++){
        if(data[i].dateClosed === null){
          retrievedFetchesArr.push(data[i]);
          if(retrievedFetches.length === 0 ){
            vm.retrievedFetches = true;
          } else {
            vm.retrievedFetches = false;
          }
        }
      }
    }
  }

  var socket = io.connect('https://mysterious-waters-23406.herokuapp.com');

  socket.on('connect', function (socket) {
    // console.log('connection');
  });

  socket.on('claimOrClose', function(newFetch){
    vm.fetch = Fetches.all()
    .then(function(fetchArr){
      vm.fetches = fetchArr.data;
    });

    vm.userClaimedFetch = UserHistoryService.getHistory()
    .then(function(fetchArr){
      vm.userClaimedFetches = fetchArr.data;
    });
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

  vm.showClosed = function() {
    var confirmPopup = $ionicPopup.confirm({
      scope: $scope,
      title: 'close fetch',
      template: 'confirm reciept of your fetch'
    });

    confirmPopup.then(function(res) {
      if(res) {
        var updateFetch = $scope.shownItem;
        FetchService.closeFetch(updateFetch).then(function(response){
          $location.path('/tab/home');
        });
       } else {
        console.log('You are not sure');
      }
    });
  };

  $ionicModal.fromTemplateUrl('templates/updateFetchModalForm.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  vm.openModal = function(){
    $scope.modal.show();
    vm.fetchUpdateData = $scope.shownItem;
  };

  vm.closeModal = function(){
    $scope.modal.hide();
  };

  vm.updateFetchInput = updateFetchInput;

  function updateFetchInput(updateItem){
    if(updateItem.item !== null){
      $scope.shownItem.item = updateItem.item;
    } else if(updateItem.paymenAmount !== null){
      $scope.shownItem.paymentAmount = updateItem.paymentAmount;
    } else if(updateItem.address !== null) {
      $scope.shownItem.address = updateItem.address;
    };

   var updateFetch = $scope.shownItem;

    FetchService.updateFetch(updateFetch).then(function(data){
      $ionicHistory.clearCache();
      vm.closeModal();
    });
  }


  vm.showDeleteConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: $scope.shownItem.item,
      template: 'are you sure you want to delete?' + '<br />' + '<br />' + 'no one will be able to retrieve it!' + '<br />'
    });

    confirmPopup.then(function(res) {
      if(res) {
        var fetchToDelete = $scope.shownItem;
        FetchService.deleteFetch(fetchToDelete).then(function(data){
          console.log('this worked');
        });

      } else {
        console.log('You are not sure');
      }
    });
  };
}


function AddFetchCtrl($scope, $location, FetchService, $state, $cordovaGeolocation, $ionicModal, $ionicHistory, $ionicLoading, AvailableFetchesService) {
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
    angular.element(container).attr('data-tap-disabled', 'true');
    angular.element(container).on('click', function(){
      document.getElementById('autocomplete').blur();
    });
  };

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

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        draggable: true,
        position: latLng
      });

      var infoWindow = new google.maps.InfoWindow();

      infoWindow.open($scope.map, marker);

      google.maps.event.addDomListener(infoWindow, 'click', function(){
        console.log('this worked');
      });

      google.maps.event.addListener(marker, 'click', function(){
        infoWindow.open($scope.map, marker);
      });

    vm.setInfoWindow = function(){
      infoWindow.setContent("<div id='iw_container'>" + "<div class='iw_title'>" + "fetch delivery location" + "</div>" + "<div style='margin:1em'>" +
      "<a id='location' ng-click='openModal()' style='color:#7FDBD4; font-weight: bold; font-size:1.5em'>" +  $scope.address + "</a>" + "</div>" + "</div>");

      google.maps.event.addDomListener(infoWindow, 'domready', function(){
        document.getElementById('location').addEventListener('click', function(){
          vm.openModal();
        });
      });
    };

    google.maps.event.addListener(marker, 'dragend', function() {
      $scope.$apply(function(){
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
              vm.setInfoWindow();
            });
          }
        });
      });
    });

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
  });

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
    console.log('Could not get location');
  });

  vm.postNewFetch = postNewFetch;

  function postNewFetch(fetchObj){
    FetchService.postNewFetch(fetchObj).then(function(response){
      $ionicHistory.clearCache();
      vm.closeModal();
      $location.path('/tab/home');
    });
  }
}

function AvailableFetches($scope, AvailableFetchesService, ClaimableFetchService, FetchService, $ionicPopup, $timeout, $location, $state, $cordovaGeolocation, $compile, $ionicLoading){
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

  var socket = io.connect('https://mysterious-waters-23406.herokuapp.com');

  socket.on('connect', function (socket) {
    // console.log('connection');
  });

  socket.on('update', function(newFetch){
    vm.fetches.push(newFetch);
    $scope.$apply();
  });

  $scope.toggleItem = function(fetch) {
    if ($scope.isItemShown(fetch)) {
      $scope.shownItem = null;
    } else {
      $scope.shownItem = fetch;
    }
  };

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
      } else {
        console.log('You are not sure');
      }
    });
  };

  $scope.isItemShown = function(fetch) {
    return $scope.shownItem === fetch;
  };

  vm.initialize = initialize;

  function initialize() {
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

      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
        var fetchData = $scope.AvailableFetches.fetches;

        var newFetchArray = [];
          socket.on('update', function(newFetch){
            newFetchArray.push(newFetch);
            loadMarkers(newFetchArray);
            emptyNewFetchArray(newFetchArray);
          });

        function emptyNewFetchArray(newFetchArray){
          newFetchArray.pop();
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
      infoWindow.setContent(compile[0]);

      infoWindow.open($scope.map, marker);

      vm.showButtonConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
          scope: $scope,
          title: item,
          template: 'Are you sure you want to claim this fetch?'
        });

        confirmPopup.then(function(res) {
          if(res) {
            addClaimFetch();
           } else {
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
      $scope.hide($ionicLoading);
      $state.go('tab.home');
      vm.loggedStatus = true;
    });
  }

  function signup(user) {
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

function UserProfileCtrl($scope, $location, $state, Fetches, UserHistoryService, UserInformation){
  var vm = this;
  vm.signout = signout;

  function signout() {
    localStorage.setItem('Authorization', null);
    $location.path('/signin');
    vm.loggedStatus = false;
  }

  vm.userName = UserInformation.all()
  .then(function(data){
    vm.userNameDetails = data.data[0].email;
  });

  vm.fetches = [];
  vm.claimedFetches = [];

  var socket = io.connect('https://mysterious-waters-23406.herokuapp.com');
  socket.on('connect', function (socket) {
    //
  });

  socket.on('update', function(newFetch){
    vm.fetches.push(newFetch);
    $scope.$apply();
  });

  vm.fetch = UserHistoryService.getHistory()
  .then(function(fetchArr){
    vm.fetches = fetchArr.data;
  });

  vm.claimedFetch = Fetches.all()
  .then(function(fetchArr){
    vm.claimedFetches = fetchArr.data;
  });

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

var styleArray = [
  {
    'featureType': 'administrative',
    'elementType': 'all',
    'stylers': [
      { 'visibility': 'on' },
      { 'lightness': 33 }
    ]
  },
  {
    'featureType': 'landscape',
    'elementType': 'all',
    'stylers': [ { 'color': '#f2e5d4' } ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [ { 'color': '#c5dac6' } ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels',
    'stylers': [
      { 'visibility': 'on' },
      { 'lightness': 20 }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'all',
    'stylers': [ { 'lightness': 20 } ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [ { 'color': '#c5c6c6' } ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'geometry',
    'stylers': [ { 'color': '#e4d7c6' } ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'geometry',
    'stylers': [ { 'color': '#fbfaf7' } ]
  },
  {
    'featureType': 'water',
    'elementType': 'all',
    'stylers': [
      { 'visibility': 'on' },
      { 'color': '#7fdbd4' }
    ]
  }
];
