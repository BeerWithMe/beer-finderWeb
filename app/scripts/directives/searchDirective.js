angular.module('beerMeApp')

.directive('search', function($location){
  return {
    restrict: 'E',
    templateUrl: '../views/searchDirective.html',
    link: function(scope){
      scope.submitSearch = function(searchTerms){
        console.log('in function')
        $location.path('/searchResults/' + scope.searchTerms);
      };
    }
  }
})
  
      