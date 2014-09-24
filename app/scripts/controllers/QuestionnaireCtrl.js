'use strict';

angular.module('beerMeApp')
  .controller('QuestionnaireCtrl', function ($scope, $routeParams, likeButton, Questionnaire, beerRequest) {
    // beerRequest.getSingleBeer($routeParams.beername)
    // .success(function(data, status, headers, config) {
    //   $scope.beername = data.name;
    //   $scope.imgUrl = data.imgUrl;
    // })
    $scope.beername;
    $scope.imgUrl;
    $scope.message;

    $scope.like = function(beername){
      likeButton.like($routeParams.beername); 
    }  
    $scope.nextbeer = function(){
      var response = Questionnaire.changeBeer()  
        $scope.beername = response.beername;
        $scope.imgUrl = response.imgUrl
        if (response.message !=  null) {
          $scope.message = response.message;
          }
    };
})