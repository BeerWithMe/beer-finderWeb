angular.module('beerMeApp')
  .factory('searchResultsService',function($http){
  	var searchResultsService = {
  		getResults: function(beername, callback){
      // var loading = true;
      // console.log('scope.loading= ', loading)
			var data = JSON.stringify({beername: beername})
  			console.log('sending request to server for ...',data)
			$http({
		      method: 'POST',
		      url: '/searchBeer',
		      data: data
		    }).success(function(data,status){
		    	//the data looks like this: [{abv:,ibu:,name:,etc...},{abv:,ibu:,name:,etc...}]
		    	console.log('the data has been received',data)
          // loading = false;
          // console.log('scope.loading= ', loading)
		    	callback(data)
		    }).error(function(error,status){
          // loading = false; 
          // console.log('scope.loading= ', loading)
		    	console.log('error: ',error)
		    })
		}
  	}
  	return searchResultsService;
  })