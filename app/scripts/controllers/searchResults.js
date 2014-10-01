'user strict';

angular.module('beerMeApp')
	.controller('searchResults',function($scope,searchResultsService,$stateParams){

    $scope.pour = function() {
      jQuery(document).ready(function() {

      console.log('pouring');
      console.log('loading = ', $scope.loading)
      jQuery('.pour') //Pour Me Another Drink, Bartender!
        .delay(2000)
        .animate({
          height: '360px'
          }, 1500)
        .delay(1600)
        .slideUp(500);
      
      jQuery('#liquid') // I Said Fill 'Er Up!
        .delay(3400)
        .animate({
          height: '170px'
        }, 2500);
      
      jQuery('.beer-foam') // Keep that Foam Rollin' Toward the Top! Yahooo!
        .delay(3400)
        .animate({
          bottom: '200px'
          }, 2500);
      });
    };

    $scope.loading = true;
    $scope.pour();
		// This function grabs the search term from the url, and sends a post request to
		// the server and gets back an array of beers, which the view then
		// iterates over and  displays
		searchResultsService.getResults($stateParams.searchTerm, function(results){
			$scope.beerResults = results;
      $scope.loading = false; 
		});
	})