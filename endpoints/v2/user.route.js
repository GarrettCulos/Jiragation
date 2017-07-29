var validation=require("../../validations");
var service=require("../../services");

module.exports = function (end_b, app, controllers, authenticate, services, validations) {

  app.post( 	end_b+'/user', controllers.user.create);
  app.put(  	end_b+'/user/login', controllers.user.login);
  app.put(  	end_b+'/user/logout',validation.jwt.check, controllers.user.logout);
  app.put( 		end_b+'/user/:id', controllers.user.update);
  app.get(  	end_b+'/user', validation.jwt.check, controllers.user.get);
  app.get(  	end_b+'/user/:id', validation.jwt.check, controllers.user.get);
  app.delete(  	end_b+'/user/:id', validation.jwt.check, controllers.user.remove);

}