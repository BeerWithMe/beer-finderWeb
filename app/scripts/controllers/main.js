'use strict';

/**
 * @ngdoc function
 * @name beerMeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the beerMeApp
 */
angular.module('beerMeApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
