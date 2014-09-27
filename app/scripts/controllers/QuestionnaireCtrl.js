'use strict';

angular.module('beerMeApp')
  .controller('QuestionnaireCtrl', function ($scope, $routeParams, $location, likeButton, Questionnaire) {

    // loads the next beer in the predetermined survey list
    $scope.nextbeer = function(){
      var response = Questionnaire.changeBeer() 

        $scope.beername = response.beername;
        $scope.imgUrl = response.imgUrl
        if (response.message !=  null) {
          $scope.message = response.message;
        }
    };

    $scope.goToRecs = function() {
      console.log('with get item = ', localStorage.getItem('userName'))
      console.log('without = ', localStorage.userName)
      $location.path('/' + localStorage.getItem('userName') + '/recommendations')
    }
    
    //makes initial beer list available for ng-repeat in html
    this.questionnaire = Questionnaire

    // immediately invoke nextbeer to load first beer
    $scope.nextbeer();
  })