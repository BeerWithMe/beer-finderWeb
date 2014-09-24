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
    'ngSanitize',
    'ngTouch',
    // 'ui.bootstrap',
    'beerMeApp.oneBeer',
    'beerMeApp.services'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/recommendations', {
        templateUrl: 'views/recommendations.html',
        controller: 'RecommendCtrl'
      })
      .when('/beer/:beername', {
        templateUrl: 'views/oneBeer.html',
        controller: 'OneBeerController'
      })
      .when('/questionnaire', {
        templateUrl: 'views/questionnaire.html',
        controller: 'QuestionnaireCtrl',
        controllerAs: 'questCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
