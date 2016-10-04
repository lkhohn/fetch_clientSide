'use strict';

angular.module('starter.services')
	.service('UserInformation', ['$http', 'dbURL', UserInformation]);

function UserInformation($http, dbURL){
  return {

    all: function(user){
      return $http.get(dbURL.url + '/fetches/userInformation', user)
      .then(function(response){
        return response;
      }, function(error){
        return error;
      });
    },

    //  returns all fetches for the specific user
    allFetches: function() {
      return $http.get(dbURL.url + '/fetches/', fetch)
      .then(function(fetchObj) {
        return fetchObj;
      }, function(response) {
        console.error(new Error(response));
      });
    },

    getHistory: function(user) {
      // console.log(user);
      return $http.get(dbURL.url + '/fetches/userHistory', user)
      .then(function(data){
        return data;
      }, function(response) {
        console.log(response);
      });
    }
    
    // this.remove = function(fetch) {
    //   fetchObj.splice(fetchObj.indexOf(fetch), 1);
    // };
  };
}