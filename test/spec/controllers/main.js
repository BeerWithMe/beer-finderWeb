'use strict';

describe('Controller: MainCtrl', function () {
  var MainCtrl, $scope, $http, $location, $state, $httpBackend, $rootScope, userService;

  // load the controller's module //inject injector to retrieve dependencies
  beforeEach(module('beerMeApp'));
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get($rootScope);
    // $scopeProvider = $injector.get('$scopeProvider');
    $location = $injector.get('$location');
    $http = $injector.get('$http');
    $state = $injector.get('$state');
    userService = $injector.get('userService');
    $scope = $rootScope.$new();
    $httpBackend = $injector.get('$httpBackend');

    var $controller = $injector.get('$controller');

    // used to create our AuthController for testing
    createController = function () {
      return $controller('MainCtrl', {
        $scope: $scope,
        $location: $location,
        $http: $http,
        $state: $state,
        userService: userService
      });
    };

    createController();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $localStorage.removeItem('com.shortly');
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
    expect(localStorage.getItem('com.shortly')).to.be(token);
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
    expect(localStorage.getItem('com.shortly')).to.be(token);
  });
});

 
