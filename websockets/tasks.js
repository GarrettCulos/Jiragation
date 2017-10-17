exports.updateTasks = function(wss, req){
	wss.on('connection', function connection(ws, req) {
	  const location = url.parse(req.url, true);
	  // You might use location.query.access_token to authenticate or share sessions
	  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

	  ws.on('message', function incoming(message) {
	    console.log('received: %s', message);
	  });

	  ws.send('something');
	});	
}

exports.taskFiltersUpdate = function(ws, bundles){
	ws.on('message', function incoming(message) {
	    console.log('received: %s', message);
	});
};

exports.taskListUpdate = function(ws, bundles){
	ws.on('message', function incoming(message) {
	    console.log('received: %s', message);
	});
};
exports.activeTaskChange = function(wss, bundles, ws_bundle_id) {
	var i = 1;
	wss.clients.forEach(function each(ws) {
		
		if(ws['ws-bundle-id'] == ws_bundle_id){
			console.log(i)
			i++;
			ws.send(JSON.stringify({type:'updateActiveTask', data:"sending data... maybe... :S"}))
		}
    });
}