import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log(wss);


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

wss.broadcast = function broadcast(msg) {
    console.log(msg);
    wss.clients.forEach(function each(client) {
        client.send(msg);
     });
};
wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    let obj = {};
    try {
      obj = JSON.parse(data);
    } catch(e) {
      console.log(e);
      console.log("Using empty object");
      obj = {cmd: "nocmd"};
    }
    switch(obj.cmd) {
        case 'login':
            ws.uname = obj.name;
            ws.color = getRandomColor();
            ws.send(JSON.stringify({name: 'Server', msg: `Welcome to the Server, ${ws.uname}!`,color: ws.color, time: Date.now(), uname: ws.uname}));
            break;
        case 'msg':
                wss.broadcast(JSON.stringify({name: ws.uname, color: ws.color, msg: obj.msg, time: Date.now()}));
            break;
    }
  });
});