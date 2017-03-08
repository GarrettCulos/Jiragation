var express       = require('express');
var api           = express.Router();
var User          = require('../models/users');
var bcrypt        = require('bcrypt');
var jwt           = require('jsonwebtoken');
var config        = require('config').get('server');

function sign_in(u, callback){

  User.getUser(u.user_name, function(err, user) {

    if (err) throw err;

    if (!user) {
      // res.json({ success: false, message: 'Authentication failed. User not found.' });
      return callback({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (!bcrypt.compareSync(u.password, user.password)) {
        // res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        return callback({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, config.get('secret'), {
          expiresIn: 1440*60 // expires in 24 hours
        });

        // return the information including token as JSON
        // res.json({ success: true, message: 'Successful login', token: token });
        callback({
          success: true,
          message: 'Successful login',
          token: token
        });
      }   
    }
  });
}

api.post('/authenticate', function(req, res) {
  // find the user
  sign_in(req.body, function(response){
    if(response.success){
      res.send(response);
    }
    else{
      res.status(401).send(response.message);
    }
  });
});

api.post('/udpateUser',function(req, res, next){
  User.update(req.body,function(error, response){
    console.log(error);
    if(error){
      res.status(400).send(error);
    }else{
      req.body.password = req.body.passwordConfirm
      delete req.body.passwordConfirm
      res.send(req.body);
    }
  });
});

api.post('/addUser',function(req, res, next){
  User.add(req.body,function(error, response){
    console.log(error);
    if(error){
      res.status(400).send(error);
    }else{
      req.body.password = req.body.passwordConfirm
      delete req.body.passwordConfirm
      res.send(req.body);
    }
  });
});

api.get('/tokenCheck', function(req,res,next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  jwt.verify(token,config.get('secret'),function(err, decoded) {
    if(err) res.status(401).send(false);
    res.send(decoded);
  });
});

module.exports.api = api;