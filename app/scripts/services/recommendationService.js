angular.module('beerMeApp')
  .factory('recommendationsRequest', function ($http, $rootScope, $state, $cookieStore){
    var recommendationsRequest = {
      getRecommendation: function(username){
        var userLat = localStorage.getItem('latitude');
        var userLong = localStorage.getItem('longitude');
        console.log('user lat, long in rec service ', userLat , userLong);
        var data = JSON.stringify({
          username: username,
          latitude: userLat,
          longitude: userLong
        });
        return $http({
          method: 'POST',
          url: '/' + username + '/recommendations',
          data: data
        });
      },

      clicked: function(beername){
        // $rootScope.beer = beername;
        $cookieStore.put('beername', beername);
        console.log("This is cookiestore beer", $cookieStore.get('beername'))
        $state.go('beer');
      }
    }

    return recommendationsRequest;
  });
