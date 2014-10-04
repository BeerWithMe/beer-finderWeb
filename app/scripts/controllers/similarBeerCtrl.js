'user strict';

angular.module('beerMeApp')
	.controller('similarBeers',function ($scope, similarBeerService, $stateParams, recommendationsRequest){

    $scope.similarBeers = similarBeerService.getSimilarBeers();
    $scope.sortofSimilarBeers = similarBeerService.getSortofSimilarBeers();
    $scope.beerResults = $scope.similarBeers.concat($scope.sortofSimilarBeers);
    
    $scope.clicked = recommendationsRequest.clicked;
	})