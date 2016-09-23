angular.module('starter.services', [])
.service('dbURL', [dbURL])
.service('AuthInterceptor', ['$location', '$q', AuthInterceptor])
.service('SigninService', ['$http', 'dbURL', SigninService])
.service('AddUserService', ['$http', 'dbURL', AddUserService])
.service('UserInformation', ['$http', 'dbURL', UserInformation])
.service('UserHistoryService', ['$http', 'dbURL', UserHistoryService])
.service('RetrievingFetchContactInfo', ['$http', 'dbURL', RetrievingFetchContactInfo])
.service('Fetches', ['$http', 'dbURL', Fetches])
.service('ClaimableFetchService', ['$http', 'dbURL', ClaimableFetchService])
.service('AvailableFetchesService', ['$http', 'dbURL', AvailableFetchesService])
.service('FetchService', ['$http', 'dbURL', FetchService]);

function dbURL() {
  return {
    url: 'https://mysterious-waters-23406.herokuapp.com'
  };
}

function AuthInterceptor($location, $q) {
  return {
    request: function(config) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      var token = localStorage.getItem('Authorization');
      if (token) {
        config.headers.Authorization = token;
        return $q.resolve(config);
      }
    },

    responseError: function(err) {
      if (err.data === 'invalid token' || err.data === 'invalid signature' || err.data === 'jwt malformed') {
        $location.path('/signin');
        return $q.reject(err);
      }
      else if (err.status === 401) {
        $location.path('/signin');
        return $q.reject(err);
      }

      return $q.reject(err);
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
      return $http.post(dbURL.url + '/users/signup', user)
      .then(function(response){
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

function UserHistoryService($http, dbURL) {
  return {
    getHistory: function(user) {
      return $http.get(dbURL.url + '/fetches/userHistory', user)
      .then(function(data){
        return data;
      }, function(response) {
        console.error(new Error(response));
      });
    }
  };
}

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

function Fetches($http, dbURL){
  return {
    all : function() {
      return $http.get(dbURL.url + '/fetches/', fetch)
      .then(function(fetchObj) {
        return fetchObj;
      }, function(response) {
        console.error(new Error(response));
      });
    }
  };
}

function ClaimableFetchService($http, dbURL) {
  return {
    all : function(fetch) {
      return $http.get(dbURL.url + '/fetches/claimableFetches', fetch)
      .then(function(fetchObj){
        return fetchObj;
      }, function(response){
        console.error(new Error(response));
      });
    }
  };
}

function AvailableFetchesService($http, dbURL) {
  return {
    all : function(fetch) {
      return $http.get(dbURL.url + '/availableFetches', fetch)
      .then(function(fetchObj) {
        return fetchObj;
      }, function(response) {
        console.error(new Error(response));
      });
    }
  };
}

function FetchService($http, dbURL){
  return {
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
