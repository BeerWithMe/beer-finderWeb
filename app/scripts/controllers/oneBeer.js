'use strict';

angular.module('beerMeApp')

.factory('beerRequest', function($http){

	var getSingleBeer = function(beername, username){
		// console.log("Inside getSingleBeer: " beername);
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

.controller('OneBeerController', function ($scope, $rootScope, beerRequest, userPageService){

	console.log("$rootScope.beer in OneBeerController: ", $rootScope.beer)
	beerRequest.getSingleBeer($rootScope.beer, localStorage.userName)
		.success(function(data, status, headers, config) {
			$scope.beername = data.name;
			$scope.ibu = data.ibu;
			$scope.abv = data.abv;
			$scope.description = data.description;
			$scope.imgUrl = data.imgUrl;
			$scope.userRating = data.userRating
	  })
		.error(function(data, status, headers, config) {
			console.log('hi')
			$scope.beername = '';
  	});
  	console.log($scope.userRating)
})