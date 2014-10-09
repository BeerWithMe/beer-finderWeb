'user strict';

angular.module('beerMeApp')
	.controller('searchResults',function ($filter, $scope, searchResultsService, $stateParams, recommendationsRequest){

    $scope.loading = true;
    $scope.beerResults = [];
    searchResultsService.pour();

		// This function grabs the search term from the url, and sends a post request to
		// the server and gets back an array of beers, which the view then
		// iterates over and  displays
		searchResultsService.getResults($stateParams.searchTerm, function(results){
			$scope.beerResults = results;
      console.log($scope.beerResults);
      $scope.loading = false; 
      $scope.totalItems = results.length;
      $scope.itemsPerPage = 7;
      $scope.currentPage = 1;
      console.log('at end of function')
		});

    console.log('results = ' ,$scope.beerResults)

    $scope.pageCount = function () {
      return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    $scope.$watch(function() {
      return [$scope.currentPage, $scope.itemsPerPage, $scope.filter].join('-');
    }, function() {
      var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
      var end = begin + $scope.itemsPerPage;
      var prefilteredBeers = $filter('filter')($scope.beerResults, $scope.filter);
      $scope.totalItems = prefilteredBeers.length;
      $scope.filteredbeerResults = prefilteredBeers.slice(begin, end);
    })

    $scope.clicked = recommendationsRequest.clicked; 
	})