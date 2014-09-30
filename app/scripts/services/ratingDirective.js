angular.module('beerMeApp')

.directive('yourRating', function(likeButton){

	return {
		restrict: 'E',
		templateUrl: '../views/ratingDirective.html',
		scope : {
			beerToBeRated: '='
		},
		link: function(scope){
			scope.yourRate = 0;
			scope.submitRate = function(){
				likeButton.like(this.beerToBeRated, scope.yourRate);
			};
		}
	}	
});