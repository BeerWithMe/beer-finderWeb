angular.module('beerMeApp')
  .factory('searchResultsService',function ($http){
  	var searchResultsService = {
  		getResults: function(beername, callback){
			var data = JSON.stringify({beername: beername})
			$http({
		      method: 'POST',
		      url: '/searchBeer',
		      data: data
		  }).success(function(data,status){
		    	callback(data)
		    }).error(function(error,status){
		    	console.log('error: ',error)
		    })
		  },
      pour: function() {
        jQuery(document).ready(function() {
          console.log('pouring');
          
          jQuery('.pour') 
            .delay(2000)
            .animate({
              height: '360px'
              }, 1500)
            .delay(1600)
            .slideUp(500);
          
          jQuery('#liquid') 
            .delay(3400)
            .animate({
              height: '200px'
            }, 2500);

          jQuery('.beer-foam') 
            .delay(3400)
            .animate({
              bottom: '200px'
            }, 2500);
        });
      }
      //modified from http://codepen.io/TimRuby/details/jcLia
  	}
  	return searchResultsService;
  })