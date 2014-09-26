'use strict';

// fake data for testing
var recomList = [ {beer: {
					name: "A",
					ibu: 5,
					abv: 3,
				  	description: "A is originated from CA",
				  	iconUrl: 'https://s3.amazonaws.com/brewerydbapi/beer/1P45iR/upload_upBR4q-large.png',
				  	brewery: "A's brewery"
				  },
				  recommendation: 5},
				  {beer: {
				  	name: "B",
				  	ibu: 4,
				  	abv: 3,
				  	description: "B is popular back in 1990",
				  	iconUrl: 'https://s3.amazonaws.com/brewerydbapi/beer/o1OELJ/upload_OutGJZ-large.png',
				  	brewery: "B's brewery"
				  },
				  recommendation: 4}
];

angular.module('beerMeApp.recommendations', [])

.factory('recommendationsRequest', function($http){
	var getRecommendatoin = function(username){
		return "Something";
	}

	return {
		getRecommendatoin: getRecommendatoin
	}
})

.controller('RecommendCtrl', function ($scope, recommendationsRequest) {
    $scope.recommendationsList = [];

    $scope.userName = 'Your Username';

    $scope.recommendationsList = recomList;
});
