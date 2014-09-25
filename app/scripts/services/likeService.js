angular.module('beerMeApp')
  .factory('likeButton', function ($http){

    var like = function(beername, rating){
      console.log(beername, rating)
      var data = JSON.stringify({rating: rating})
      $http({
          method: 'GET',
          url: '/like/' + beername,
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