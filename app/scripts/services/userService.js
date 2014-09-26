angular.module('beerMeApp')
  .factory('userService', function ($http, $window, $location){

    var userService = {
    	setUserName: function(name){
    		localStorage.setItem('userName', name); //async, be careful
    		localStorage.setItem('loggedIn', true); //async, be careful
        localStorage.setItem('token', data.token);
    	},
      logout: function(name){
        localStorage.setItem('userName', null);
        localStorage.setItem('loggedIn', false);
        delete localStorage.token;
        $location.path('/home');
      }
    }
    return userService
  })