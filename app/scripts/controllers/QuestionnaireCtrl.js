'use strict';

angular.module('beerMeApp')
  .controller('QuestionnaireCtrl', function ($scope, $routeParams, likeButton, Questionnaire) {
    $scope.like = function(id){
      likeButton.like($routeParams.beerid); 
    }  
    $scope.nextbeer = function(id){
      console.log('go to next beer')     
    };
})