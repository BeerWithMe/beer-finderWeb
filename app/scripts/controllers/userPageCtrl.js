'user strict';

angular.module('beerMeApp')
	.controller('userPageCtrl',function($scope, $stateParams, userPageService, $location, $window){

		$scope.userName = localStorage.getItem('userName');
		$scope.goToRecommendations = function(){
		  $location.path('/'+ localStorage.userName + '/recommendations');
		}
		userPageService.getLikesFromDatabase($stateParams.user, function(results) {
			console.log('the results are :',results)
			$scope.userLikes = results;
		})

	})