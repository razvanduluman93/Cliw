var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/User.js');
var jwt = require('jwt-simple');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');

var app = express();
app.use(bodyParser.json());

app.use(passport.initialize());

passport.serializeUser(function(user, done) {
  done(null, user.id);
})

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  next();
}).options('*', function(req, res, next){
        res.end();
});

var strategyOptions = {
  usernameField: 'email'
}

var loginStrategy = new LocalStrategy(strategyOptions, function(email, password, done) {

  var searchUser = {
    email: email
  };

  User.findOne(searchUser, function(err, user) {
    if (err) return done(err);

    if (!user) return done(null, false, {
      message: 'Wrong email/password'
    });

    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);



      if (!isMatch)
        return done(
          null, false, {
            message: "Wrong email/password"
          });
      return done(null, user);
    });
  })
});

var registerStrategy = new LocalStrategy(strategyOptions, function(email, password, done) {

  var searchUser = {
    email: email
  };

  User.findOne(searchUser, function(err, user) {
    if (err) return done(err);

    if (user) return done(null, false, {
      message: 'Email already exists'
    })
  });

  var newUser = new User({
    email: email,
    password: password
  });

  newUser.save(function(err) {
    done(null, newUser);
  })
});

passport.use('local-register', registerStrategy);
passport.use('local-login', loginStrategy);

app.post('/register', passport.authenticate('local-register'), function(req, res) {
  createToken(req.user, res);
})

app.post('/login', passport.authenticate('local-login'),function(req, res){
    createToken(req.user, res);
})


function createToken(user, res) {
  var payload = {
    sub: user.id
  }

  var token = jwt.encode(payload, 'shhh..');
  res.status(200).send({
    user: user.toJSON(),
    token: token
  });



}




var coins = [
  'BitCoin',
  'LeitCoin',
  'FluffyCoin'
];



app.get('/converter', function(req, res) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'You are not authorized'
    });
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, "shhh..");

  if (!payload.sub) {
    res.status(401).send({
      message: 'Authentification failed'
    });
  }

  res.json(coins);
})

app.post('/auth/google', function(req, res) {
    var url = 'https://accounts.google.com/o/oauth2/token';
    var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

    var params = {
      client_id: req.body.clientId,
      redirect_uri: req.body.redirectUri,
      code: req.body.code,
      grant_type: 'authorization_code',
      client_secret: '5VSAdHnSgPe9xGAmL3gA1X72'
    };

    console.log(req.body.code);

    request.post(url, {
      json: true,
      form: params
    }, function(err, response, token) {
      var accessToken = token.access_token;

      var headers = {
        Authorization: 'Bearer ' + accessToken
      };

      request.get({
        url: apiUrl,
        headers: headers,
        json: true
      }, function(err, response, profile) {
        User.findOne({googleId: profile.sub}, function(err, foundUser){
            if(foundUser) return createToken(foundUser,res);
            
            var newUser = new User();
            newUser.googleId = profile.sub;
            newUser.displayName = profile.name;
            newUser.save(function(err){
                if (err) return next(err);
                createToken(newUser, res);
            })
        })
      });
    });
})

    mongoose.connect('mongodb://localhost/App');

    var server = app.listen(3000, function() {
      console.log("api listening on ", server.address().port);
    })
