var db = require('./dbConfig.js')
var bcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var jwtauth = require('./config/middleware.js');
var moment = require('moment');
// moment().format();

module.exports = function(app) {

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
    // Grab the search string
    var beer = req.body.beername;
    // Find beer matches using regex, send results back as an array
    db.findAllBeersWithNameContaining(beer, function(beers){
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

  app.get('/:user/recommendations', [bodyParser(), jwtauth], function(req, res){
    var username = req.headers['x-username'];
    var Urluser = {username: req.params.user};
    if(username !== Urluser.username){
      console.log(username,Urluser)
      res.status(400).send("Error")

    } else {
      console.log("recommendationsRoute" );

      db.generateRecommendation(Urluser, function(err, result){
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
};