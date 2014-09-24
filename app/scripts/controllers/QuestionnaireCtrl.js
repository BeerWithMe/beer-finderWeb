'use strict';

angular.module('beerMeApp')
  .controller('QuestionnaireCtrl', function ($scope, $routeParams, likeButton, Questionnaire, beerRequest) {
    
    $scope.beername;
    $scope.imgUrl;
    $scope.message;

    $scope.like = function(beername){
      likeButton.like($scope.beername); 
    }  
    // loads the next beer in the predetermined survey list
    $scope.nextbeer = function(){
      var response = Questionnaire.changeBeer()  
        $scope.beername = response.beername;
        $scope.imgUrl = response.imgUrl
        if (response.message !=  null) {
          $scope.message = response.message;
          }
    };
    // upon loading the page, immediately invoke nextbeer to load first beer
    $scope.nextbeer();
})