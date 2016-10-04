'use strict';

angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'starter.services', 'starter.factories', 'ngMessages', 'ngCordova'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    var push = new Ionic.Push({
         "debug": true
       });

       push.register(function(token) {
         console.log("Device token:",token.token);
       });

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

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

    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

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

  $urlRouterProvider.otherwise('/landingPage');
  $httpProvider.interceptors.push("AuthInterceptor");

});
