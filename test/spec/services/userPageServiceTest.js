'use strict';

describe('user page service', function() {
  var userPageService, httpBackend;

  beforeEach(module('beerMeApp'));

  beforeEach(inject(function(_userPageService_, $httpBackend) {
    userPageService = _userPageService_;
    httpBackend = $httpBackend;
  }));

  it('should do something', function(done) {
    httpBackend.whenGET('/Lauren/showsLikes').respond({
      data: {
        '1': [
          {$$hashKey: '00C',
            abv: 8,
            brewery: 'Test Brew',
            description: 'Tests are not tasty.',
            ibu: 50,
            iconUrl: 'https://s3.amazonaws.com/brewerydbapi/beer/CFIZtr/upload_Y3Prr0-icon.png',
            imgUrl: 'https://s3.amazonaws.com/brewerydbapi/beer/CFIZtr/upload_Y3Prr0-large.png',
            medUrl: 'https://s3.amazonaws.com/brewerydbapi/beer/CFIZtr/upload_Y3Prr0-medium.png',
            name:  'Karma',
            website: 'beerme.azurewebsites.net'
          }],
        '2': [],
        '3': [],
        '4': [],
        '5': []
        }
    });

    httpBackend.whenGET('views/main.html').respond({
     
    });

    userPageService.getLikesFromDatabase('Lauren', function(results) {
      var results = results;
    })
    httpBackend.flush();
  });
});

