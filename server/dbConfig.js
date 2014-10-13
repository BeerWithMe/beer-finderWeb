var _ = require('underscore');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://beermeapp.cloudapp.net:7474/');
var http = require('http');
var fs = require('fs');
var utils = require('./utils');
var jwt = require('jwt-simple');
var jwtauth = require('./config/middleware.js');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');

module.exports = db;

/////////////////////////////////////////////////////////
//THESE ARE THE QUERIES WE USE FOR OUR DATABASE FUNCTIONS
/////////////////////////////////////////////////////////

var generateLikesQuery = 'MATCH (u:User),(b:Beer)\nWHERE u.username=({username}) AND b.name=({beername})\nMERGE (u)-[l:Likes {rating: ({rating})}]->(b)'
var checkLikesQuery = "MATCH (u:User)-[l:Likes]->(b:Beer) WHERE u.username =({username}) AND b.name =({beername}) return l";
var updateLikesQuery = "MATCH (u:User)-[l:Likes]->(b:Beer) WHERE u.username =({username}) AND b.name =({beername}) SET l.rating = ({rating})"
var getAllBeerQuery = "MATCH (n:Beer) RETURN n;";
var createNewBeerQuery = ["CREATE (n:Beer {name: ({name}), ibu: ({ibu}), abv: ({abv}), description: ({description}), imgUrl: ({imgUrl}), iconUrl: ({iconUrl}), medUrl: ({medUrl}), brewery: ({brewery}), website: ({website}) })",
              "RETURN n;"].join('\n');
var createNewBeerQueryWithBrewery = "CREATE (n:Beer {name: ({name}), ibu: ({ibu}), abv: ({abv}), description: ({description}), imgUrl: ({imgUrl}), iconUrl: ({iconUrl}), medUrl: ({medUrl}), brewery: ({brewery}), website: ({website}) })"
var getOneBeerByNameQuery = "MATCH (n:Beer {name: {name}}) OPTIONAL MATCH (n)-[r:Likes]-(u:User {username: {username}}) RETURN n,r,u;"

/////////////////////////////////////////////////
//Recommendation Engine: Overview
/////////////////////////////////////////////////
//1) Treat each user's beer ratings as a vector representing that user's overall preferences
//2) Assign similarity scores to all users based on the Euclidean Distance between their respective
//   preference vectors. Do this every time a user hits the like button on the UI.
//3) To find recommendations, find all user nodes who like a beer that the current user also likes
//4) Among those users, generate a list of every single user:beer:rating:userSimiliarity combination in the database
//6) Filter out all combinations where userSimilarity is < 0.6. This effectively reduces our data set
//   to only include users with similar tastes
//7) Aggregate the results into a set such that each unique element represents all combinations for a single beer,
//   in the form of a list that contains the beer itself, an array of its respective ratings, and an array
//   of its resepetive userSimilarity scores.
//8) For each beer element, distill its ratings into one average ratings score, and one avg userSimilarity score
//9) Order all beers first by their avg rating, then by the number of users who rated it,
//   then by the avg userSimilarity score.
//10)Return the set of beers, and for each beer, use the avgRating as the predicted rating for current user
/////////////////////////////////////////////////

var generateSimilarityQuery = [
                                //Find all users who share a like relationship with a beer that you also like
                                "MATCH (u1:User {username: ({username})}) -[x:Likes]-> (b:Beer)<-[y:Likes]-(u2:User)",
                                //For each user path, count the number of beers in common with you and include it as a value
                                "WITH count(b) AS commonBeers, u1.username AS user1, u2.username AS user2, u1, u2,",
                                //Path should now include unique users and beers, along with an array of squared ratings differentials
                                "collect((x.rating-y.rating)^2) AS ratings,",
                                //The beer name colleciton is just for debugging
                                "collect(b.name) AS beers",
                                "WITH commonBeers, beers, u1, u2, ratings",
                                //For each user, draw a similarity relationship from You if it doesn't already exist
                                //Then set the similarity rating to be the Euclidean distance between your ratings and the user's ratings
                                //Normalize the Euclidean distance to be between 0-1.
                                "MERGE (u1)-[s:Similarity]->(u2) SET s.similarity = 1-(SQRT(reduce(total=0.0, k in extract(i in ratings | i/commonBeers) | total+k))/4)"
                              ].join('\n'); 


var generateRecommendationQuery = [
                                    //Find all beers, users, and like relationships
                                    "MATCH (u1:User)-[r:Likes]->(b:Beer)-[loc:longLat]->(location),",
                                    //Isolate for only users who are similar to you
                                    "(u1)<-[s:Similarity]-(u2:User {username:({username})})",
                                    //Isolate for only paths with beers you haven't rated
                                    "WHERE NOT ((u2)-[:Likes]->(b))",
                                    //Paths should now include unique beer, rating, similarity combinations
                                    "WITH b, r.rating AS rating,COLLECT(location) AS locations, s.similarity as similarity",
                                    //Remove paths with similarities lower than 0.6
                                    "WHERE similarity > 0.6",
                                    //Paths should now include unique beers and nothing else. Each beer should have only one path, with
                                    //all of its ratings and similarities collected into arrays
                                    "WITH b, locations, COLLECT(similarity) AS similarities, COLLECT(rating) AS ratings",
                                    //Aggregate the similarities and the ratings to be single averaged values
                                    "WITH REDUCE(x = 0, i IN similarities | x+i)*1.0 / LENGTH(similarities) AS avgSimilarity,",
                                    "locations,b,similarities, REDUCE(x = 0, i IN ratings | x+i)*1.0 / LENGTH(similarities) AS avgRating, ratings",
                                    //Order the beers first by avgRating, then by number of people who rated it, then by similarity score
                                    "ORDER BY avgRating DESC, LENGTH(ratings) DESC, avgSimilarity DESC",
                                    //Filter for only beers with ratings above 2
                                    "WHERE avgRating >2",
                                    //Return beers along with avgRating(which we use as rec prediction) and locations array
                                    "RETURN b AS Beer, avgRating AS Recommendation, locations"
                                  ].join('\n');
//////////////////////////////////////////////////////////////////////////////////////////////////////
//How to find Euclidian Distance for all users against Mike. This is just for debugging in admin view:
/////////////////////////////////////////////////////////////////////////////////////////////////////
// MATCH (u1:User {username: 'Mike'})-[x:Likes]->(b:Beer)<-[y:Likes]-(u2:User)
// WITH count(b) AS commonBeers,
//   u1.username AS user1, u2.username AS user2,
//   collect(x.rating) as u1Ratings,
//   collect(y.rating) as u2Ratings,
//   collect((x.rating-y.rating)^2) as ratings,
// collect(b.name) as beers
// WITH 
// extract(i in ratings | i/commonBeers) as normedDist,
// 1-(sqrt(reduce(total=0.0, k in extract(i in ratings | i/commonBeers) | total+k ))/4) as euclDist,user1,user2,commonBeers,beers,u1Ratings,u2Ratings
// RETURN user1,user2,commonBeers, beers,u1Ratings, u2Ratings,normedDist ,euclDist

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

db.getOneBeer = function(beername, username, callback){
  var params = {
    name: beername,
    username: username
  };

  db.query(getOneBeerByNameQuery, params, function(err, beer){
    if(err){
      console.log(err);
    }else{
      //get the user's rating
      if (beer[0]['r'] !== null) {
        var ratingObj = beer[0]['r']['data']; //{rating: 3}
        var rating = ratingObj.rating; 
      } else {
        rating = null; 
      }
      //extract beer data
      var beerArray = utils.makeData(beer, 'n');
      console.log('data is ', beerArray)
      //add user's rating to object being sent back
      beerArray[0].userRating = rating; 
      console.log('beerArray[0].userRating', beerArray[0].userRating)
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
          db.query(generateLikesQuery, params, function(err){
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

db.generateRecommendation = function(username, userLat, userLong, callback){
  var params = {
    username: username,
    userLat: parseFloat(userLat),
    userLong: parseFloat(userLong)
  };
  // console.log('PARAMA ', params)
  

  db.query(generateRecommendationQuery, params, function(err, result){
    if(err){
      console.log("Error is here: ", err);
      callback(err, null);
    }else{
      var recommendationBeers = utils.makeData(result, 'Beer');

      for(var i = 0; i < result.length; i++){
        result[i].Beer = recommendationBeers[i];
      }

      console.log("Here is the result: ", result);
      callback(null, result);
    }
  });
};

db.showUserLikes = function(username,callback){
  var params = {username: username};
  db.query("MATCH (n:User {username: ({username})})-[r:Likes]-(b) RETURN b,r",params,function(err,data){
    if(err){
      console.log('Error:', err);
    }
    var ratedBeers = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: []
    }
    var ratingReverse = {
      5: 1,
      4: 2,
      3: 3,
      2: 4,
      1: 5
    }
    console.log('rated Beers',ratedBeers)
    for(var i=0; i<data.length; i++) {
      var beerObj = data[i]['b']['data']; // [{abv:,ibu:,name:,etc...},{abv:,ibu:,name:,etc...}]
      var ratingObj = data[i]['r']['data']; //{rating: 3}
      var rating = ratingObj.rating;
      var ratingCoded = ratingReverse[rating]
      ratedBeers[ratingCoded].push(beerObj);
    }
    console.log('hello?')
    // console.log('beer results :',data[0]['b']['data']);
    // console.log('rating results: ',data[0]['r']['data']);
    // console.log('rated beers collection: ',ratedBeers)
    console.log('about to invoke callback')
    callback(ratedBeers)
  })
}

// This function gets called by routes.js in response to POST requests to '/searchBeer' 
// It takes a string and a callback, it queries the database for all beers that have a name
// that contains the string, and then it invokes the callback on an array containing all of
// the resulting beer nodes. The callback will be a function that invokes res.send(beers)
db.findAllBeersWithNameContaining = function(beerString,callback){
  var params = {regEx: '(?i).*'+beerString+'.*'  };
  //query the server for all beer nodes with a name property that contains the characters in beerString
  db.query("MATCH (n) WHERE n.name =~ ({regEx}) RETURN n", params, function(err,data){
    if(err){
      console.log('error :',err)
    }
    //iterate over the results of the query
    var beers = [];
    for(var i=0;i<data.length;i++){
      var beerNode = data[i].n.data;
      beers.push(beerNode);
    }
    // invoke the callback on the results
    callback(beers);
  })
};

// call callback if user is authorized
db.authenticateUser = function(userInfo, callback){
  console.log('inside authenticateUser')
  var params = {
      username: userInfo.body.username,
      password: userInfo.body.password
    }
  db.query('OPTIONAL MATCH (n:User {username: ({username})}) RETURN n',params, function(err,data) {
    if(err) {console.log('OptionalMatch error: ',err)};
    // if the user exists
    if (data[0]['n'] == null) {
      callback('sorry no such user');
    } else if (data.length) {
      console.log('DATA= ', data)
      var node = data[0].n.data;
      var username = node.username;
      var password = node.password;
      console.log('thepassword: ',password);
      // hash the password and check if it matches
      bcrypt.compare(params.password,password, function(err,match){
        // if the password matches
        if(match){
          console.log('matchh')
          var token = jwt.encode(username, 'secret');
          var expires = moment().add(7, 'days').valueOf();
          console.log('token in routes js = ', token, 'expires', expires)
          var tokenData = {}
          tokenData.token = token;
          tokenData.expires = expires;
          tokenData = JSON.stringify(tokenData)
          console.log('tokenData :',tokenData)
          callback('sendToken',tokenData);
          // res.json({token: token, expires: expires});
        } else {
          // if the password doesn't match
          console.log('Wrong password')
          callback('wrong password')
          // res.send('Wrong password');
        }
      }) 
    }
  })
}

db.addUserToDatabaseIfUserDoesNotExist = function(userInfo, callback){
  var params = {
      username: userInfo.body.username,
      password: userInfo.body.password
    }
  // check whether the username is already taken
  db.query('OPTIONAL MATCH (n:User {username: ({username})}) RETURN n', params, function(err,data) {
    if(err) console.log('signup error: ',err);
    var dbData = data[0];
    // if the username is already taken, send back message
    if(dbData.n !== null){
      callback('Username already taken')
      // res.send('Username already taken')
    } else { 
      // if the username is available, hash the password
      var salt = bcrypt.genSaltSync(10);
      bcrypt.hash(params.password, salt,null, function(err,hash){
        if (err) console.log('bcrypt error', err)
        params.password = hash;
        // then create a user node in the database with a password equal to the hash
        db.query("CREATE (n:User {username: ({username}), password: ({password})})", params, function(err,data){
          if (err) {
            console.log('error', err)
          }
          var token = jwt.encode(params.username, 'secret');
          var expires = moment().add('days', 7).valueOf();
          console.log('token in routes js = ', token, 'expires', expires)
          var tokenData = {};
          tokenData.token = token;
          tokenData.expires = expires;
          callback('createUser',tokenData)
          // res.json({token: token, expires: expires});
        })
      })
    }
  })
}
// var similarIbuAbvQuery = "MATCH (allBeers:Beer) WHERE allBeers.ibu <> 'undefined' AND allBeers.abv <> 'undefined' WITH allBeers as beers WHERE beers.ibu >50 AND beers.ibu<60 AND beers.abv >8 AND beers.abv<11  RETURN beers"

db.getMeTheBeers = function(IBU, ABV, keyword, optionalKeyword, callback){
  console.log(IBU,ABV,keyword,optionalKeyword)
  if(!IBU && !ABV){
    console.log('no ibu and abv')
    var similarIbuAbvQuery = "MATCH (allBeers:Beer)-[r:longLat]-(n) WHERE allBeers.ibu = 'undefined' AND allBeers.abv = 'undefined' WITH allBeers as beers, n as location RETURN beers, location limit 50"
    return db.findSimilarBeers(similarIbuAbvQuery,IBU,ABV,keyword,optionalKeyword,callback);
  }
  if(IBU==='undefined'){
    console.log('no ibu')
    var similarIbuAbvQuery = "MATCH (allBeers:Beer)-[r:longLat]-(n) WHERE allBeers.ibu = 'undefined' AND allBeers.abv <> 'undefined' WITH allBeers as beers, n as location WHERE beers.abv >({ABVmin}) AND beers.abv<({ABVmax})  RETURN beers, location limit 50"
    return db.findSimilarBeers(similarIbuAbvQuery,IBU,ABV,keyword,optionalKeyword,callback);
  }
  if(!ABV){
    console.log('no abv')
    var similarIbuAbvQuery = "MATCH (allBeers:Beer)-[r:longLat]-(n) WHERE allBeers.ibu <> 'undefined' AND allBeers.abv = 'undefined' WITH allBeers as beers, n as location WHERE beers.ibu >({IBUmin}) AND beers.ibu<({IBUmax})  RETURN beers, location limit 50"
    return db.findSimilarBeers(similarIbuAbvQuery,IBU,ABV,keyword,optionalKeyword,callback);
  }
  console.log('nadda')
  var similarIbuAbvQuery = "MATCH (allBeers:Beer)-[r:longLat]-(n) WHERE allBeers.ibu <> 'undefined' AND allBeers.abv <> 'undefined' WITH allBeers as beers, n as location WHERE beers.ibu >({IBUmin}) AND beers.ibu<({IBUmax}) AND beers.abv >({ABVmin}) AND beers.abv<({ABVmax})  RETURN beers, location limit 50"
  return db.findSimilarBeers(similarIbuAbvQuery,IBU,ABV,keyword,optionalKeyword,callback);
}

// var similarIbuAbvQuery = "MATCH (allBeers:Beer) WHERE allBeers.ibu <> 'undefined' AND allBeers.abv <> 'undefined' WITH allBeers as beers WHERE beers.ibu >({IBUmin}) AND beers.ibu<({IBUmax}) AND beers.abv >({ABVmin}) AND beers.abv<({ABVmax})  RETURN beers"
db.findSimilarBeers = function(queryString,IBU,ABV,keyword, optionalKeyword, callback){
  var params = {
    IBUmin: IBU-10,
    IBUmax: parseFloat(IBU+10),
    ABVmin: ABV-1,
    ABVmax: parseFloat(ABV+1)
  }
  console.log(params)
  db.query(queryString, params, function(err, data){
    console.log('hi');
    if(err){
      console.log('For some reason Error :',err)
    } else {
      // console.log(data[1].allBeers.data);
      // console.log('the data: ',data)
      // console.log('location', data[0].location.data)
      var beers = [];
      for(var i=0;i<data.length;i++){
        var beerNode = data[i].beers.data;
        if (data[i].location.data.latitude) {
          beerNode.latitude = data[i].location.data.latitude;
        } else {
          beerNode.latitude = 'undefined';
        }
        if (data[i].location.data.longitude) {
          beerNode.longitude = data[i].location.data.longitude;
        } else {
          beerNode.longitude = 'undefined';
        }
        beerNode.longitude = data[i].location.data.longitude;
        beers.push(beerNode);
      }
      var checkForKeyword = function(keyword, optionalKeyword, string){
        var words = string.split(' ');
        if(!keyword){
          return false;
        }
        if(optionalKeyword){
          for(var i=0; i<words.length; i++){
            if(words[i].toUpperCase()===keyword.toUpperCase() || words[i].toUpperCase()===optionalKeyword.toUpperCase()){
              return true;
            }
          }
        } else {
          for(var i=0; i<words.length; i++){
            if(words[i].toUpperCase()===keyword.toUpperCase()){
              return true;
            }
          }
        }
        return false;
      }
      //sorts similar types and other types
      var similarTypeBeers = [];
      var otherBeers = [];
      for(var k=0; k<beers.length;k++){
        if (beers[k].description) {
          if(checkForKeyword(keyword, optionalKeyword, beers[k].description)){
            similarTypeBeers.push(beers[k]);
          } else {
            otherBeers.push(beers[k]);
          }
        }
      }
      var otherBeers = otherBeers.slice(0,50);
      callback(similarTypeBeers,otherBeers);
    }
  })
}

//Beer types:
  //coffee
  //Ale
  //IPA, Ale
  //Belgian
  //Bock
  //Cider
  //Pilsner, lager
  //Blonde, Kolsch
  //Hefeweizen
  //Porter, stout
  //witbier, wheat
  //saison
  //lambic
  //barleywine
