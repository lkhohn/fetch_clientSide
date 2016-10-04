'use strict';

angular.module('starter.services')
	.service('AddUserService', ['$http', 'dbURL', AddUserService]);

function AddUserService($http, dbURL){
	return {
	  signup: function(user){
      return $http.post(dbURL.url + '/users/signup', user)
      .then(function(response){
        return response;
      }, function(error){
        return error;
      });
	  }
	};
}