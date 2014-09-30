'use strict';

angular.module('beerMeApp')
  .controller('MainCtrl', function ($scope, $http, $location, $state, userService) {

    $scope.login = function(userName, passWord){
      // create JSON object that will become req.body
    	var data = JSON.stringify({username: userName, password: passWord})
      // login function sends post request to server to authenticate user. Paths user to recommendations view
      // if authenticated, othewrise alerts('wrong username or pass')
    	userService.login(userName,data);
    }

    $scope.signup = function(userName, passWord){
      // create JSON object that will become req.body
    	var data = JSON.stringify({username: userName, password: passWord})
      // signup function sends post request to server to check if user exists, and then create new account
      // if username is unique. Paths user to questionnaire view.
      userService.signup(userName,data);
    }
    
    $scope.logout = userService.logout;
  });
