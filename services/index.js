var fs = require('fs');
var services = {};

fs.readdirSync(__dirname).forEach(function(file) {
  if (file == "index.js") return;
  var name = file.substr(0, file.indexOf('.'));
  // console.log(file)
  services[name] = require('./' + file);
});

module.exports = services;
