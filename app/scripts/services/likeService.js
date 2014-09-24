angular.module('beerMeApp')
  .factory('likeButton', function ($http){

    var like = function(beerid){
      return $http.get('/like/'+beerid);
    }
    return {
      like: like
    }
  })