'use strict';

angular.module('starter.services')
  .service('RetrievingFetchContactInfo', ['$http', 'dbURL', RetrievingFetchContactInfo]);


function RetrievingFetchContactInfo($http, dbURL){
  return {
    all: function(user){
      return $http.get(dbURL.url + '/fetches/retrievingFetchContactInfo', user)
        .then(function(response){
          return response;
        }, function(error){
          return error;
        });
    }
  };
}