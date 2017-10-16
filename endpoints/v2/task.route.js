var web_socks = require("../../websockets");
var validation=require("../../validations");
var service=require("../../services");

module.exports = function (end_b, app, contollers, authenticate, services, validations, wss) {

  app.get(    end_b+'/tasks/:id', validation.jwt.check, contollers.task.getTask);
  app.post(   end_b+'/tasks/:id', validation.jwt.check, contollers.task.update);
  app.post(   end_b+'/tasks', validation.jwt.check, contollers.task.create);
  app.get(    end_b+'/tasks', validation.jwt.check, contollers.task.get);

  // app.put(    end_b+'/tasks/:id/time_log', validation.jwt.check, contollers.task.add_time_log);
  app.post(   end_b+'/tasks/:id/udpateTracking', validation.jwt.check, contollers.task.updateTracking, web_socks.logs.sendLog);
  // app.get(    end_b+'/tasks/:id/time_log', validation.jwt.check, contollers.task.get_time_log);
  // app.delete( end_b+'/tasks/:id/time_log', validation.jwt.check, contollers.task.remove_time_log);
  // app.put(    end_b+'/tasks/:id/time_log', validation.jwt.check, contollers.task.update_time_log);

  app.get(    end_b+'/tasks/:id/task_log', validation.jwt.check, contollers.task.get_task_time_log);
  app.get(    end_b+'/tasks/:id/task_log/:startTime', validation.jwt.check, contollers.task.get_task_time_log,  web_socks.logs.sendLog);
  app.get(    end_b+'/tasks/:id/task_log/:startTime/:endTime', validation.jwt.check, contollers.task.get_task_time_log);
  
  
  app.get(    end_b+'/tasks/:id/comments', validation.jwt.check, contollers.task.get_comments);
  app.post(   end_b+'/tasks/:id/comment', validation.jwt.check, contollers.task.add_comment);
  app.delete( end_b+'/tasks/:id/remove_comment', validation.jwt.check, contollers.task.remove_comment);
  
  app.get(    end_b+'/tasks/:id/attachments', validation.jwt.check, contollers.task.get_attachments);

  // to do, update  /tasks/:id/attachments to use the below /get_assets endoint
  app.get(    end_b+'/tasks/:id/get_assets', validation.jwt.check, contollers.task.get_assets);
  app.put(    end_b+'/tasks/:id/add_asset', validation.jwt.check, contollers.task.add_asset);
  app.delete( end_b+'/tasks/:id/remove_asset', validation.jwt.check, contollers.task.remove_asset);

}