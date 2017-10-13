var validation=require("../../validations");
var service=require("../../services");

module.exports = function (end_b, app, contollers, authenticate, services, validations) {

  app.get( 	  end_b+'/logs/external', validation.jwt.check, contollers.logs.get_worklogs);
  app.post(   end_b+'/logs/log_time', validation.jwt.check, contollers.logs.post_log);
  app.get(    end_b+'/logs/:id', validation.jwt.check, contollers.logs.get_time_log);
  app.put(    end_b+'/logs/:id', validation.jwt.check, contollers.logs.update_time_log);
  app.delete( end_b+'/logs/:id', validation.jwt.check, contollers.logs.remove_time_log);
  app.get(    end_b+'/logs', validation.jwt.check, contollers.logs.get_time_log);
  
}