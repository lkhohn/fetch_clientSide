angular.module('starter.services', [])
.service('dbURL', [dbURL])
.service('FetchService', ['$http', 'dbURL', FetchService])
.service('SigninService', ['$http', 'dbURL', SigninService])
.service('AddUserService', ['$http', 'dbURL', AddUserService])
.service('UserInformation', ['$http', 'dbURL', UserInformation])

.service('RetrievingFetchContactInfo', ['$http', 'dbURL', RetrievingFetchContactInfo])
.service("AuthInterceptor", function($location, $q) {
  return {
    request: function(config) {
      // prevent browser bar tampering for /api routes
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      var token = localStorage.getItem("Authorization");
      if (token)
        config.headers.Authorization = token;
      return $q.resolve(config);
    },
    responseError: function(err) {
      // if you mess around with the token, log them out and destroy it
      if (err.data === "invalid token" || err.data === "invalid signature" || err.data === "jwt malformed") {
        $location.path("/signin");
        return $q.reject(err);
      }
      // if you try to access a user who is not yourself
      if (err.status === 401) {
        $location.path('/signin');
        return $q.reject(err);
      }
      return $q.reject(err);
    }
  };
})

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
        // console.log(fetchObj);
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
}])

// returns all fetches regardless of current user
  .service('AvailableFetchesService', ['$http', 'dbURL', function($http, dbURL) {
    return {
      all : function(fetch) {
        // withCredentials:true
        return $http.get(dbURL.url + '/availableFetches', fetch)
        .then(function(fetchObj) {
          console.log(fetchObj);
          return fetchObj;
        }, function(response) {
          console.log(response);
        });
        }
      };
    }]);

// heroku db connection
function dbURL() {
  return {
    url: "https://mysterious-waters-23406.herokuapp.com"
  };
}

// current user can claim and close fetches, post fetches
function FetchService($http, dbURL){
  return {
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
      console.log(fetchObj)
      return $http.post(dbURL.url + '/fetches/delete/', fetchObj)
      .then(function(response){
        console.log(response);
      }, function(error){
        console.log(error);
      });
    }
  };
}

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

function AddUserService($http, dbURL){
  return {
    signup: function(user){
      console.log(user)
        return $http.post(dbURL.url + '/users/signup', user)
        .then(function(response){
          console.log(response)
          return response;
        }, function(error){
          return error;
        });
      }
    };
  }

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

 function RetrievingFetchContactInfo($http, dbURL){
   return {
     all: function(user){
       return $http.get(dbURL.url + '/fetches/retrievingFetchContactInfo', user)
       .then(function(response){
        //  console.log(response);
         return response;
       }, function(error){
         return error;
       });
     }
   };
 }
