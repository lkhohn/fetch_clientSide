// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'starter.services', 'ngMessages', 'ngCordova'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    var push = new Ionic.Push({
      'debug': true
    });

    push.register(function(token) {
      console.log('Device token:',token.token);
    });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('landingPage', {
    url: '/landingPage',
    templateUrl: 'templates/landingPage.html',
    controller: 'AccountCtrl as Account'
  })

  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'AccountCtrl as Account'
  })

  .state('signup', {
     url: '/signup',
     templateUrl: 'templates/signup.html',
     controller: 'AccountCtrl as Account'
  })

  .state('findFetch', {
    url: '/findFetch',
    templateUrl: 'templates/findFetch.html',
    controller: 'LandingPageCtrl as LandingPageFindFetch'
  })

  .state('availableFetches', {
    url: '/availableFetches',
    templateUrl: 'templates/availableFetches.html',
    controller: 'AvailableFetches as AvailableFetches'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    cache: false,
    views: {
      'home': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl as Home'
      }
    }
  })

  .state('tab.addFetch', {
    url: '/addFetch',
    chache:false,
    views: {
      'addFetch': {
        templateUrl: 'templates/addFetch.html',
        controller: 'AddFetchCtrl as AddFetch'
      }
    }
  })

  .state('tab.findFetch', {
    url: '/findFetch',
    views: {
      'findFetch': {
        templateUrl: 'templates/availableFetches.html',
        controller: 'AvailableFetches as AvailableFetches'
      }
    }
  })

  .state('tab.signout', {
    url: '/signout',
    views: {
      'signout': {
        templateUrl: 'templates/signout.html',
        controller: 'UserProfileCtrl as UserProfileCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/landingPage');
  $httpProvider.interceptors.push('AuthInterceptor');
});
