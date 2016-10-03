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
}])

//  returns all fetches for the specific user
.service('Fetches', ['$http', 'dbURL', function($http, dbURL) {
  return {
    all : function() {
      return $http.get(dbURL.url + '/fetches/', fetch)
      .then(function(fetchObj) {
        return fetchObj;
      }, function(response) {
        console.error(new Error(response));
      });
    }
    // this.remove = function(fetch) {
    //   fetchObj.splice(fetchObj.indexOf(fetch), 1);
    // };
    };
  }])

.service('ClaimableFetchService', ['$http', 'dbURL', function($http, dbURL){
  return {
    all : function(fetch) {
      return $http.get(dbURL.url + '/fetches/claimableFetches', fetch)
      .then(function(fetchObj){
        // console.log(fetchObj);
        return fetchObj;
      }, function(response){
        console.log(response);
      });
    }
  };
}]);







 



