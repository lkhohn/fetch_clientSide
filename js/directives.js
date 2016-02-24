angular.module('app')
.directive('navBar', ['$http', navBar]);

function navBar ($http) {
  return {
    templateUrl: '../views/navbar.html'
  };
}
