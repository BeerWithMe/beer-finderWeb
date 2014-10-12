angular.module('beerMeApp')

  .factory('recommendationsRequest', function ($http, $rootScope, $state, $cookieStore){

    // initialize and configure a google map object
    var gMap = {};
    

    // var userLat = localStorage.getItem('latitude');
    // var userLong = localStorage.getItem('longitude');

    // if(userLat === 'undefined' || userLong === 'undefined'){
      // If user's current location is undefined, default to Center of USA
    var userLat = 39.702967436166105;
    var userLong = -97.14059911250001;
    // }

    var initMap = function(map){

      map.center = {
        // If user's current location is undefined, default to Center of USA
        latitude: userLat,
        longitude: userLong
      }

      map.zoom = 3;

      map.control = {};
    };

    initMap(gMap);

    var sortBeersByDistance = function(beers){

      for(var i = 0; i < beers.length; i++){
        for(var j = 0; j < beers[i].locations.length; j++){
          var R = 6371; // km
          var beerLong = beers[i].locations[j]._data.data.longitude;
          var beerLat = beers[i].locations[j]._data.data.latitude;

          var userLatInRadians = userLat * Math.PI / 180;
          var beerLatInRadians = beerLat* Math.PI / 180;

          var latDiff = (userLat - beerLat)* Math.PI / 180;
          var longDiff = (userLong - beerLong)* Math.PI / 180;

          var a = Math.abs(Math.sin(latDiff/2) * Math.sin(latDiff/2) +
                  Math.cos(userLat) * Math.cos(beerLat) *
                  Math.sin(longDiff/2) * Math.sin(longDiff/2));

          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          var d = R * c;

          if(beers[i].distance === undefined || beers[i].distance > d){
            beers[i].distance = d;
            beers[i].latitude = beerLat;
            beers[i].longitude = beerLong;
          }
        }
      }

      beers.sort(function(a, b){return a.distance - b.distance});
    };

    var makeMarkers = function(beers){
      console.log(beers);
      var markers = [];
      var id = 0;
      for(var i = beers.length - 1; i >= 0; i--){
        for(var j = 0; j < beers[i].locations.length; j++){
          var marker = {};

          marker.options = {
            labelAnchor: '10 39',
            labelContent: beers[i].Beer.label,
            labelClass: 'labelMarker',
            cursor: 'auto'
          }

          marker["id"] = id++;
          marker.longitude = beers[i].locations[j]._data.data.longitude;
          marker.latitude = beers[i].locations[j]._data.data.latitude;
          marker.title = beers[i].Beer.name;
          marker.show = false;

          marker.onClick = function() {
            console.log("Clicked!", marker.options.labelContent);
            marker.show = !marker.show;
          };

          markers.push(marker);
        }
      }

      return markers;
    };

    var  getRecommendation = function(username){
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
      makeMarkers: makeMarkers,
      sortBeersByDistance: sortBeersByDistance
    };
  });
