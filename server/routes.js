var db = require('./dbConfig.js')
var bcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var jwtauth = require('./config/middleware.js');
var moment = require('moment');

//Beer types:
  //coffee//
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
module.exports = function(app) {

  app.post('/getSimilarBeers', function(req, res){
    console.log('received request :',req.body)
    var IBU = req.body.ibu;
    var ABV = req.body.abv;
    var description = req.body.description; 
    
    var getKeywords = function(description){
      var words = description.split(' ')
      for(var i=0; i<words.length; i++){
        if(words[i].toUpperCase() === 'COFFEE'){
          return ['coffee', null];
        }
        if(words[i].toUpperCase() === 'BELGIAN'){
          return ['belgian', null];
        }
        if(words[i].toUpperCase() === 'IPA'){
          return ['ipa', null];
        }
        if(words[i].toUpperCase() === 'CIDER'){
          return ['cider', null];
        }
        if(words[i].toUpperCase() === 'HEFEWEIZEN'){
          return ['hefeweizen', null];
        }
        if(words[i].toUpperCase() === 'SAISON'){
          return ['saison', null];
        }
        if(words[i].toUpperCase() === 'LAMBIC'){
          return ['lambic', null];
        }
        if(words[i].toUpperCase() === 'BARLEYWINE'){
          return ['barleywine', null];
        }
        if(words[i].toUpperCase() === 'PILSNER' || words[i].toUpperCase() === 'LAGER' ){
          return ['pilsner','lager'];
        }
        if(words[i].toUpperCase() === 'PORTER' || words[i].toUpperCase() === 'STOUT' ){
          return ['stout','porter'];
        }
        if(words[i].toUpperCase() === 'BLONDE' || words[i].toUpperCase() === 'KOLSCH'){
          return ['blonde', 'kolsch'];
        }
        if(words[i].toUpperCase() === 'WITBIER' || words[i].toUpperCase() === 'WHEAT'){
          return ['witbier', 'wheat'];
        }
        if(words[i].toUpperCase() === 'ALE'){
          return ['ale','ipa'];
        }
        if(words[i].toUpperCase() === 'BROWN'){
          return ['brown', null];
        }
        return [null,null]
      }
    }
    var keyword = getKeywords(description)[0];
    var optionalKeyword = getKeywords(description)[1];
    console.log('about to query DB: ',IBU,ABV,keyword,optionalKeyword)
    db.getMeTheBeers(IBU, ABV, keyword, optionalKeyword, function(similarBeers,sortofSimilarBeers){
      // similarBeers = data.similarBeers;
      // sortofSimilarBeers = data.sortofSimilarBeers;
      var data = {
        similarBeers: similarBeers,
        sortofSimilarBeers: sortofSimilarBeers
      }
      res.send(data)
    })
  })

  //When users LOG IN, main.html sends a post request to /login
  app.post('/login', function(req, res){  
    db.authenticateUser(req, function(message,token){
      if(message === 'sendToken'){
        res.send(token);
      } else {
        res.send('Wrong password');
      }
    });
  })

  // When users SIGN UP, main.html sends a post request to /signup
  app.post('/signup', function(req, res) {
    console.log("REGULAR SIGNUP!!!", req.body);
    db.addUserToDatabaseIfUserDoesNotExist(req, function(message, token){
      if(message === 'createUser'){
        res.json(token);
      } else {
        res.send('Username already taken');
      }
    })
  })

  // When users SEARCH FOR A BEER, searchCtrl.js sends a post request to /searchBeer
  app.post('/searchBeer', function(req, res){
    var a = process.hrtime()
    // Grab the search string
    var beer = req.body.beername;
    // Find beer matches using regex, send results back as an array
    db.findAllBeersWithNameContaining(beer, function(beers){
      var b = process.hrtime(a)
      console.log(b)
      // beers will look like this: [{abv:,ibu:,name:,etc...},{abv:,ibu:,name:,etc...}]
      res.send(beers);
    });
  })


// This endpoint is for getting beer information for a specific beer
  app.post('/beer', [bodyParser(), jwtauth], function(req, res){
    var beername = req.body.beername;
    var username = req.body.username; 
    console.log("This is the beername: ", beername);
    console.log("This is the beername from req.body:", req.body);

    db.getOneBeer(beername, username, function(beerObj){
      if(!beerObj){
        console.log('This beer has not been found');
        res.status(404).send("Beer not Found");
      }else{
        console.log('rating retrieved = ', beerObj.userRating)
        res.send(JSON.stringify(beerObj));
      }
    });
  });


// This endpoint is for creating like relationship between users and beers.
  app.post('/like', [bodyParser(), jwtauth], function(req, res){
    var user = {username: req.body.username};
    var beer = {beername: req.body.beername};
    var rating = parseInt(req.body.rating);

    console.log("like username: ", req.body.username);
    console.log("like beername: ", req.body.beername);
    console.log("like rating: ", req.body.rating);

    db.generateLikes(user, beer, rating, function(err){
      if(err){
        res.status(400).send("Error");
      }else{
        db.generateSimilarity(user, function(err){
          if(err){
            res.status(400).send("Error");
          }else{
            res.send("Success");
          }
        });
      }
    })
  });


  app.get('/:user/showLikes', [bodyParser(), jwtauth], function(req,res){
    var username = req.headers['x-username'];
    var Urluser = req.params.user
    if(username !== Urluser){
      console.log('Unauthorized user trying to access userpage: ',username,Urluser);
      res.status(400).send("Error")
    } else {
      console.log('theusername is ',username)
      db.showUserLikes(username, function(arrayOfLikedBeers){
        console.log('about to send some info: ')
        res.send(arrayOfLikedBeers);
      })

    }
  })


// This endpoint is for getting recommendations for a user.

  app.post('/:user/recommendations', [bodyParser(), jwtauth], function(req, res){
    var username = req.headers['x-username'];
    var Urluser = {username: req.params.user};
    if(username !== Urluser.username){
      console.log(username,Urluser)
      res.status(400).send("Error")

    } else {
      var username = req.body.username;
      var userLat = req.body.latitude;
      var userLong = req.body.longitude; 
      console.log('USERDATA ', username, userLat, userLong);
      db.generateRecommendation(username, userLat, userLong, function(err, result){
        if(err){
          res.status(400).send("Error");
        }else{
          console.log('recommendations fetched')
          var data = {beers: result};
          res.send(data);
        }
      });
      
    }

  });

  /////////////////////////////////////////////////////////////
  ///////////////BEGIN IOS SPECIAL ENDPOINTS//////////////////
  ////////////////////////////////////////////////////////////

  // We receive a JSON object containing a username and password
  //{username: xxxxxx, password: xxxxxx}
  app.post('/IOSsignup', function(req, res) {

    db.addUserToDatabaseIfUserDoesNotExist(req, function(message, token){
      if(message === 'createUser'){
        console.log("RES RES RES: " , res);
        res.send('User successfully created!');
      } else {
        res.status(407).send('Username already taken');
      }
    })
  })

  //// We receive a JSON object containing a username and password
  app.post('/IOSlogin', function(req, res){  
    db.authenticateUser(req, function(message, token){
      if(message === 'sendToken'){
        res.send('User logged in successfully');
      } else {
        res.send('Wrong password');
      }
    });
  })

  // We receive a JSON object containing just a username
  app.get('/IOSrecommendations', function(req, res){
    var username = req.body.username;
    db.generateRecommendation(username, function(err, result){
      if(err){
        res.status(400).send("Error");
      }else{
        var data = {beers: result};
        res.send(data);
      }
    });    
  }) 

  // This endpoint is for creating like relationship between users and beers.
  app.post('/IOSlike', function(req, res){
    var user = {username: req.body.username};
    var beer = {beername: req.body.beername};
    var rating = parseInt(req.body.rating);

    db.generateLikes(user, beer, rating, function(err){
      if(err){
        res.status(400).send("Error");
      }else{
        db.generateSimilarity(user, function(err){
          if(err){
            res.status(400).send("Error");
          }else{
            res.send("Success");
          }
        });
      }
    })
  });

};