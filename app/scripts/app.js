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
    'beerMeApp.oneBeer',
    'beerMeApp.services'
  ])
  .config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/main.html'
      })
      .state('home.list', {
        url: '/list',
        templateUrl: 'views/main-nestedList.html',
        controller: 'MainCtrl'
      })
      .state('home.paragraph', {
        url: '/paragraph',
        template: 'I could sure use a drink right now.'
      })
      .state('recommendations', {
        url: '/recommendations',
        templateUrl: 'views/recommendations.html',
        controller: 'RecommendCtrl'
      })
      .state('/questionnaire', {
        url: '/questionnaire',
        templateUrl: 'views/questionnaire.html',
        controller: 'QuestionnaireCtrl'
      })
      .state('beer', {
        url: '/beer',
        templateUrl: 'views/oneBeer.html',
        controller: 'OneBeerController'
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
