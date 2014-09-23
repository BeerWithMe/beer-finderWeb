var db = require('./dbConfig.js')
var passport = require('./config/middleware.js');



module.exports = function(app) {

  app.use(passport.initialize());
  app.use(passport.session());

  // Define which routers are assigned to each route.
  app.get('/', function (req, res) {
    console.log('request received');
    res.send('<html><body><h1>Hello World</h1></body></html>');
    // console.log('response: ',res)
  });

  app.get('/questionnaire', function (req, res) {
    var testResponse = [{'id': 41220, 'name': 'Budweiser', 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/1P45iR/upload_upBR4q-large.png'},
    {'id': 58978, 'name': 'Racer 5 IPA', 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/o1OELJ/upload_OutGJZ-large.png'},
    {'id': 37259, 'name': 'Anchor Steam' , 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/Uiol9p/upload_drOw0u-large.png'},
    {'id': 47942, 'name': 'Guinness Draught', 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/StkEiv/upload_etArOb-large.png'},
    {'id': 40135, 'name': 'Blue Moon Belgian White' , 'imgUrl': 'https://s3.amazonaws.com/brewerydbapi/beer/dDXOEp/upload_SZEtGz-large.png'}];
    res.send(testResponse);
  });

  app.post('/signup', function(req, res) {
    var params = {username: req.body.signup_username, password: req.body.signup_password};
    db.query('CREATE (n:User {username: ({username}), password: ({password}) })', params, function(err) {
      if (err) {console.log('error: ', err)}

      res.redirect //not sure how to handle redirects with the storyboard thing
    })
  })

  app.post('/login', 
    passport.authenticate('local'), 
    function(req, res) {
    res.redirect(); //normally this would be homepage plus the username in the url... not sure here)
  })

  app.get('/beer/:beername', function(req, res){
    var beername = req.params.beername;
    console.log("This is the beername: ", beername);
    db.getOneBeer(beername, function(beerObj){
      if(!beerObj){
        res.status(404).send("Beer not Found");
      }else{
        res.send(JSON.stringify(beerObj));
      }
    });
  });
};