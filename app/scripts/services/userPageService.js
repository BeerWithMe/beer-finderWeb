angular.module('beerMeApp')
  .factory('userPageService', function ($http, $location, $q, $window){
    
    var profilePage = {
      getLikesFromDatabase: function(userName, callback){
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