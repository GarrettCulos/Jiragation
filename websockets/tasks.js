
exports.taskFiltersUpdate = function(wss, ws_bundle_id, req_socket, data) {
	wss.clients.forEach(function each(ws) {
		if(ws['ws-bundle-id'] == ws_bundle_id && req_socket != ws._socket._peername.port){
			ws.send(JSON.stringify({type:'updateActiveTask', data:"trigger task filter update"}))
		}
    });
};


exports.taskListUpdate = function(wss, ws_bundle_id, data) {
	wss.clients.forEach(function each(ws) {
		if(ws['ws-bundle-id'] == ws_bundle_id){
			ws.send(JSON.stringify({type:'updateActiveTask', data:"trigger task list udpate"}))
		}
    });
};

exports.activeTaskChange = function(wss, ws_bundle_id, req_socket, data) {
	wss.clients.forEach(function each(ws) {
		// send message to clients with same user_id, but not the ws connection where the message came from.
		if(ws['ws-bundle-id'] == ws_bundle_id && req_socket != ws._socket._peername.port){
			// alternativly, query for active tasks. and send that as the response instead of sending data from client message.
			ws.send(JSON.stringify({type:'updateActiveTask', data:data}))
		}
    });
};
