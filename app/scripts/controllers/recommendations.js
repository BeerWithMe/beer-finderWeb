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

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
          $scope.map.control.refresh({latitude: position.coords.latitude, longitude: position.coords.longitude});
          $scope.map.zoom = 11;
        });
    }

    // $scope.secondMap.control.refresh({latitude: 32.779680, longitude: -79.935493});   
    var beers = [
        {
            name: 'budlight created by boss bo',
            longitude: -122.40867880000002,
            latitude: 37.7835565
        },
        {
            name: 'rocket',
            longitude: -122.40867880000002,
            latitude: 40.7835565
        },
        {
            name: 'shark',
            longitude: -122.40867880000002,
            latitude: 40.5634343
        }
    ]
    $scope.MarkersWithLabel = recommendationsRequest.makeMarkers(beers);

});
