'use strict';

//this initiates the call to the server to generate recommendations, and receives the response array

angular.module('beerMeApp')
  .controller('RecommendCtrl', function ($filter, $rootScope, $scope, $state, $stateParams, $window, recommendationsRequest) {
    
    $scope.recommendationsList = [];

    $scope.userName = localStorage.getItem('userName');

    recommendationsRequest.getRecommendation($scope.userName)
    	.success(function(data, status, headers, config){
    		  $scope.recommendationsList = data.beers;
          $scope.totalItems = data.length;
          $scope.itemsPerPage = 7;
          $scope.currentPage = 1;
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
    })
    

    $scope.clicked = recommendationsRequest.clicked; 

    $scope.map = recommendationsRequest.gMap;

    var beers = [
        {
            longitude: -122.40867880000002,
            latitude: 37.7835565
        },
        {
            longitude: -122.40867880000002,
            latitude: 40.7835565
        }
    ]
    $scope.MarkersWithLabel = recommendationsRequest.makeMarkers(beers);
    console.log($scope.MarkersWithLabel);
});
