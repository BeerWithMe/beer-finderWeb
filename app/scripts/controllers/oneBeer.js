'use strict';

angular.module('beerMeApp')

.factory('beerRequest', function($http){

	var getSingleBeer = function(beername){
		// console.log("Inside getSingleBeer: " beername);
		return $http({
			method: 'POST',
			url: '/beer',
			data: JSON.stringify({beername: beername})
		});
	}

	return {
		getSingleBeer: getSingleBeer
	}
})

.controller('OneBeerController', function($scope, $rootScope, beerRequest){

	console.log("$rootScope.beer in OneBeerController: ", $rootScope.beer)
	beerRequest.getSingleBeer($rootScope.beer)
		.success(function(data, status, headers, config) {
			$scope.beername = data.name;
			$scope.ibu = data.ibu;
			$scope.abv = data.abv;
			$scope.description = data.description;
			$scope.imgUrl = data.imgUrl;
		})
		.error(function(data, status, headers, config) {
			console.log('hi')
			$scope.beername = '';
  		});
})