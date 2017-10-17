
// parse message
exports.message = function( ws, req){
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
}

// parse message
exports.connect = function( ws, req){
  // console.log( '', req.connection );
  console.log( 'ws connected - ip:', req.connection.remoteAddress );
}

exports.connectionHeartbeat = function(wss){
  function heartbeat() {
    this.isAlive = true;
  }

  wss.on('connection', function connection(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
  });

  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping('', false, true);
      ws.send(JSON.stringify({type:'message', message:ws._socket._peername}))
    });
  }, 10000);
}