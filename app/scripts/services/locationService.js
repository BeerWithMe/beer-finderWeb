angular.module('beerMeApp')
  .factory('locationService', function (){

    var locationService = {
      setPosition: function(position) {
        localStorage.setItem('longitude', position.coords.longitude);
        localStorage.setItem('latitude', position.coords.latitude);
      },
      handleError: function(err) {
        if (err.code == 1) {
          //user said no, let it go
          console.log('user said no');
        }
      },
      getLocation: function(setPosition, handleError, expire) {
        if(Modernizr.geolocation) {
          navigator.geolocation.getCurrentPosition(setPosition, handleError, {maximumAge: expire});
        } else {
          //no native support
          console.log('download a newer browser!');
        }
      }
    }
    

    return locationService
  })