angular.module('starter.services', [])

.service('dbURL', [dbURL])

.service('FetchService', ['$http', 'dbURL', FetchService])
.service('SigninService', ['$http', 'dbURL', SigninService])
.service('AddUserService', ['$http', 'dbURL', AddUserService])

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


  .service('AvailableFetchesService', ['$http', 'dbURL', function($http, dbURL) {
    return {
      all : function(fetch) {
        return $http.get(dbURL.url + '/availableFetches', fetch)
        .then(function(fetchObj) {
          // console.log(fetchObj);
          return fetchObj;
        }, function(response) {
          console.log(response);
        });
      }
      };
    }]);


function dbURL() {
  return {
    url: "https://mysterious-waters-23406.herokuapp.com"
  };
}

function FetchService($http, dbURL){
  return {
    getFetch:function(user){
      console.log(user);
      return $http.post(dbURL.url + '/fetches/', user)
        .then(function(response){
          console.log(response);
        }, function(error){
          console.log(error);
        });
      },
    // showAvailFetches: function(fetch){
    //     return $http.get('http://localhost:3000/fetches/', fetch)
    //     .then(function(response){
    //       console.log(response);
    //       return response;
    //     }, function(error){
    //       console.log(error);
    //     });
    //   },
    // getFetchDetails: function(id) {
    //   console.log(id);
    //   return $http.get('http://localhost:3000/' + id)
    //   .then(function(response){
    //     console.log(response);
    //   }, function(error){
    //     console.log(error);
    //   });
    // },
    postNewFetch: function(fetchObj) {
      console.log(fetchObj);
        return $http.post(dbURL.url + '/fetches', fetchObj)
        .then(function(response){
          console.log(response);
        }, function(error){
          console.log(error);
        });
    }
    // ,
    // deleteFetch: function(id) {
    //   return $http.delete('http://localhost:3000/' + id);
    // },
    // editFetch: function(id, editObj) {
    //   return $http.put('http://localhost:3000/' + id, editObj);
    // }
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
        return $http.post(dbURL.url + '/users/signup', user)
        .then(function(response){
          return response;
        }, function(error){
          return error;
        });
      }
    };
  }
