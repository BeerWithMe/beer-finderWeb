'use strict';

angular.module('beerMeApp')
  .controller('QuestionnaireCtrl', function ($scope, $routeParams, likeButton, Questionnaire,$location) {

    // loads the next beer in the predetermined survey list
    $scope.nextbeer = function(){
      var response = Questionnaire.changeBeer() 

        $scope.beername = response.beername;
        $scope.imgUrl = response.imgUrl
        if (response.message !=  null) {
          $scope.message = response.message;
        }
    };
    $scope.goToRecommendations = function(){
      $location.path('/'+ localStorage.userName + '/recommendations');
    }
    //makes initial beer list available for ng-repeat in html
    this.questionnaire = Questionnaire

    // immediately invoke nextbeer to load first beer
    $scope.nextbeer();
  })