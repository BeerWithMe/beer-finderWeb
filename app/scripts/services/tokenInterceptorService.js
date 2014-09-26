angular.module('beerMeApp')
  .factory('TokenInterceptor', function ($q, $window, $location, userService){
    var attach = {
      request: function(config){
        var jwt = localStorage.getItem('token');
        if (jwt) {
          config.headers['x-access-token'] = jwt;
        }
        confit.headers['Allow-Control-Allow-Origin'] = '*';
        return config;
      }
    };
    return attach;
  })
      // requestError: function(rejection){
      //   return $q.reject(rejection);
      // },
      // response: function(response){
      //   //we shouldn't ever need this top part, since we're using local storage instead.
      //   //would be needed if using session storage if the user refreshed the page
      //   // if (response != null && response.status == 200 && localStorage.token && localStorage.loggedIn === false) {
      //   //   localStorage.setItem('loggedIn', true);
      //   // }
      //   return response || $q.when(response);
      // }
      // //revokes client authentication if a 401 is received.  Not sure why we'd want to do this.
      // // responseError: function(rejection){
      // //   if (rejection != null && rejection.status === 401 && (localStorage.token || localStorage.loggedIn === true)){
      // //     delete localStorage.token;
      // //     localStorage.setItem('loggedIn', false);
      // //     $location.path('/home');
      // //   }
      //   return $q.reject(rejection);
      // }
 
