'use strict';

/**
 * @ngdoc function
 * @name beerMeApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the beerMeApp
 */
angular.module('beerMeApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
