angular.module('app')
.service('AddUserService', ['$http', AddUserService])
.service('SigninService', ['$http', SigninService])
.service('FetchService', ['$http', FetchService])


.service("AuthInterceptor", function($location, $q) {
  return {
    request: function(config) {
      // prevent browser bar tampering for /api routes
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      var token = localStorage.getItem("Authorization");
      console.log(token);
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



// .service('NavService', ['$http', NavService])
// function NavService(){
//   this.name=""
  //   vm.name = userService.name;
  //   $scope.$watch(angular.bind(userService, function(){
  //     return this.name;
  //   }), function(newVal){
  //     vm.name=newVal;
  //   }
  // )
// }


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
