'use strict';

/**
 * @ngdoc function
 * @name beerMeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the beerMeApp
 */
angular.module('beerMeApp')
  .controller('MainCtrl', function ($scope,$http,$location,userService) {
    console.log(userService.loggedIn)
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
          } else {
            // If user's password is correct, set username in userservice
            userService.setUserName(userName);
            console.log(localStorage.userName);
          }
          console.log(data)
        	$location.path('/'+localStorage.userName + data)
          // $location.path(data);
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
        userService.setUserName(userName);
        $location.path(data)
        }
      }).error(function(error,status){
        console.log('signup Error: ',error)
      })
    }
  });
