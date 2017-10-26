var validation = require("../../validations");
var service = require("../../services");

module.exports = function (end_b, app, controller, authenticate, services, validations) {

  app.post(   end_b+'/hooks/jira/:hash', validation.hooks.check, controller.hooks.jiraTrigger);

}