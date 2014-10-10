'use strict';

angular.module('beerMeApp')
  .factory('beerRequest', function($http, similarBeerService, $location){

  	var getSingleBeer = function(beername, username){
  		return $http({
  			method: 'POST',
  			url: '/beer',
  			data: JSON.stringify({beername: beername, username: username})
  		});
  	}
  	return {
  		getSingleBeer: getSingleBeer
  	}
  })

  .controller('OneBeerController', function ($cookieStore, $scope, beerRequest, userPageService, searchResultsService, similarBeerService){
    
    //$scope.loading controls whether loading animation shows
  	$scope.loading = false;
    
    //gets beername from cookie store, sends that and user to server to get beer data and user's rating
  	beerRequest.getSingleBeer($cookieStore.get('beername'), localStorage.userName)
  		.success(function(data, status, headers, config) {
  			$scope.beername = data.name;
  			$scope.ibu = data.ibu;
  			$scope.abv = data.abv;
  			$scope.description = data.description;
  			$scope.imgUrl = data.imgUrl;
        $scope.iconUrl = data.iconUrl;
  			$scope.userRating = data.userRating
  	  })
  		.error(function(data, status, headers, config) {
  			console.log('error')
  			$scope.beername = '';
    	});
      
      //called if 'get similar beers' is clicked, saving icon image of original beer to display in results
      $scope.getAllBeers = function() {
      	$cookieStore.put('image', $scope.iconUrl);
        searchResultsService.pour();  //this is loading animation
      	$scope.loading = true; 
      	similarBeerService.getAllTheBeers($scope.ibu, $scope.abv, $scope.description); 
      }	
  })