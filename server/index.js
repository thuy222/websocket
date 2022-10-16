const webSocketsServerPort = 8000; // define websocket sever port
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(webSocketsServerPort); // listen 
console.log('listening on port 8000');


const wsServer = new webSocketServer({
    httpServer: server
  });

  const clients = {};


  // This code generates unique userid for everyuser.
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
  };
  
  wsServer.on('request', function (request) { // define what should happen if server recieve request
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  
    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin); // create a new connection
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));
  
    connection.on('message', function(message) { // will be trigger when sever receive any message
      if (message.type === 'utf8') {
        console.log('Received Message: ', message.utf8Data);
  
        // broadcasting message to all connected clients
        for(key in clients) {
          clients[key].sendUTF(message.utf8Data);
          console.log('sent Message to: ', clients[key]);
        }
      }
    })
  });