// This file starts our server, we defer to localhost:3000
// if a process port and url are not defined
var app = require('./server/server.js');
// var db = require('./server/dbConfig.js'); //only need for database update
var port = process.env.PORT || 3000;
var url = process.env.URL || 'localhost';

app.listen(port, url);

console.log('Listening on', url, ':', port);



// var http = require('http');
// var express = require('express');
// var path = require('path');
// var bodyParser = require('body-parser');
// var app = express();
// require('./routes.js')(app);


// app.set('port', process.env.PORT || 3000);


// //this tells Express to parse the incoming body data.  This will be called before other 
// //route handlers, to req.body can be passed directly to driver code as js object.
// app.use(bodyParser());

// //this tells press to use express.static middleware to serve files in response to incoming requests
// //maps local subfolder 'public' (which we don't have yet) to the base route '/'
// //'path' module creates a platform-independent subfolder string. 
// //anything in /public can now be accessed by name. 
// app.use(express.static(path.join(__dirname, 'public')));  
