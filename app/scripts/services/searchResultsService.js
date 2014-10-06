angular.module('beerMeApp')
  .factory('searchResultsService',function($http){
  	var searchResultsService = {
  		getResults: function(beername, callback){
			var data = JSON.stringify({beername: beername})
  			console.log('sending request to server for ...',data)
			$http({
		      method: 'POST',
		      url: '/searchBeer',
		      data: data
		  }).success(function(data,status){
		    	console.log('the data has been received',data)
		    	callback(data)
		    }).error(function(error,status){
		    	console.log('error: ',error)
		    })
		  },
      pour: function() {
        jQuery(document).ready(function() {
          console.log('pouring');
          
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
              height: '200px'
            }, 2500);

          jQuery('.beer-foam') // Keep that Foam Rollin' Toward the Top! Yahooo!
            .delay(3400)
            .animate({
              bottom: '200px'
            }, 2500);
        });
      }
  	}
  	return searchResultsService;
  })