'use strict';

angular.module('beerMeApp')
	.controller('similarBeers',function ($scope, $cookieStore, $stateParams, similarBeerService, recommendationsRequest){

    $scope.similarBeers = similarBeerService.getSimilarBeers();
    if ($scope.similarBeers && $scope.similarBeers.length > 0) {
      localStorage.setItem('similarBeers', JSON.stringify($scope.similarBeers));
    }
    $scope.sortofSimilarBeers = similarBeerService.getSortofSimilarBeers();
    if ($scope.sortofSimilarBeers && $scope.sortofSimilarBeers.length > 0) {
      localStorage.setItem('sortofSimilarBeers', JSON.stringify($scope.sortofSimilarBeers));
    }
    
    if ($scope.similarBeers && $scope.sortofSimilarBeers) {
      $scope.beerResults = $scope.similarBeers.concat($scope.sortofSimilarBeers);
    } else if ($scope.similarBeers && !$scope.sortofSimilarBeers){
      $scope.beerResults = $scope.similarBeerService
    } else if (!$scope.similarBeers && $scope.sortofSimilarBeers) {
      $scope.beerResults = $scope.sortofSimilarBeers
    } else {
      var simBeers = localStorage.getItem('similarBeers') || '[]';
      var parsedSimBeers = JSON.parse(simBeers);
      var sortaSimBeers = localStorage.getItem('sortofSimilarBeers') || '[]';
      var parsedSorta = JSON.parse(sortaSimBeers);
      $scope.beerResults = parsedSimBeers.concat(parsedSorta);
    }
    
    $scope.originalBeer = $cookieStore.get('beername');
    $scope.iconUrl = $cookieStore.get('image'); 

    $scope.totalItems = $scope.beerResults.length; 
    $scope.itemsPerPage = 7;
    $scope.currentPage = 1;
    $scope.pageCount = function () {
      return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };
    $scope.$watch('currentPage + itemsPerPage', function() {
      var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
      var end = begin + $scope.itemsPerPage;

      $scope.filteredbeerResults = $scope.beerResults.slice(begin, end);
    })
    
    $scope.clicked = recommendationsRequest.clicked;
	})