angular.module('beerMeApp')
  .factory('recommendationsRequest', function ($http, $rootScope, $state, $cookieStore){
    var recommendationsRequest = {
      getRecommendation: function(username){
        return $http({
          method: 'GET',
          url: '/' + username + '/recommendations'
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
