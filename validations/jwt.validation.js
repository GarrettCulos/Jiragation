var env           = process.env.NODE_ENV || "development";
var config        = require('../config/config.json')[env];
var bcrypt        = require('bcryptjs');
var jwt           = require('jsonwebtoken');

// check header or url parameters or post parameters for token
exports.check = function(req, res, next){

  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.', err:err });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        return next();
      }
    });

  } else {
    return next();
  };
};