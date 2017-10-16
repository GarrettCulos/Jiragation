
exports.sendLog = function(req, res, next){
  console.log('sendLogs - ');
  req.wss.on('connection', function connection(ws, request) {
  console.log('sendLogs - trigger')

    var data = {
      type:'message',
      message:'taskUpdate'
    }

    ws.send(JSON.stringify({data:data}))
  });
}