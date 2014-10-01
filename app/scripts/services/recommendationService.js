angular.module('beerMeApp')
  .factory('recommendationsRequest', function ($http, $rootScope, $state){
    var recommendationsRequest = {
      getRecommendation: function(username){
        return $http({
          method: 'GET',
          url: '/' + username + '/recommendations'
        });
      },

      clicked: function(beername){
        $rootScope.beer = beername;
        console.log("This is $rootScope.beer", $rootScope.beer)
        $state.go('beer');
      }
    }

    return recommendationsRequest;
  });
