angular.module('beerMeApp')
  .factory('userService', function ($window, $location, $http, $state){

    var userService = {
    	setUserName: function(name, token, expire){
        console.log('token in setusername', token)
        console.log('expire in setusername', expire)
    		localStorage.setItem('userName', name); //async, be careful
    		localStorage.setItem('loggedIn', true); //async, be careful
        localStorage.setItem('token', token);
        localStorage.setItem('expire', expire);
    	},
      logout: function(){
        console.log('loggingout')
        localStorage.setItem('userName', null);
        localStorage.setItem('loggedIn', false);
        delete localStorage.token;
        $location.path('/home');
      },
      login: function(userName,data){
            $http({
              method: 'POST',
              url: '/login',
              data: data
            }).success(function(data,status){
              if(data === 'Wrong password' || data === 'sorry no such user'){
                alert('Wrong username or password');
                $state.go('home');
              } else {
                // If user's password is correct, set username in userservice
                var jwttoken = data.token;
                console.log('token in scope.signin', jwttoken)
                var tokenExpire = data.expires;
                console.log('expire in scope.signin', tokenExpire)
                userService.setUserName(userName, jwttoken, tokenExpire);
               $location.path('/userPage/'+ localStorage.userName);
              }          
            }).error(function(error,status){
                console.log('error: ',error)
            })
      },
      signup: function(userName,data){
        $http({
          method: 'POST',
          url: '/signup',
          data: data
        }).success(function(data,status){
          if(data === 'Username already taken'){
            alert(data);
          } else {
          console.log('User created!');
          var jwttoken = data.token;
          console.log('token in scope.signup', jwttoken)
          var tokenExpire = data.expires
          console.log('expire in scope.signup', tokenExpire)
          userService.setUserName(userName, jwttoken, tokenExpire);
          $state.go('questionnaire');
          }
        }).error(function(error,status){
          console.log('signup Error: ',error)
        })
      },
      goHome: function(username) {
        $location.path('/userPage/'+ localStorage.userName);
      }
    }
    return userService
  })