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
    	$http({
          method: 'POST',
          url: '/login',
          data: data
        }).success(function(data,status){
          if(data === 'Wrong password' || data === 'sorry no such user'){
            alert('Wrong username or password');
            $state.go('home');
          } else {
            // If user's password is correct, set username in userservice
            userService.setUserName(userName);
            console.log(localStorage.userName);
            var jwttoken = data.token;
            console.log('token in scope.signup', jwttoken)
            var tokenExpire = data.expires
            console.log('expire in scope.signup', tokenExpire)
            userService.setUserName(userName, jwttoken, tokenExpire);
           $location.path('/'+localStorage.userName + data)          }
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
        var jwttoken = data.token;
        console.log('token in scope.signup', jwttoken)
        var tokenExpire = data.expires
        console.log('expire in scope.signup', tokenExpire)
        userService.setUserName(userName, jwttoken, tokenExpire);
        $state.go('questionnaire');
        }
      }).error(function(error,status){
        console.log('signup Error: ',error)
      })
    }
    $scope.logout = userService.logout;
  });
