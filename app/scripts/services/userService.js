angular.module('beerMeApp')
  .factory('userService', function ($http,$window){

    var userService = {
    	setUserName: function(name){
    		localStorage.setItem('userName',name); //async, be careful
    		localStorage.setItem('loggedIn',true); //async, be careful
    	}
    }
    return userService
  })