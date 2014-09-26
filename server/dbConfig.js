var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://beeradvisor.cloudapp.net:7474/');
var http = require('http');
var fs = require('fs');
var utils = require('./utils');

module.exports = db;
///////////////////////////
//Helper Funcs
//////////////////////////
// db.createIfDoesntExist = function(nodeType,properties,callback){
//   var params = {
//     nodeType: nodeType
//   };
//   for (var i in properties){
//     params[i] = properties[i]
//   }
//   db.query("MERGE (n:({nodeType}) {({}) } )",params,function(err,result){
//     if(err){
//       callback(err)
//     } else {
//       callback();
//     }
//   })
// }

//How to delete everything in the database: db.query("match (n) optional match (n)-[r]-() delete n, r",function(){})

var getAllBeerQuery = "MATCH (n:Beer) RETURN n;";

var createNewBeerQuery = ["CREATE (n:Beer {name: ({name}), ibu: ({ibu}), abv: ({abv}), description: ({description}), imgUrl: ({imgUrl}), iconUrl: ({iconUrl}), medUrl: ({medUrl}), brewery: ({brewery}), website: ({website}) })",
						  "RETURN n;"].join('\n');
createNewBeerQueryWithBrewery = "CREATE (n:Beer {name: ({name}), ibu: ({ibu}), abv: ({abv}), description: ({description}), imgUrl: ({imgUrl}), iconUrl: ({iconUrl}), medUrl: ({medUrl}), brewery: ({brewery}), website: ({website}) })"
var getOneBeerByNameQuery = "MATCH (n:Beer {name: {name}}) RETURN n;"

var getOneBeerByNameQuery = "MATCH (n:Beer {name: {name}}) RETURN n;";
var generateSimilarityQuery = ["MATCH (u1:User {username: ({username})})-[x:Likes]->(b:Beer)<-[y:Likes]-(u2:User)",
                               "WITH SUM(x.rating * y.rating) AS xyDotProduct,",
                                    "SQRT(REDUCE(xDot = 0.0, a IN COLLECT(x.rating) | xDot + a^2)) AS xLength,", 
                                    "SQRT(REDUCE(yDot = 0.0, b IN COLLECT(y.rating) | yDot + b^2)) AS yLength,",
                                    "u1, u2", 
                               "MERGE (u1)-[s:Similarity]->(u2) SET s.similarity = xyDotProduct / (xLength * yLength)"].join('\n');
var generateLikseQuery = 'MATCH (u:User),(b:Beer)\nWHERE u.username=({username}) AND b.name=({beername})\nMERGE (u)-[l:Likes {rating: ({rating})}]->(b)'
var checkLikesQuery = "MATCH (u:User)-[l:Likes]->(b:Beer) WHERE u.username =({username}) AND b.name =({beername}) return l";
var updateLikesQuery = "MATCH (u:User)-[l:Likes]->(b:Beer) WHERE u.username =({username}) AND b.name =({beername}) SET l.rating = ({rating})"
var generateRecommendationQuery = ['MATCH (u1:User)-[r:Likes]->(b:Beer),',
                                  '(u1)-[s:Similarity]-(u2:User {username:({username})})',
                                  'WHERE NOT((u2)-[:Likes]->(b))',
                                  'WITH b, s.similarity AS similarity,',
                                  'r.rating AS rating', 
                                  'ORDER BY b.name, similarity DESC',
                                  'WITH b.name AS beer, COLLECT(rating)[0..3] AS ratings',
                                  'WITH beer, REDUCE(s = 0, i IN ratings | s + i)*1.0 / LENGTH(ratings) AS reco ORDER BY reco DESC',
                                  'RETURN beer AS Beer, reco AS Recommendation'].join('\n');




db.createBeerNode = function(beerObj){
	// If the beer object comes with a labels property, use the pictures it comes with, otherwise we will use a
  // default image later. 

	var imgUrl;
  var iconUrl;
  var medUrl;
	if(beerObj.labels){
    imgUrl = beerObj.labels.large;
    iconUrl = beerObj.labels.icon;
    medUrl = beerObj.labels.medium;
  }


	// Defining a params object allows us to use it for templating when we write
	// our neo4j query
	var params = {
			ibu: beerObj.ibu || 'undefined',
			abv: beerObj.abv || 'undefined',
			description: beerObj.description || 'undefined',
			imgUrl: imgUrl || 'http://darrylscouch.com/wp-content/uploads/2013/05/Mystery_Beer.png',
      iconUrl: iconUrl || 'http://blogs.citypages.com/food/beer%20thumbnail.jpg',
      medUrl: medUrl || 'http://foodimentaryguy.files.wordpress.com/2014/09/chromblog-thermoscientific-com.jpg',
      name: beerObj.name || 'undefined',
      brewery: '',
      website: 'website unavailable'
	}	

  //If the beer has a brewery
  if(beerObj.breweries){
    var locations = [];

    var brewLocations = beerObj.breweries[0].locations || [];

    //add each brewery location to the location array, we will make nodes later
    //and draw relationships to the beer
    if(brewLocations.length>0){
      // console.log('sdfasdhlfasdhflkadsjflidsajfldsajflsdajflkdsajflasd')  
      for(var i=0;i<brewLocations.length;i++){
        var zip = brewLocations[i]['postalCode'] || 'undefined';
        var state = brewLocations[i]['region'] || 'undefined';
        var city = brewLocations[i]['locality'] || 'undefined';
        var longitude = brewLocations[i]['longitude'] || 'undefined';
        var latitude = brewLocations[i]['latitude'] || 'undefined';
        var brewInfo = {
          'zip': zip,
          'state': state,
          'city': city,
          'longitude': longitude,
          'latitude': latitude
        }
        locations.push(brewInfo);
        //locations now looks like this [{zip:,state:,etc...},{zip:,state:,etc...}]
      }

    // set brewery, website, name parameters
    params.brewery = beerObj.breweries[0].name || '';
    params.website = beerObj.breweries[0].website || 'website unavailable';
    params.name = params.brewery+"-"+beerObj.name || 'undefined';
    }
    ///////////////////////////////////////////////////////////////////////////////
    //if has brwery, add beer node, then create location nodes and add relationships
    ///////////////////////////////////////////////////////////////////////////////
    //before we insert beer into database, check if the beername exists
    db.query('MATCH (n:Beer {name:({name})}) return n',params,function(err,data){
      if(err){console.log('error: ',err)}
      //if beer does not exist
      if(!data.length){
        // console.log('inside has brewery, about to create ndoe and relationships')
        // console.log('I can access params ',params.name)
        //create the beer
        db.query(createNewBeerQueryWithBrewery,params,function(err,data){
          // console.log('v=called!!!!')
          if(err){
            console.log('error: ',err)
          } else {
            console.log('created a beer with a brewery')
            // console.log('about to iterate over brewery properties')
            // console.log('locations.length ',locations.length)
            // console.log('please workkkkk params',params)
            //[{zip:,state:,etc...},{zip:,state:,etc...}]
              
              
              for(var i=0;i<locations.length;i++){
                (function(k){
                  console.log('k should be a number ',k)
                    // console.log('inside locations for loop')
                    // console.log('I can access params ',params)
                    var beername = params.name
                    // console.log('beername ',beername)
                    var params1 = {};
                    params1.beername = beername;
                    // console.log('params ',params)
                    console.log('We should be logging 5 different keys now...')
                  for(var key in locations[k]){
                    (function(x){
                      // console.log('inside key for loop')
                      console.log('The current key is ',x)
                      params1['value'] = locations[k][x];
                      params1['type'] = x;
                      // console.log('about to create a relationship for :',params.beername,params.type)
                      //if node doesn't exist, make location node and relation to beername
                      (function(y){
                        db.query('MATCH (b:Beer {name: ({beername})}) with b MERGE (n:'+params1.type+' {'+params1.type+': "'+params1.value+'"}) merge (n)<-[:'+params1.type+']-(b)',params1,function(err,data){
                          if(err) console.log(err)
                          console.log('wrote relationships between beer and ',params1.type)
                        })
                      })(params1)

                    })(key)
                  }
                })(i)
              }

          }

        })
      }
    })

  } else {
    //////////////////////////////////////////////////
    //if no brewry, add the beer to databse like normal
    //////////////////////////////////////////////////
    //before we insert beer into database, check if the beername exists


    db.query('OPTIONAL MATCH (n:Beer {name: ({name})}) RETURN n', params, function(err,data) {
      if(err) console.log('OptionalMatch beer name error: ',err,params);
      var dbData = data[0];
      if(dbData.n === null){
        // create and save beer node into database
        db.query(createNewBeerQueryWithBrewery, params, function(err, newBeerNode){
          if(err){
            console.log(err,params);
          }else{
            console.log('created a beer with no brewery');
          }
        });
      }
    })   

  }
 
};

db.testQuery = function(){}
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
      requestUrl = beerDBurl + path + '/?p='+page+'&withBreweries=Y'+'&key=' + key;
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
           console.log(beers.length)
           // Beers is now an array of objects, and each object represents one beer.
           // So we iterate over every beer, and call db.createBeerNode(beer) in order
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

db.generateSimilarity = function(user, callback){
  var params = {
    username: user.username
  };

  db.query(generateSimilarityQuery, params, function(err){
    if(err){
      console.log("Error is here:", err);
      callback(err);
    }else{
      console.log("Successfully created similarity relationships for: ", user.username);
      callback(null);
    }
  });
};

db.generateLikes = function(user, beer, rating, callback){
  var params = {
    username: user.username,
    beername: beer.beername,
    rating: rating
  };

  db.query(checkLikesQuery, params, function(err, likes){
    if(err){
      console.log(err);
      callback(err);
    }else{
      console.log(likes);
      if(likes.length === 0){
          db.query(generateLikseQuery, params, function(err){
            if(err){
              console.log(err);
              callback(err);
            }else{
              console.log("Successfully created likes relationships between user and beer");
              callback(null);
            }
          });
      }else{
        db.query(updateLikesQuery, params, function(err){
          if(err){
            console.log(err);
            callback(err);
          }else{
            console.log("Successfully updated likes relationships between user and beer");
            callback(null);
          }
        });
      }
    }
  });
};

db.generateRecommendation = function(user, callback){
  var params = {
    username: user.username
  };

  db.query(generateRecommendationQuery, params, function(err, result){
    if(err){
      console.log("Error is here: ", err);
      callback(err, null);
    }else{
      console.log("Here is the result: ", result);
      callback(null, result);
    }
  });
};

// db.generateRecommendation({username: "Mike"}, function(){});
// db.generateSimilarity({username: "Mike"}, function(){});
// db.generateLikes({username: "Mike"}, {beername: "Budweiser"}, 4);
// db.generateLikes({username: "lauren"}, {beername: 'Anchor Steam'}, 4);

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
