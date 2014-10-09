angular.module('beerMeApp')
  .factory('similarBeerService', function ($http, $state, $location){
    console.log('loaded similarBeerService')
    var similarBeers;
    var sortofSimilarBeers;
    var similarBeerServ = {
      getAllTheBeers: function(IBU,ABV,DESCRIPTION){
        var userLat = localStorage.getItem('latitude');
        var userLong = localStorage.getItem('longitude');
      	console.log('Inside getAllTheBeers in similarBeerService')
      	console.log('sending post request for ',IBU,ABV,DESCRIPTION)
      	var params = {
      		ibu: IBU,
      		abv: ABV,
      		description: DESCRIPTION,
          latitude: userLat,
          longitude: userLong
      	}

      	$http({
      		method: 'POST',
      		url: '/getSimilarBeers',
      		data: JSON.stringify(params)
      	}).success(function(data){
          var calcDistance = function(userlat, userlong, beerlat, beerlong){
            var R = 3960; //radius of earth in miles
            var a = 0.5 - Math.cos((beerlat - userlat) * Math.PI / 180)/2 + Math.cos(userlat * Math.PI / 180) * Math.cos(beerlat * Math.PI / 180) * 
     (1 - Math.cos((beerlong - userlong) * Math.PI / 180))/2;

          return R * 2 * Math.asin(Math.sqrt(a)); 
          };

      		similarBeers = data.similarBeers;
      		sortofSimilarBeers = data.sortofSimilarBeers;
          //get distance from user
          for (var i = 0; i < similarBeers.length; i++) {
            similarBeers[i].distance = calcDistance(userLat, userLong, similarBeers[i].latitude, similarBeers[i].longitude);
          }
          for (var i = 0; i < sortofSimilarBeers.length; i++) {
            sortofSimilarBeers[i].distance = calcDistance(userLat, userLong, sortofSimilarBeers[i].latitude, sortofSimilarBeers[i].longitude);
          }
          console.log('distance added? ', sortofSimilarBeers)
      		$location.path('/similarBeers');
        })
      },
      getSimilarBeers: function(){
      	return similarBeers;
      },
      getSortofSimilarBeers: function(){
      	return sortofSimilarBeers;
      }


      // clicked: function(beername){
      //   $rootScope.beer = beername;
      //   console.log("This is $rootScope.beer", $rootScope.beer)
      //   $state.go('beer');
      // }
    }

    return similarBeerServ;
  });



