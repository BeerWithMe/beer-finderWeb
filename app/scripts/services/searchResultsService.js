angular.module('beerMeApp')
  .factory('searchResultsService',function(){
  	var searchResultsService = {
  		beerResults: []
  	}
  	return searchResultsService;
  })