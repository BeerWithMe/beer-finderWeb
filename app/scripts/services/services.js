'use strict';

angular.module('beerMeApp.services', [])

.factory('beerRequest', function($http){

	var getSingleBeer = function(beername){
		return $http({
			method: 'GET',
			url: '/beer/' + beername,
		});
	}

	return {
		getSingleBeer: getSingleBeer
	}
})