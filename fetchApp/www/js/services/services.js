'use strict';

angular.module('starter.services', [])


// returns all fetches that the current user has claimed
.service('UserHistoryService', ['$http', 'dbURL', function($http, dbURL){
  return {
    getHistory: function(user) {
      // console.log(user);
      return $http.get(dbURL.url + '/fetches/userHistory', user)
      .then(function(data){
        return data;
      }, function(response) {
        console.log(response);
      });
    }
  };
}]);






 



