var bcrypt        = require('bcrypt');
var jwt           = require('jsonwebtoken');
var config        = require('config').get('server');

// check header or url parameters or post parameters for token
module.exports = function(req, res, next){

	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	// decode token
	if (token) {
	  // verifies secret and checks exp
	  jwt.verify(token, config.get('secret'), function(err, decoded) {      
	    if (err) {
	      return res.json({ success: false, message: 'Failed to authenticate token.' });    
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
