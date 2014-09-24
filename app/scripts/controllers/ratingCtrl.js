angular.module('beerMeApp')
  .controller('ratingCtrl', function ($scope) {

    $scope.rate = 0;
    $scope.max = 5;
    $scope.isReadonly = false;

    console.log($scope.rate)

  // $scope.hoveringOver = function(value) {
  //   $scope.overStar = value;
  //   $scope.percent = 100 * (value / $scope.max);
  // };

    $scope.ratingStates = [
      {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    ];
  });