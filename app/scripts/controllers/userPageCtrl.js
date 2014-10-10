'use strict';

//controls the user's home page

angular.module('beerMeApp')
	.controller('userPageCtrl',function ($location, $scope, $stateParams, $window, locationService, recommendationsRequest, userPageService){

		$scope.userName = localStorage.getItem('userName');

		$scope.goToRecommendations = function(){
		  $location.path('/'+ localStorage.userName + '/recommendations');
		};

		userPageService.getLikesFromDatabase($stateParams.user, function(results) {
			$scope.userLikes = results;
		});
    
    //user asked for permission to get their location on page load.  Location rechecked if it exists
    //but is more than two minutes old
		locationService.getLocation(locationService.setPosition, locationService.handleError, 120000);
    
    //goes to single beer view
		$scope.clicked = recommendationsRequest.clicked;

	})