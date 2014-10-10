'use strict';

angular.module('beerMeApp')
  .controller('RecommendCtrl', function ($rootScope, $scope, $state, $stateParams, $window, recommendationsRequest) {
    
    $scope.recommendationsList = [];

    $scope.userName = localStorage.getItem('userName');
    console.log('the current username is ',$scope.userName);

    recommendationsRequest.getRecommendation($scope.userName)
    	.success(function(data, status, headers, config){
    		 $scope.recommendationsList = data.beers;
    	})
    console.log("This is recommendationList: ", $scope.recommendationsList);

    $scope.clicked = recommendationsRequest.clicked; 
  });
