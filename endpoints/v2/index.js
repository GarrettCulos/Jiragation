var fs = require('fs');

module.exports = function(endpoint_base, app, controllers, authenticate, service, validation, wss) {
  fs.readdirSync(__dirname).forEach(function(file) {
    if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js') return;
    var name = file.substr(0, file.indexOf('.'));
    // console.log(name)
           
    require('./'+file)(endpoint_base, app, controllers, authenticate, service, validation, wss);
  });
      
}