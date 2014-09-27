'user strict';

angular.module('beerMeApp')
	.controller('searchCtrl',function($scope,$http,searchResultsService,$location){
		// $scope.submitSearch = function(beerName){
		// 	// send searchValue to server, where server will generate results and send them
		// 	// back as JSON, then we save the results into the resultsSerivce and 
		// 	// reroute the client to /results
		// 	var data = JSON.stringify({beername: beerName})
		// 	$http({
		//       method: 'POST',
		//       url: '/searchBeer',
		//       data: data
		//     }).success(function(data,status){
		//     	///////////////////////////////////////////
		//     	//save the results into the resultsService
		//     	//path the client to /results view
		//     	///////////////////////////////////////////
		//     	searchResultsService.beerResults = data;
		//     	console.log(searchResultsService.beerResults)
		//     	$location.path('/searchResults');
		//     }).error(function(error,status){
		//     	console.log('error: ',error)
		//     })
		// }
		//searchResults will look like this: [{abv:,ibu:,name:,etc...},{abv:,ibu:,name:,etc...}]
		// $scope.searchResults = searchResultsService.beerResults;
		$scope.submitSearch = function(beerName){
			$location.path('/searchResults/'+beerName);
		}
	})