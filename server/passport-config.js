var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://beeradvisor.cloudapp.net:7474/webadmin');
var LocalStrategy = require('passport-local').Strategy;

var passport = require('passport');

passport.use(new LocalStrategy(
  function(username, password, done){
    var params = {username: username, password: password};
    db.query('MATCH (n:User)\nWHERE n.username=({username})\nRETURN n',params, function(err, data){
      if(err){ return done(err)}
      if(!data){
        return done(null, false, { message: 'incorrect username' });
      }
      var user = data[0].n;
      if (password !== user._data.data.password){
        return done(null, false, {message: 'incorrect password'})
      }
      return done(null, user);
    })
  }
))

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var params = {id: id};
  db.query('MATCH (n:User)\nWHERE id(n)=({id})\nRETURN n',params, function(err, data) {
    if(err){ console.log(err); }
    var user = data[0].n;
    done(err, user);
  });
});

module.exports = passport;
