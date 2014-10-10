angular.module('beerMeApp')

.directive('filter', function(){
  return {
    restrict: 'E',
    templateUrl: '../views/filterDirective.html'
  }
})