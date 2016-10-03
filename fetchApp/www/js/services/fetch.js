'use strict';

angular.module('starter.services')
	.service('FetchService', ['$http', 'dbURL', FetchService]);


function FetchService($http, dbURL){
  return {
    all : function(fetch) {
      // returns all fetches regardless of current user
      // withCredentials:true
      return $http.get(dbURL.url + '/availableFetches', fetch)
      .then(function(fetchObj) {
        console.log(fetchObj);
        return fetchObj;
      }, function(response) {
        console.log(response);
      });
    },
    // getFetch isn't used
    getFetch:function(user){
      console.log(user);
      return $http.post(dbURL.url + '/fetches/', user)
        .then(function(response){
          console.log(response);
        }, function(error){
          console.log(error);
        });
      },

    claimFetch: function(fetch){
      return $http.put(dbURL.url + '/fetches/claim/', fetch)
        .then(function(response){
          console.log(response);
        }, function(error){
          console.log(error);
        });
    },

    closeFetch: function(fetch){
      return $http.put(dbURL.url + '/fetches/close/', fetch)
      .then(function(response){
        console.log(response);
      }, function(error){
        console.log(error);
      });
    },

    postNewFetch: function(fetchObj) {
      // console.log(fetchObj);
        return $http.post(dbURL.url + '/fetches', fetchObj)
        .then(function(response){
          console.log(response);
        }, function(error){
          console.log(error);
        });
    },

    updateFetch: function(fetchObj) {
      return $http.put(dbURL.url + '/fetches/update/', fetchObj)
      .then(function(response){
        console.log(response);
      }, function(error){
        console.log(error);
      });
    },

    deleteFetch: function(fetchObj) {
      return $http.post(dbURL.url + '/fetches/delete/', fetchObj)
      .then(function(response){
        console.log(response);
      }, function(error){
        console.log(error);
      });
    }
  };
}