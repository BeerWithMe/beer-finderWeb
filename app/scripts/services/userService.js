angular.module('beerMeApp')
  .factory('userService', function ($http){

    var userService = {
    	userName: null,
    	loggedIn: false,
    	setUserName: function(name){
    		this.userName = name;
    		this.loggedIn = true;
    	}
    }
    return userService
  })