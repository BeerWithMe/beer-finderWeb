'use strict';

angular.module('beerMeApp')

.factory('beerRequest', function($http, similarBeerService, $location){

	var getSingleBeer = function(beername, username){
		// console.log("Inside getSingleBeer: " beername);
		return $http({
			method: 'POST',
			url: '/beer',
			data: JSON.stringify({beername: beername, username: username})
		});
	}
	

	return {
		getSingleBeer: getSingleBeer,
	}
})

.controller('OneBeerController', function ($scope, $cookieStore, beerRequest, userPageService, similarBeerService, searchResultsService){

	$scope.loading = false;

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
			console.log('hi')
			$scope.beername = '';
  		});

    $scope.getAllBeers = function() {
    	$cookieStore.put('image', $scope.iconUrl);
      searchResultsService.pour();
    	$scope.loading = true; 
    	similarBeerService.getAllTheBeers($scope.ibu, $scope.abv, $scope.description); 
    }
  	
})