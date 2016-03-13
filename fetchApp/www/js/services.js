angular.module('starter.services', [])
.service('FetchService', ['$http', FetchService])
.service('SigninService', ['$http', SigninService])
.service('AddUserService', ['$http', AddUserService]);


function FetchService($http){
  return {
    // getFetch:function(fetch){
    //   return $http.post('http://localhost:3000/fetch', fetch)
    //     .then(function(response){
    //       console.log(response);
    //     }, function(error){
    //       console.log(error);
    //     });
    //   },
    // showAvailFetches: function(fetch){
    //     return $http.get('http://localhost:3000/availFetch', fetch)
    //     .then(function(response){
    //       console.log(response);
    //     }, function(error){
    //       console.log(error);
    //     });
    //   },
    // getFetchDetails: function(id) {
    //   // console.log(id);
    //   return $http.get('http://localhost:3000/' + id);
    // },
    postNewFetch: function(fetchObj) {
        return $http.post('http://localhost:3000/fetches', fetchObj)
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

function SigninService($http){
  return {
    signin: function(user){
        return $http.post('http://localhost:3000/users/signin', user)
        .then(function(response){
          return response;
        }, function(error){
          return error;
        });
    }
  };
}

function AddUserService($http){
  return {
    signup: function(user){
        return $http.post('http://localhost:3000/users/signup', user)
        .then(function(response){
          return response;
        }, function(error){
          return error;
        });
      }
    };
  }
