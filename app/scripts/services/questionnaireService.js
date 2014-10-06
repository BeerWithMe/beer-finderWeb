angular.module('beerMeApp')
  .factory('Questionnaire', function () {
    return { 
      initialBeers:  
      [{'name': 'Budweiser', 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/1P45iR/upload_upBR4q-large.png', 'beernameInDB':'Anheuser-Busch InBev-Budweiser'},
      {'name': 'Racer 5 IPA', 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/o1OELJ/upload_OutGJZ-large.png', 'beernameInDB':'Bear Republic Brewing Company-Racer 5 IPA'},
      {'name': 'Anchor Steam' , 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/Uiol9p/upload_drOw0u-large.png', 'beernameInDB':'Anchor Brewing Company-Anchor Steam'},
      {'name': 'Guinness Draught', 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/StkEiv/upload_etArOb-large.png', 'beernameInDB':'Guinness-Guinness Draught'},
      {'name': 'Blue Moon Belgian White' , 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/dDXOEp/upload_SZEtGz-large.png', 'beernameInDB':'Blue Moon Brewing Company-Blue Moon Belgian White'},
      {'name': 'Lagunitas - IPA', 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/iLlMCb/upload_xp2OJo-large.png', 'beernameInDB':'Lagunitas Brewing Company-Lagunitas IPA'},
      {'name': 'Pliny the Elder', 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/XAXGgF/upload_or9CTI-large.png', 'beernameInDB':'Russian River Brewing Company-Pliny the Elder'}],
      
      counter: 0, //incremented to one immediately on first invocation of changeBeer
      
      //this function returns the next beer in the list
      //if we're at the end of the list, it loads a message
      changeBeer:  function() {
        this.counter++;
        if (this.counter >= this.initialBeers.length) {
          return {
            message: "Cool! Go check out your recommendations!"
          } 
        } else {
          var newBeer = this.initialBeers[this.counter];
          return {
            beername: newBeer.name,
            imgUrl: newBeer.imgUrl,
            beernameInDB: newBeer.beernameInDB
          }
        }
      }
    }  
  })