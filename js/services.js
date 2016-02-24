angular.module('app')
.service('ScoutService', ['$http', '$q', ScoutService]);

function ScoutService($http, $q){

  return {
    getScout:function(scout){
      return $q(function(resolve, reject){
        $http.post('http://localhost:3000/scout', scout)
        .then(function sucess(response){
          resolve(response);
        }, function error(response){
          console.error(response);
        });
      });
    },
    showAvailScouts: function(scout){
      return $q(function(resolve, reject){
        $http.get('http://localhost:3000/availScout', scout)
        .then(function success(response){
          resolve(response);
        }, function error(response){
          console.error(response);
        });
      });
    },
    getScoutDetails: function(id) {
      // console.log(id);
      return $http.get('http://localhost:3000/' + id);
    },
    postNewScout: function(scoutObj) {
      return $q(function(resolve, reject){
        $http.post('http://localhost:3000/new', scoutObj)
        .then(function success(response){
          resolve(response);
        }, function error(response){
          console.error(response);
        });
      });
    },
    deleteScout: function(id) {
      return $http.delete('http://localhost:3000/' + id);
    },
    editScout: function(id, editObj) {
      return $http.put('http://localhost:3000/' + id, editObj);
    }
  };
}


angular.module('app')
.service('addUserService', ['$http', '$q', addUserService]);

function addUserService($http, $q){
  return {
    addUser: function(user){
      return $q(function(resolve, reject){
        $http.post('http://localhost:3000/signup', user)
        .then(function success(response){
          resolve(response);
        }, function error(response){
          console.error(response);
        });
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
