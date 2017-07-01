var validation=require("../../validations");
var service=require("../../services");

// console.log(validation.user.login)
module.exports = function (end_b, app, controller, authenticate, services, validations) {
	
  app.get(    end_b+'/accounts', validations.jwt.check, controller.accounts.get);
  app.post(   end_b+'/accounts', validations.jwt.check, controller.accounts.add);
  app.get(    end_b+'/accounts/:id', validations.jwt.check, controller.accounts.get);
  app.delete( end_b+'/accounts/:id/remove', validations.jwt.check, controller.accounts.remove);
  app.get(    end_b+'/accounts/:id/projects', validations.jwt.check, controller.accounts.get_projects);

}