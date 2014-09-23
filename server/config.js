var bodyParser = require('body-parser');
var session = require('express-session');


module.exports = function(app,express){
  // Inject all middleware dependencies that will
  // be used in all routes
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(session({
    secret: 'beer',
    resave: true,
    saveUninitialized: true
  }))
  // app.use(express.static(__dirname + '/../../client'));
  require('./routes.js')(app);

}