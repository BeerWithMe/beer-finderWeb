angular.module('beerMeApp')
  .factory('userPageService', function ($q, $window, $location, $http){
    
    var profilePage = {
      getLikesFromDatabase: function(userName,callback){
      	// var data = JSON.stringify({username: userName});
      	return $http({
      		method: 'GET',
      		url: '/' + userName + '/showLikes'
      	}).success(function(data) {
      		callback(data);
      	}).error(function(error) {
      		console.log('Error :',error)
      	})
      }
    };

    return profilePage;
  })