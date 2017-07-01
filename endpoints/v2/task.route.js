var validation=require("../../validations");
var service=require("../../services");

// console.log(validation.user.login)
module.exports = function (end_b, app, contollers, authenticate, services, validations) {

  app.post(   end_b+'/tasks', contollers.task.create);
  app.get(    end_b+'/tasks', contollers.task.get);
  app.post(   end_b+'/tasks/:id', contollers.task.update);
  app.get(    end_b+'/tasks/:id', contollers.task.get);

  app.put(    end_b+'/tasks/:id/time_log', contollers.task.add_time_log);
  app.get(    end_b+'/tasks/:id/time_log', contollers.task.get_time_log);
  app.delete( end_b+'/tasks/:id/time_log', contollers.task.remove_time_log);
  app.put(    end_b+'/tasks/:id/time_log', contollers.task.update_time_log);

  app.get(    end_b+'/tasks/:id/get_comments', contollers.task.get_comments);
  app.put(    end_b+'/tasks/:id/add_comment', contollers.task.add_comment);
  app.delete( end_b+'/tasks/:id/remove_comment', contollers.task.remove_comment);

  app.get(    end_b+'/tasks/:id/get_assets', contollers.task.get_assets);
  app.put(    end_b+'/tasks/:id/add_asset', contollers.task.add_asset);
  app.delete( end_b+'/tasks/:id/remove_asset', contollers.task.remove_asset);

}