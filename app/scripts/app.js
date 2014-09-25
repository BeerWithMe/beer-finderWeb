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
    // 'ui.bootstrap', commented this out for now, because it's bugging
    'beerMeApp.oneBeer',
    'beerMeApp.services'
  ])
  .config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('recommendations', {
        url: '/recommendations',
        templateUrl: 'views/recommendations.html',
        controller: 'RecommendCtrl'
      })
      .state('/questionnaire', {
        url: '/questionnaire',
        templateUrl: 'views/questionnaire.html',
        controller: 'QuestionnaireCtrl',
        controllerAs: 'questCtrl'
      })
      .state('beer', {
        url: '/beer/:beername',
        templateUrl: 'views/oneBeer.html',
        controller: 'OneBeerController'
      })
      // .state("otherwise", {
      //   url: "*path",
      //   templateUrl: "views/error-not-found.html"
      // });

      // .otherwise({
      //   redirectTo: '/'
      // });
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
