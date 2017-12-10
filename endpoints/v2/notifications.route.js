var validation=require("../../validations");
var service=require("../../services");

module.exports = function (end_b, app, contollers, authenticate, services, validations) {

  app.put(    end_b+'/notifications/:notice_id', 	validation.jwt.check, contollers.notifications.update);
  app.get(    end_b+'/notifications/:task_id',		validation.jwt.check, contollers.notifications.get);  
  app.get(    end_b+'/notifications',				validation.jwt.check, contollers.notifications.get);  
  
}