angular.module('beerMeApp')
  .factory('similarBeerService', function ($http, $state, $location){
    console.log('loaded similarBeerService')
    var similarBeers;
    var sortofSimilarBeers;
    var similarBeerServ = {
      getAllTheBeers: function(IBU,ABV,DESCRIPTION){
      	console.log('Inside getAllTheBeers in similarBeerService')
      	console.log('sending post request for ',IBU,ABV,DESCRIPTION)
      	var params = {
      		ibu: IBU,
      		abv: ABV,
      		description: DESCRIPTION
      	}

      	$http({
      		method: 'POST',
      		url: '/getSimilarBeers',
      		data: JSON.stringify(params)
      	}).success(function(data){
      		similarBeers = data.similarBeers;
      		sortofSimilarBeers = data.sortofSimilarBeers;
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



