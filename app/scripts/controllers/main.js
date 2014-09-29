'use strict';

/**
 * @ngdoc function
 * @name beerMeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the beerMeApp
 */
angular.module('beerMeApp')
  .controller('MainCtrl', function ($scope, $http, $location, $state, userService) {
    $scope.login = function(userName, passWord){
      console.log('inside login func')
    	var data = JSON.stringify({username: userName, password: passWord})
    	userService.login(userName,data);
    }
    $scope.signup = function(userName, passWord){
    	var data = JSON.stringify({username: userName, password: passWord})
      userService.signup(userName,data);
    }
    $scope.logout = userService.logout;
  });
