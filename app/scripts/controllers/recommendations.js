'use strict';

//this initiates the call to the server to generate recommendations, and receives the response array

angular.module('beerMeApp')
  .controller('RecommendCtrl', function ($rootScope, $scope, $state, $stateParams, $window, recommendationsRequest) {
    
    $scope.recommendationsList = [];

    $scope.userName = localStorage.getItem('userName');

    recommendationsRequest.getRecommendation($scope.userName)
    	.success(function(data, status, headers, config){
    		 $scope.recommendationsList = data.beers;
    	});

    $scope.clicked = recommendationsRequest.clicked; 
  });
