'use strict';

/**
 * @ngdoc overview
 * @name beerMeApp
 * @description
 * # beerMeApp
 *
 * Main module of the application.
 */
angular
  .module('beerMeApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'elif'
    // 'beerMeApp.oneBeer',
    // 'beerMeApp.recommendations'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider){
    $httpProvider.interceptors.push('TokenInterceptor');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('recommendations', {
        url: '/:user/recommendations',
        templateUrl: 'views/recommendations.html',
        controller: 'RecommendCtrl'
      })
      .state('questionnaire', {
        url: '/questionnaire',
        templateUrl: 'views/questionnaire.html',
        controller: 'QuestionnaireCtrl',
        controllerAs: 'questCtrl'
      })
      .state('beer', {
        url: '/beer',
        templateUrl: 'views/oneBeer.html',
        controller: 'OneBeerController'
      })
      .state('showSearchResults', {
        url: '/searchResults/:searchTerm',
        templateUrl: 'views/searchResults.html',
        controller: 'searchResults'
      })
      .state('userPage', {
        url:'/userPage/:user',
        templateUrl: 'views/userPage.html',
        controller: 'userPageCtrl'
      });

    $urlRouterProvider.otherwise('/home');
  })
  .run(function ($rootScope, $location, userService) {
    // $rootScope.$on('$locationChangeStart', function(event, nextRoute, currentRoute){
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute){
      if (nextRoute !== '/home' && localStorage.loggedIn === "false") {
        $location.path('/home');
      }
    })
  });
