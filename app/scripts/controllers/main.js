'use strict';

/**
 * @ngdoc function
 * @name beerMeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the beerMeApp
 */
angular.module('beerMeApp')
  .controller('MainCtrl', function ($scope,$http) {
    $scope.login = function(userName, passWord){
    	var data = JSON.stringify({username: userName, password: passWord})
    	$http({
          method: 'POST',
          url: '/login',
          data: data
        }).success(function(data,status){
        	console.log('success: ',data)
        }).error(function(error,status){
        	console.log('error: ',error)
        })
    }
    $scope.signup = function(userName){
    	alert('sign up!'+userName)
    }
    $scope.dogs = ['Bulldog','Golden Retriever','Corgi']
  });
