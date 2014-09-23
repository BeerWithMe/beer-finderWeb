'use strict';

/**
 * @ngdoc function
 * @name beerMeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the beerMeApp
 */
angular.module('beerMeApp')
  .controller('MainCtrl', function ($scope, AuthService) {
    $scope.credentials = {
      username: '',
      password: ''
    };
    $scope.login = function(credentials) {
      AuthService.login(credentials)
        
  }
  });
