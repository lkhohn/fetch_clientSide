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
    }
  };
}