'use strict';

angular.module('beerMeApp.oneBeer', [])

.controller('OneBeerController', function($scope, $routeParams, beerRequest){

	beerRequest.getSingleBeer($routeParams.beername)
		.success(function(data, status, headers, config) {
			$scope.beername = data.name;
			$scope.ibu = data.ibu;
			$scope.abv = data.abv;
			$scope.description = data.description;
			$scope.imgUrl = data.imgUrl;
		})
		.error(function(data, status, headers, config) {
			$scope.beername = '';
  		});
})