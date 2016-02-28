angular.module('app')
.service('FetchService', ['$http', '$q', FetchService]);

function FetchService($http, $q){

  return {
    getFetch:function(fetch){
      return $q(function(resolve, reject){
        $http.post('http://localhost:3000/fetch', fetch)
        .then(function sucess(response){
          resolve(response);
        }, function error(response){
          console.error(response);
        });
      });
    },
    showAvailFetches: function(fetch){
      return $q(function(resolve, reject){
        $http.get('http://localhost:3000/availFetch', fetch)
        .then(function success(response){
          resolve(response);
        }, function error(response){
          console.error(response);
        });
      });
    },
    getFetchDetails: function(id) {
      // console.log(id);
      return $http.get('http://localhost:3000/' + id);
    },
    postNewFetch: function(fetchObj) {
      return $q(function(resolve, reject){
        $http.post('http://localhost:3000/new', fetchObj)
        .then(function success(response){
          resolve(response);
        }, function error(response){
          console.error(response);
        });
      });
    },
    deleteFetch: function(id) {
      return $http.delete('http://localhost:3000/' + id);
    },
    editFetch: function(id, editObj) {
      return $http.put('http://localhost:3000/' + id, editObj);
    }
  };
}


angular.module('app')
.service('addUserService', ['$http', addUserService]);

function addUserService($http){
  return {
    addUser: function(user){
        $http.post('http://localhost:3000/signup', user)
        .then(function(response){
          return response;
        }, function(error){
          return error;
        });
      }
    };
  }





angular.module('app')
.service('signinService', ['$http', '$q', signinService]);
function signinService($http, $q){
  return {
    signin: function(user){
      return $q(function(resolve, reject){
        $http.post('http://localhost:3000/signin', user)
        .then(function success(response){
          resolve(response);
        }, function error(response){
          console.log('service errors');
          console.error(response);
        });
      });
    }
  };
}
