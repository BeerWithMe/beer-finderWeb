var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');

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
  app.use(express.static(__dirname + '/../app/'));
  require('./routes.js')(app);

}