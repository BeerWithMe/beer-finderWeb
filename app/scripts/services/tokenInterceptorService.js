
//intercepts http requests and attaches headers to be checked by authentication middleware

angular.module('beerMeApp')
  .factory('TokenInterceptor', function ($location, $q, $window){
    var attach = {
      request: function(config){
        var jwt = localStorage.getItem('token');
        var expires = localStorage.getItem('expire')
        if (jwt) { 
          config.headers['x-access-token'] = jwt;
          config.headers['x-username'] = localStorage.getItem('userName');
          config.headers['x-expires'] = expires; 
        }
        return config;
      }
    };
    return attach;
  })
