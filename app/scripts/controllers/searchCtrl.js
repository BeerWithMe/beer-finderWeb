'user strict';

angular.module('beerMeApp')
	.controller('searchCtrl',function($scope,$http,searchResultsService,$location){
		$scope.submitSearch = function(beerName){
			$location.path('/searchResults/'+beerName);
		}
	})