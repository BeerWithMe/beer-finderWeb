'use strict';

/**
 * @ngdoc function
 * @name beerMeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the beerMeApp
 */
angular.module('beerMeApp')
  .controller('MainCtrl', function ($scope,$http,$location) {
    $scope.login = function(userName, passWord){
      console.log('inside login func')
    	var data = JSON.stringify({username: userName, password: passWord})
    	$http({
          method: 'POST',
          url: '/login',
          data: data
        }).success(function(data,status){
          if(data === 'Wrong password' || data === 'sorry no such user'){
            alert('Wrong username or password');
          }

        	$location.path(data)
        }).error(function(error,status){
        	console.log('error: ',error)
        })
    }
    $scope.signup = function(userName, passWord){
    	var data = JSON.stringify({username: userName, password: passWord})
      $http({
        method: 'POST',
        url: '/signup',
        data: data
      }).success(function(data,status){
        if(data === 'Username already taken'){
          alert(data);
        } else {
        console.log('User created!');  
        $location.path(data)
        }
      }).error(function(error,status){
        console.log('signup Error: ',error)
      })
    }
  });
