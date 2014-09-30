angular.module('beerMeApp')
  .factory('likeButton', function ($http){
  	var username = localStorage.userName;

    var like = function(beername, rating){
      console.log(beername, rating, username);

      var data = JSON.stringify(
			{
				username: username,
				beername: beername,
				rating: rating
			}
      	);
      $http({
          method: 'POST',
          url: '/like',
          data: data
        }).success(function(data,status){
        console.log('You like it! When you can log in, that will matter! ',data)
        }).error(function(error,status){
        console.log('error: ',error)
        })
    }
    return {
      like: like
    }
  })