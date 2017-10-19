var env           = process.env.NODE_ENV || "development";
var config        = require('../config/config.json')[env];

// check header or url parameters or post parameters for token
exports.check = function(req, res, next){

  var hash = req.params.hash;
  
  if (hash) {
    // verifies hash is associated with an account.
    var queryString = "SELECT ";
      queryString += " ja.id as account_id , ";
      queryString += " ja.user_name as user_name , ";
      queryString += " ja.url as url,";
      queryString += " ja.protocal as protocal, ";
      queryString += " ja.basic_auth as basic_auth, ";
      queryString += " ja.account_email as account_email ";
      queryString += " FROM jira_accounts ja ";
      queryString += " WHERE ja.hook_hash =`"+hash+"`";
  
    sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
        console.log(results[0])

        // if everything is good, save to request for use in controllers
        if(results[0].length > 0){
          
          req.account = results;
          return next();  

        }
        else {

          return res.status(401).json({ message: 'Failed to authenticate.' });

        }
        
    }).catch(function(err){

        return res.status(401).json({ message: 'Failed to authenticate.' });

    });

  } 
  else {

    console.error('Unauthorized hook request')
    return res.status(401).json({ message: 'Failed to authenticate.' });

  };

};