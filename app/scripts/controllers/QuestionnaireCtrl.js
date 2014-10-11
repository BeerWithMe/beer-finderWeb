'use strict';

angular.module('beerMeApp')
  .controller('QuestionnaireCtrl', function ($location, $routeParams, $scope, likeButton, Questionnaire) {

    Questionnaire.counter = 0;
    //initialize with first beer in list
    $scope.beername = Questionnaire.initialBeers[0].name;
    $scope.imgUrl = Questionnaire.initialBeers[0].imgUrl;
    $scope.beernameInDB = Questionnaire.initialBeers[0].beernameInDB;
    $scope.rate = 0;


    // loads the next beer in the predetermined survey list
    $scope.nextbeer = function(){
      var response = Questionnaire.changeBeer();

      $scope.rate = 0;
      $scope.beername = response.beername;
      $scope.imgUrl = response.imgUrl;
      $scope.beernameInDB = response.beernameInDB;
      if (response.message !=  null) {
        $scope.message = response.message;
      }
    };
    
    //called when button clicked at end of survey
    $scope.goToRecommendations = function(){
      $location.path('/'+ localStorage.userName + '/recommendations');
    }

    //makes initial beer list available for ng-repeat in html
    this.questionnaire = Questionnaire
  })