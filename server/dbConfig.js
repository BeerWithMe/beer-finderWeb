var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://beeradvisor.cloudapp.net:7474/');
var http = require('http');
var fs = require('fs');
var utils = require('./utils');

module.exports = db;


var getAllBeerQuery = "MATCH (n:Beer) RETURN n;";
var createNewBeerQuery = ["CREATE (n:Beer {name: ({name}), ibu: ({ibu}), abv: ({abv}), description: ({description}), imgUrl: ({imgUrl}) })",
						  "RETURN n;"].join('\n');
var getOneBeerByNameQuery = "MATCH (n:Beer {name: {name}}) RETURN n;"

db.createBeerNode = function(beerObj){
	// If the beer object comes with a picture, use it, otherwise we will use a
  	// default image later
	var imgUrl;
	if(beerObj.labels){
		imgUrl = beerObj.labels.large;
	}

	// Defining a params object allows us to use it for templating when we write
	// our neo4j query
	var params = {
			name: beerObj.name || 'undefined',
			ibu: beerObj.ibu || 'undefined',
			abv: beerObj.abv || 'undefined',
			description: beerObj.description || 'undefined',
			imgUrl: imgUrl || 'http://darrylscouch.com/wp-content/uploads/2013/05/Mystery_Beer.png'
	}	

	// create and save beer node into database
  	db.query(createNewBeerQuery, params, function(err, newBeerNode){
    if(err){
    	console.log(err);
    }else{
      console.log('successfully created beer node');
    }
  });
};

// deleted the url and key to push to github since it's a public repo.
db.dumpBeersIntoDB = function(path) {

  // Define the pieces that will constitute our get request url
  var beerDBurl = 'http://api.brewerydb.com/v2'//delete this before publicizing on github
  var key = '7cce543c5ae17da2dba68c674c198d2d' //delete this before publicizing on github
  var requestUrl;
  var page;
  // Counter is only here so we can keep track of our queries via console logs
  // It is not part of the program's functionality
  var counter = 0;

  // BrewDB requests only return 1 page at a time, and there are 650 pages,
  // so we have to send a get request for every page, one at a time
  for(var i=1;i<650;i++){

    // Using IIFE in order to have console.log transparency while get
    // requests are being made. this is not necessary for the program's
    // functionality, it just helps console logs be clearer in case you want
    // to console log the pages as they get added to the db
    (function(x){
      // i gets passed in to IIFE, thus page gets set to i
      page = x;
      // Insert the current page number into the request url
      requestUrl = beerDBurl + path + '/?p='+page+'&key=' + key;
      // Send get request to brewDB, the request Url looks something like this: 
      // http://api.brewerydb.com/v2/beers/?p=1&key=7cce543c5ae17da2dba68c674c198d2d
      http.get(requestUrl, function(res){
        var str = '';
        // Collect res data in str as a JSON object
        res.on('data', function (chunk) {
           str += chunk;
        });
        // Once all beer data from the page has been receied, parse it and
        // insert each beer on the page into our neo4j database
        res.on('end', function () {
          // counter keeps track of how many pages we've finished uploading
          // so that we'll know when counter = 650, we are completely done.
           counter++;
           console.log(counter)
           // The data from brewDB API comes inside the 'data' property of a larger
           // object. So we parse str, and then grab the data property.
           var beers = JSON.parse(str).data
           // Beers is now an array of objects, and each object represents one beer.
           // So we iterate over every beer, and call insertIntoDB(beer) in order
           // to add each beer to our database
           for(var k=0;k<beers.length;k++){
            db.createBeerNode(beers[k]);
           }
           // When counter reaches 650, we know we've finished
           if(counter===650){
             console.log('final page');
           }
        });
      });
    })(i)
  }
};
// Don't uncomment db.dumpBeersIntoDB(/beers) unless you want to 
// re-create the entire database.
//
// db.dumpBeersIntoDB is only called when we want to fill our database with new beers.
// We have already called it once and filled our database with all of brewDB's
// beer information, so we do not have to call beerget ever again, unless we need to re-do
// our database or implement updates later.
// db.dumpBeersIntoDB('/beers');



db.getAllBeer = function(callback){
	db.query(getAllBeerQuery, {}, function(err, allBeers){
		if(err){
			console.log(err);
		}else{
			console.log("Got all beers");
			callback(allbeers);
		}
	});
};

db.getOneBeer = function(beername, callback){
  var params = {
    name: beername
  };

  db.query(getOneBeerByNameQuery, params, function(err, beer){
    if(err){
      console.log(err);
    }else{
      // console.log(utils.makeData(beer, 'n')[0]);
      var beerArray = utils.makeData(beer, 'n');
      if(beerArray.length === 0){
        callback(undefined);
      }else{
        callback(beerArray[0]);
      }
    }
  });
};





// Example of what beer data looks like when it comes from brewDB API.
// These objects are contained within an array that belongs to a 'data'
// property of the JSON response object when you send a get request to /beers
// 		{ id: 'SqP18Z',
//        name: '(512) Cascabel Cream Stout',
//        description: 'Our cream stout, is an indulgent beer brewed with generous amounts of  English chocolate and roasted malts, as well as the traditional addition of lactose. Our stout, however, parted ways with tradition when we added over 20 pounds of Cascabel peppers to the beer.  Cascabel peppers, also called Guajillo, are characterized by their earthy character and deep, smooth spiciness. The peppers were de-stemmed by hand and added to the beer post-fermentation to achieve their most potent flavor potential. They add hints of raisins and berries to the beer, as well as a subtle tingling spiciness that washes away with each gulp.',
//        abv: '6',
//        glasswareId: 5,
//        availableId: 4,
//        styleId: 20,
//        isOrganic: 'N',
//        labels: [Object],
//        status: 'verified',
//        statusDisplay: 'Verified',
//        createDate: '2012-01-03 02:42:36',
//        updateDate: '2012-03-22 13:05:12',
//        glass: [Object],
//        available: [Object],
//        style: [Object] 
// 		},
//      { id: 'ezGh5N',
//        name: '(512) IPA',
//        description: '(512) India Pale Ale is a big, aggressively dry-hopped American IPA with smooth bitterness (~65 IBU) balanced by medium maltiness. Organic 2-row malted barley, loads of hops, and great Austin water create an ale with apricot and vanilla aromatics that lure you in for more.',
//        abv: '7.2',
//        ibu: '65',
//        glasswareId: 5,
//        availableId: 1,
//        styleId: 30,
//        isOrganic: 'N',
//        labels: [Object],
//        status: 'verified',
//        statusDisplay: 'Verified',
//        createDate: '2012-01-03 02:42:36',
//        updateDate: '2013-10-08 11:11:49',
//        glass: [Object],
//        available: [Object],
//        style: [Object] 
// 		},
