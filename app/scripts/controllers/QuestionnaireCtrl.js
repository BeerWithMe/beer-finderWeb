'use strict';

angular.module('beerMeApp')
  .controller('QuestionnaireCtrl', function ($scope, $routeParams, likeButton, Questionnaire, $location) {

    Questionnaire.counter = 0;
    console.log('counter = ', Questionnaire.counter)
    $scope.beername = Questionnaire.initialBeers[0].name;
    $scope.imgUrl = Questionnaire.initialBeers[0].imgUrl;
    $scope.beernameInDB = Questionnaire.initialBeers[0].beernameInDB;
    $scope.rate = 0;


    // loads the next beer in the predetermined survey list
    $scope.nextbeer = function(){
      if($scope.rate === 0){
        return;
      }
      // Update the like relationship when user clicked nextbeer button.
      likeButton.like($scope.beernameInDB, $scope.rate);

      var response = Questionnaire.changeBeer();

      $scope.beername = response.beername;
      $scope.imgUrl = response.imgUrl;
      $scope.beernameInDB = response.beernameInDB;
      if (response.message !=  null) {
        $scope.message = response.message;
      }
    };

    $scope.goToRecommendations = function(){
      $location.path('/'+ localStorage.userName + '/recommendations');
    }

    //makes initial beer list available for ng-repeat in html
    this.questionnaire = Questionnaire
  })