var validation=require("../../validations");
var service=require("../../services");

module.exports = function (end_b, app, contollers, authenticate, services, validations) {

  app.get(    end_b+'/note/:log_id', validation.jwt.check, contollers.note.get);
  app.put(    end_b+'/note/:log_id', validation.jwt.check, contollers.note.update);
  app.delete( end_b+'/note/:log_id', validation.jwt.check, contollers.note.remove);
  app.post(   end_b+'/note', 		 validation.jwt.check, contollers.note.add);
  app.get(    end_b+'/note', 		 validation.jwt.check, contollers.note.get);
  
}