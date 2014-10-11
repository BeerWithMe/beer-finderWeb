'use strict';

//this initiates the call to the server to generate recommendations, and receives the response array

angular.module('beerMeApp')
  .controller('RecommendCtrl', function ($filter, $rootScope, $scope, $state, $stateParams, $window, recommendationsRequest) {
    
    $scope.recommendationsList = [];

    $scope.userName = localStorage.getItem('userName');

    recommendationsRequest.getRecommendation($scope.userName)
    	.success(function(data, status, headers, config){
            recommendationsRequest.sortBeersByDistance(data.beers);
             $scope.recommendationsList = data.beers;
                $scope.totalItems = data.length;
                $scope.itemsPerPage = 7;
                $scope.currentPage = 1;
             for(var i = 0; i < data.beers.length; i++){
                data.beers[i].Beer.label = i + 1;
             }

        $scope.MarkersWithLabel = recommendationsRequest.makeMarkers(data.beers);
    });
     
    //controls pagination and filtering
    $scope.pageCount = function () {
      return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    $scope.$watch(function() {
      return [$scope.currentPage, $scope.itemsPerPage, $scope.filter].join('-');
    }, function() {
      var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
      var end = begin + $scope.itemsPerPage;
      var prefilteredBeers = $filter('filter')($scope.recommendationsList, $scope.filter);
      $scope.totalItems = prefilteredBeers.length;
      $scope.filteredbeerResults = prefilteredBeers.slice(begin, end);
      console.log($scope.filteredbeerResults)
    })
    
    $scope.clicked = recommendationsRequest.clicked; 

    $scope.map = recommendationsRequest.gMap;

});
