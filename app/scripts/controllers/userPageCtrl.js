'user strict';

angular.module('beerMeApp')
	.controller('userPageCtrl',function($scope, $stateParams, userPageService, $location, $window){

		$scope.userName = localStorage.getItem('userName');

		userPageService.getLikesFromDatabase($stateParams.user, function(results) {
			console.log('the results are :',results)
			$scope.userLikes = results;
		})

	})