'user strict';

angular.module('beerMeApp')
	.controller('similarBeers',function ($scope, similarBeerService, $stateParams, recommendationsRequest){

    $scope.similarBeers = similarBeerService.getSimilarBeers();
    $scope.sortofSimilarBeers = similarBeerService.getSortofSimilarBeers();
    $scope.beerResults = $scope.similarBeers.concat($scope.sortofSimilarBeers);

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