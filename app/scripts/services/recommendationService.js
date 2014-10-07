angular.module('beerMeApp')

  .factory('recommendationsRequest', function ($http, $rootScope, $state, $cookieStore){

    // initialize and configure a google map object
    var gMap = {};
    
    var initMap = function(map){
      map.center = {
        // Hack Reactor
        latitude: 37.7835565,
        longitude: -122.40867880000002 
      }

      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
          console.log("position: ", position);
          map.center = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      }

      map.zoom = 11;
    };

    initMap(gMap);

    var makeMarkers = function(beers){
      // angular.forEach(places, function(place){
      //   places.options = {
      //     title: places.name
      //   };
      // });
      // return places;
      var markers = [];
      for(var i = 0; i < beers.length; i++){
        var marker = {};
        marker.options = {
          labelContent: i,
          labelClass: 'labelMarker'
        }

        marker.id = i;
        marker.longitude = beers.longitude;
        marker.latitude = beers.latitude;

        markers.push(marker);
      }

    };

    var  getRecommendation: function(username){
        var userLat = localStorage.getItem('latitude');
        var userLong = localStorage.getItem('longitude');
        console.log('user lat, long in rec service ', userLat , userLong);
        var data = JSON.stringify({
          username: username,
          latitude: userLat,
          longitude: userLong
        });
        return $http({
          method: 'POST',
          url: '/' + username + '/recommendations',
          data: data
        });
    };

    var clicked: function(beername){
        // $rootScope.beer = beername;
        $cookieStore.put('beername', beername);
        console.log("This is cookiestore beer", $cookieStore.get('beername'))
        $state.go('beer');
    };

    return {
      gMap: gMap,
      getRecommendation: getRecommendation,
      clicked: clicked,
      makeMarker: makeMarker
    };
  });
