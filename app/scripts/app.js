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
    'ui.bootstrap'
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
  // .config(function ($routeProvider) {
  //   $routeProvider
  //     .when('/', {
  //       templateUrl: 'views/main.html',
  //       controller: 'MainCtrl'
  //     })
  //     .when('/about', {
  //       templateUrl: 'views/about.html',
  //       controller: 'AboutCtrl'
  //     })
  //     .when('/recommendations', {
  //       templateUrl: 'views/recommendations.html',
  //       controller: 'RecommendCtrl'
  //     })
  //     .when('/beer/:beername', {
  //       templateUrl: 'views/oneBeer.html',
  //       controller: 'OneBeerController'
  //     })
  //     .when('/questionnaire', {
  //       templateUrl: 'views/questionnaire.html',
  //       controller: 'QuestionnaireCtrl'
  //     })
  //     .otherwise({
  //       redirectTo: '/'
  //     });
  // });
