angular.module('app')
.directive('navbar', ['$http', navbar]);

function navbar ($http) {
  return {
    templateUrl: '../views/navbar.html'
  };
}


// angular.module('app')
// .directive('navbar', ['$http', navbar]);
//
// function navbar ($http) {
//   return {
//     scope: {
//       username: '=username'
//     }
//     templateUrl: '../views/navbar.html',
        // controller: 'navController as NC'
//   };
// }
//
// in the narbar.html, this is when you can show just the user name and remove the signin/signup slots
// probably try this through a service
