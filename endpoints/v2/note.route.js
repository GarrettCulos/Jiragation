var validation=require("../../validations");
var service=require("../../services");

module.exports = function (end_b, app, contollers, authenticate, services, validations) {

  app.get(    end_b+'/note/:log_id', validation.jwt.check, contollers.notes.get);
  app.put(    end_b+'/note/:log_id', validation.jwt.check, contollers.notes.update);
  app.delete( end_b+'/note/:log_id', validation.jwt.check, contollers.notes.remove);
  app.post(   end_b+'/note', 		 validation.jwt.check, contollers.notes.add);
  app.get(    end_b+'/note', 		 validation.jwt.check, contollers.notes.get);
  
}