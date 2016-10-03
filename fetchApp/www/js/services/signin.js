'use strict';

angular.module('starter.services')
	.service('SigninService', ['$http', 'dbURL', SigninService]);

function SigninService($http, dbURL){
  return {
    signin: function(user){
        return $http.post(dbURL.url + '/users/signin', user)
        .then(function(response){
          return response;
        }, function(error){
          return error;
        });
    }
  };
}