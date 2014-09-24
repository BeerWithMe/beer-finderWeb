var db = require('./dbConfig.js')
var passport = require('./passport-config.js');



module.exports = function(app) {

  app.use(passport.initialize());
  app.use(passport.session());

  // Define which routers are assigned to each route.
  // app.get('/', function (req, res) {
  //   console.log('request received');
  //   res.send('<html><body><h1>Hello World</h1></body></html>');
  //   // console.log('response: ',res)
  // });

  app.get('/questionnaire', function (req, res) {
    var testResponse = [{'id': 41220, 'name': 'Budweiser', 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/1P45iR/upload_upBR4q-large.png'},
    {'id': 58978, 'name': 'Racer 5 IPA', 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/o1OELJ/upload_OutGJZ-large.png'},
    {'id': 37259, 'name': 'Anchor Steam' , 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/Uiol9p/upload_drOw0u-large.png'},
    {'id': 47942, 'name': 'Guinness Draught', 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/StkEiv/upload_etArOb-large.png'},
    {'id': 40135, 'name': 'Blue Moon Belgian White' , 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/dDXOEp/upload_SZEtGz-large.png'}];
    res.send(testResponse);
  });

  app.post('/login', function(req, res){  //write login function in service file, controlled by main controller
    console.log('REQ', req)
    var params = {username: req.body.signup_username, password: req.body.signup_password};
    db.query('OPTIONAL MATCH (n:User {username: ({username})}) RETURN n', params, function(err, data) {
      if (err) console.log('error: ', err);  //when n is null, res.send(data) sends [{"n": null}]
      var data = data[0];
      if (data.n !== null) {   
        console.log(data)
        console.log('Sorry, that username is taken.');
        res.redirect('/')
      } else { 
        db.query('CREATE (n:User {username: ({username}), password: ({password}) })', params, function(err) {
          if (err) {console.log('error: ', err)}
          console.log('user created')
          // res.redirect('/#/homepage/:username');
          res.redirect('/');
        })
      }
    })
  })

  app.post('/', passport.authenticate('local'), function(req, res){  //write login function in service file, controlled by main controller
    console.log(req.user);
    res.redirect('/')
    // res.redirect('/#/homepage/' + req.user._data.data.username);
  })

  app.get('/beer/:beername', function(req, res){
    var beername = req.params.beername;
    console.log("This is the beername: ", beername);
    db.getOneBeer(beername, function(beerObj){
      if(!beerObj){
        console.log('This beer has not been found');
        res.status(404).send("Beer not Found");
      }else{
        console.log('This beer has been found');
        res.send(JSON.stringify(beerObj));
      }
    });
  });
};