var fs = require('fs');
var webSockets = {};

fs.readdirSync(__dirname).forEach(function(file) {
  if (file == "index.js") return;
  var name = file.substr(0, file.indexOf('.'));
  // console.log(file)
  webSockets[name] = require('./' + file);
});

module.exports = webSockets;
