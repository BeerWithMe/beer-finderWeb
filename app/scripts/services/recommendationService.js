angular.module('beerMeApp')

  .factory('recommendationsRequest', function ($http, $rootScope, $state, $cookieStore){

    // initialize and configure a google map object
    var gMap = {};
    
    var initMap = function(map){
      map.center = {
        // Center of USA
        latitude: 39.702967436166105,
        longitude: -97.14059911250001
      }

      // Zoom that show the whole USA map
      map.zoom = 4;

      map.control = {};
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
          labelAnchor: '10 39',
          labelContent: i + 1,
          labelClass: 'labelMarker'
        }

        marker["id"] = i;
        marker.longitude = beers[i].longitude;
        marker.latitude = beers[i].latitude;
        marker.title = beers[i].name;
        marker.show = false;

        marker.onClick = function() {
                console.log("Clicked!");
                marker.show = !marker.show;
        };
        markers.push(marker);
      }

      return markers;
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

    var clicked = function(beername){
        // $rootScope.beer = beername;
        $cookieStore.put('beername', beername);
        console.log("This is cookiestore beer", $cookieStore.get('beername'))
        $state.go('beer');
    };

    return {
      gMap: gMap,
      getRecommendation: getRecommendation,
      clicked: clicked,
      makeMarkers: makeMarkers
    };
  });
