var validation=require("../../validations");
var service=require("../../services");

module.exports = function (end_b, app, contollers, authenticate, services, validations) {

  app.get(    end_b+'/logs', validation.jwt.check, contollers.logs.get_time_log);
  app.post(   end_b+'/logs/log_time', validation.jwt.check, contollers.logs.post_log);
  
}