angular.module('app')
.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/landingPage.html',
    controller: 'LandingPageController as LPC'
  })
  .when('/new', {
    templateUrl: 'views/addScout.html',
    controller: 'NewScoutController as NSC'
  })
  .when('/signup', {
    templateUrl: 'views/signup.html',
    controller: 'SignupController as SUC'
  })
  .when('/signin', {
    templateUrl: 'views/signin.html',
    controller: 'SigninController as SIC'
  })
  .when('/scout', {
    templateUrl: 'views/avaiableScouts.html',
    controller: 'AvailableScoutController as ASC'
  });
});
