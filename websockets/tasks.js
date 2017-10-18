
exports.udpateTaskFilters = function(ws, bundles){
	wss.clients.forEach(function each(ws) {
		if(ws['ws-bundle-id'] == ws_bundle_id){
			ws.send(JSON.stringify({type:'updateActiveTask', data:"trigger task filter update"}))
		}
    });
};


exports.updateTaskList = function(ws, bundles){
	wss.clients.forEach(function each(ws) {
		if(ws['ws-bundle-id'] == ws_bundle_id){
			ws.send(JSON.stringify({type:'updateActiveTask', data:"trigger task list udpate"}))
		}
    });
};

exports.activeTaskChange = function(wss, bundles, ws_bundle_id) {
	wss.clients.forEach(function each(ws) {
		if(ws['ws-bundle-id'] == ws_bundle_id){
			ws.send(JSON.stringify({type:'updateActiveTask', data:"active task change update"}))
		}
    });
};
