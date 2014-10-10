
//this is called when a user rates a beer, and makes the request to save their rating in the database

angular.module('beerMeApp')
  .factory('likeButton', function ($http){

    var like = function(beername, rating){
      var username = localStorage.userName;

      var data = JSON.stringify({
				username: username,
				beername: beername,
				rating: rating
			});

      $http({
          method: 'POST',
          url: '/like',
          data: data
        }).success(function(data, status){
        console.log('Rating saved', data)
        }).error(function(error, status){
        console.log('error: ', error)
        })
    }
    return {
      like: like
    }
  })