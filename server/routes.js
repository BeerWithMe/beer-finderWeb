var db = require('./dbConfig.js')
var bcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var jwtauth = require('./config/middleware.js');
var moment = require('moment');
// moment().format();

module.exports = function(app) {


  //When users log in, main.html sends a post request to /login
  app.post('/login', function(req, res){  
    db.authenticateUser(req, function(message,token){
      if(message === 'sendToken'){
        res.send(token);
      } else {
        res.send('Wrong password');
      }
    });
  })

  // When users sign up, main.html sends a post request to /signup
  app.post('/signup', function(req, res) {
    db.addUserToDatabaseIfUserDoesNotExist(req, function(message, token){
      if(message === 'createUser'){
        res.json(token);
      } else {
        res.send('Username already taken');
      }
    })
  })
  
  // When users search for a beer, searchCtrl.js sends a post request to /searchBeer
  app.post('/searchBeer', function(req, res){
    // Grab the search string
    var beer = req.body.beername;
    // Find beer matches using regex, send results back as an array
    db.findAllBeersWithNameContaining(beer, function(beers){
      // beers will look like this: [{abv:,ibu:,name:,etc...},{abv:,ibu:,name:,etc...}]
      res.send(beers);
    });
  })





  app.post('/beer', [bodyParser(), jwtauth], function(req, res){
    var beername = req.body.beername;

    console.log("This is the beername: ", beername);
    console.log("This is the beername from req.body:", req.body);

    db.getOneBeer(beername, function(beerObj){
      if(!beerObj){
        console.log('This beer has not been found');
        res.status(404).send("Beer not Found");
      }else{
        console.log('This beer has been found');
        console.log(beerObj)
        res.send(JSON.stringify(beerObj));
      }
    });
  });


  app.post('/like', [bodyParser(), jwtauth], function(req, res){

  // app.post('/like/:beername', jwt({secret: secret.secretToken}), function(req, res){

  // app.post('/like/:beername', function(req, res){
  // app.post('/like/:beername', [bodyParser(), jwtauth], function(req, res){
  
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
          var data = {beers: result};
          res.send(data);
        }
      });
      
    }

  });
};