angular.module('beerMeApp')
  .factory('userService', function ($window, $location){

    var userService = {
    	setUserName: function(name, token){
        console.log('token in setusername', token)
    		localStorage.setItem('userName', name); //async, be careful
    		localStorage.setItem('loggedIn', true); //async, be careful
        localStorage.setItem('token', token);
    	},
      logout: function(){
        console.log('loggingout')
        localStorage.setItem('userName', null);
        localStorage.setItem('loggedIn', false);
        delete localStorage.token;
        $location.path('/home');
      }
    }
    return userService
  })