var db = require('./dbConfig.js')
// var passport = require('./passport-config.js');//currently not using passport
var bcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var jwtauth = require('./config/middleware.js');
var moment = require('moment');
// moment().format();

module.exports = function(app) {
  // app.use(passport.initialize());
  // app.use(passport.session());


  app.post('/login', function(req, res){  
    // grab the username and password
    var params = {
      username: req.body.username,
      password: req.body.password
    }
    // check if the username exists
    db.query('MATCH (n:User {username: ({username})}) RETURN n',params, function(err,data) {
      if(err) {console.log('OptionalMatch error: ',err)};
      // if the user exists
      if (data.length) {
        var node = data[0].n.data;
        var username = node.username;
        var password = node.password;
        console.log(password);
        // hash the password and check if it matches
        bcrypt.compare(params.password,password, function(err,match){
          // if the password matches
          if(match){
            console.log('matchh')
            var token = jwt.encode(username, 'secret');
            var expires = moment().add('days', 7).valueOf();
            console.log('token in routes js = ', token, 'expires', expires)
            res.json({token: token, expires: expires});
            //uncomment below and refactor to add token expiration
            // var expires = moment().add('days', 7).valueOf();
            // var token = jwt.encode({
            //   iss: username,
            //   exp: expires
            // }, app.get('jwtTokenSecret'));
            // // send the authenticated user to recommendations
            // res.json({
            //   token: token,
            //   expires: expires,
            //   username: JSON.stringify(username)
            // });
          } else {
            // if the password doesn't match
            console.log('wrong password')
            res.send('Wrong password');
          }
        })
      } else {
        // if the user does not exist
        console.log('the user does not exist')
        res.send('sorry no such user')
      }
    })
  })
  // When main.html sends a post request to /signup
  app.post('/signup', function(req,res) {
    // grab the username and password
    console.log("IN SIGNUP ROUTE")
    var username = req.body.username;
    var password = req.body .password;
    var params = {
      username: req.body.username,
      password: req.body.password
    }
    // check whether the username is already taken
    db.query('OPTIONAL MATCH (n:User {username: ({username})}) RETURN n', params, function(err,data) {
      if(err) console.log('signup error: ',err);
      var dbData = data[0];
      // if the username is already taken, send back message
      if(dbData.n !== null){
        res.send('Username already taken')
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
            var token = jwt.encode(username, 'secret');
            var expires = moment().add('days', 7).valueOf();
            console.log('token in routes js = ', token, 'expires', expires)
            res.json({token: token, expires: expires});
            //uncomment below and refactor to add token expiration
            // var expires = moment().add('days', 7).valueOf();
            // var token = jwt.encode({
            //   iss: username,
            //   exp: expires
            // }, app.get('jwtTokenSecret'));
            // // send the authenticated user to recommendations
            // res.json({
            //   token: token,
            //   expires: expires,
            //   username: JSON.stringify(username)
            // });
          })
        })
      }
    })
  })
  
  //When users search for a beer, searchCtrl.js sends a post request to this handler
  app.post('/searchBeer', function(req,res){
    // Grab the search string
    var beer = req.body.beername;
    // Find beer matches using regex, send results back as an array
    db.findAllBeersWithNameContaining(beer,function(beers){
      // beers will look like this: [{abv:,ibu:,name:,etc...},{abv:,ibu:,name:,etc...}]
      res.send(beers);
    });
  })

  // app.post('/', passport.authenticate('local'), function(req, res){  //write login function in service file, controlled by main controller
  //   res.redirect('/')
  //   // res.redirect('/#/homepage/' + req.user._data.data.username);
  // })



  app.post('/beer', [bodyParser(), jwtauth], function(req, res){
    // var beername = req.params.beername;
    var beername = req.body.beername;

  // app.get('/beer/:beername', function(req, res){
  //   var beername = req.params.beername;


  // app.get('/beer/:beername', [bodyParser(), jwtauth], function(req, res){
  //   var beername = req.params.beername;
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
    var user = {username: req.params.user};

    console.log("recommendationsRoute" );

    db.generateRecommendation(user, function(err, result){
      if(err){
        res.status(400).send("Error");
      }else{
        var data = {beers: result};
        res.send(data);
      }
    });
  });
};