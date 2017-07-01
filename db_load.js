var fs = require('fs');

var file_path = './db/';
var data = [];

fs.readdir(file_path,function(err,files){
    if(err){ 
    	throw err
    } else {;
	    files
	    .filter(function(file) { return file.substr(-5) === '.json'; })
		.forEach(function(file){
			// console.log(file);
			var jsonObj = JSON.parse(fs.readFileSync(file_path+file, 'utf8'))
			data.push(jsonObj.data);
		});
	}
})

module.exports.data = data;	