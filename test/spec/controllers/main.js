'use strict';

describe('Controller: MainCtrl', function () {
  var MainCtrl, $scope, $http, $location, $state, $httpBackend, $rootScope, $window, userService;

 

  // load the controller's module //inject injector to retrieve dependencies
  beforeEach(module('beerMeApp'));
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get($rootScope);
    // $scopeProvider = $injector.get('$scopeProvider');
    $location = $injector.get('$location');
    $http = $injector.get('$http');
    $state = $injector.get('$state');
    userService = $injector.get('userService');
    $httpBackend = $injector.get('$httpBackend');
    $window = $injector.get('$window');
    scope = $injector.get($rootScope).$new();
    

    var $controller = $injector.get('$controller');

    // used to create our AuthController for testing
    createController = function () {
      return $controller('MainCtrl', {
        $scope: $scope,
        $location: $location,
        $http: $http,
        $state: $state,
        $window: $window,
        userService: userService
      });
    };

    createController();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.localStorage.removeItem('com.shortly');
  });

  it('should have a signup method', function() {
    expect($scope.signup).to.be.a('function');
  });

  it('should store token in localStorage after signup', function() {
    // create a fake JWT for auth
    var token = 'sjj232hwjhr3urw90rof';

    // make a 'fake' reques to the server, not really going to our server
    $httpBackend.expectPOST('/signup').respond({token: token});
    $scope.signup();
    $httpBackend.flush();
    expect($window.localStorage.getItem('com.shortly')).to.be(token);
  });

  it('should have a login method', function() {
    expect($scope.login).to.be.a('function');
  });

  it('should store token in localStorage after signin', function() {
    // create a fake JWT for auth
    var token = 'sjj232hwjhr3urw90rof';
    $httpBackend.expectPOST('/login').respond({token: token});
    $scope.login();
    $httpBackend.flush();
    expect($window.localStorage.getItem('com.shortly')).to.be(token);
  });
});

 
