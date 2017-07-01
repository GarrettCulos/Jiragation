var fs = require('fs');
var controllers = {};

fs.readdirSync(__dirname).forEach(function(file) {
  if (file == "index.js") return;
  var name = file.substr(0, file.indexOf('.'));
    // console.log(file)
  controllers[name] = require('./' + file);
});

module.exports = controllers;
