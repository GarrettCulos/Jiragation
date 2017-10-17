var validation=require("../../validations");
var service=require("../../services");

// console.log(validation.user.login)
module.exports = function (end_b, app, controller, authenticate, services, validations) {

  app.post(   end_b+'/accounts/:id/update', validation.jwt.check, controller.accounts.update);
  app.delete( end_b+'/accounts/:id/remove', validation.jwt.check, controller.accounts.remove);
  app.get(    end_b+'/accounts/:id/projects', validation.jwt.check, controller.accounts.get_projects);
  app.get(    end_b+'/accounts/:id', validation.jwt.check, controller.accounts.get);
  app.get(    end_b+'/accounts', validation.jwt.check, controller.accounts.get);
  app.post(   end_b+'/accounts', validation.jwt.check, controller.accounts.add);

}