'use strict';

angular.module('beerMeApp')
  .controller('RecommendCtrl', function ($scope,userService,$window) {
  	console.log('inside rec',localStorage.getItem('userName'))
    $scope.userName = localStorage.getItem('userName')
  });