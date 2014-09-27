'user strict';

angular.module('beerMeApp')
	.controller('searchResults',function($scope,searchResultsService,$stateParams){
		//This function grabs the search term from the url, and sends a post request to
		// the server and gets back an array of beers, which the view then
		// iterates over and  displays
		searchResultsService.getResults($stateParams.searchTerm, function(results){
			$scope.beerResults = results.slice(0,3);
		});

	})