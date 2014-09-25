angular.module('beerMeApp')
  .controller('ratingCtrl', function ($scope, likeButton) {

    $scope.rate;
    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.setRating = function() {
      console.log($scope.rate);
      likeButton.like($scope.$parent.beername, $scope.rate);
    };

    $scope.ratingStates = [
      {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    ];
  });