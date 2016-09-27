'use strict';

angular.module('starter.controllers')
  .controller('HomeCtrl', ['$scope', '$ionicPopup', '$timeout', '$location', '$ionicModal', '$ionicHistory', 'Fetches', 'FetchService', 'UserHistoryService', 'UserInformation', 'RetrievingFetchContactInfo', 'dbURL', HomeCtrl]);



function HomeCtrl($scope, $ionicPopup, $timeout, $location, $ionicModal, $ionicHistory, Fetches, FetchService, UserHistoryService, UserInformation, RetrievingFetchContactInfo, dbURL){
  var vm = this;

  vm.fetch = Fetches.all()
  .then(function(fetchArr){
    vm.fetches = fetchArr.data;
    var data = fetchArr.data;
    tossedFetches(data);
    tossedToBeClosed(data);

  });

  //show user claimed fetches

  vm.userInformation = RetrievingFetchContactInfo.all()
  .then(function(userDataArr){
    // console.log(userDataArr.data);
    vm.userClaimedFetches = userDataArr.data;
    var data = userDataArr.data;
    retrievedFetches(data);
  });



// direction/map for fetches user is retrieving
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


  // display fetch history
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
    // console.log(data);
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



  var socket = io.connect(dbURL.url);
  // console.log(socket);
  socket.on('connect', function (socket) {
    // console.log('connection');
  });
  socket.on('claimOrClose', function(newFetch){
    // console.log(newFetch);
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



// close button to update dateClosed
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
       }
      else {
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
     console.log(updateItem);
    if(updateItem.item !== null){
      $scope.shownItem.item = updateItem.item;
    } else if(updateItem.paymenAmount !== null){
      $scope.shownItem.paymentAmount = updateItem.paymentAmount;
    } else if(updateItem.address !== null) {
      $scope.shownItem.address = updateItem.address;
    }

     var updateFetch = $scope.shownItem;
      FetchService.updateFetch(updateFetch).then(function(data){
        $ionicHistory.clearCache();
        vm.closeModal();

      });
    }


     vm.showDeleteConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
          title: $scope.shownItem.item,
          template: "are you sure you want to delete?" + "<br />" + "<br />" + "no one will be able to retrieve it!" + "<br />"
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