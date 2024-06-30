const http = require('http');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');

const url = require('url');

const server = http.createServer();
const wsServer = new WebSocketServer({server});
const port = 8000;

const connections = {};
const users = {};

const broadCast = () => {
    Object.keys(connections).forEach((uuid)=>{
        const connection = connections[uuid];
        const message = JSON.stringify(users);
        connection.send(message);
    })
}

//Message to the server when user moves cursor(x y)
const handleMessage = (bytes,uuid) => {
    const message = JSON.parse(bytes.toString());
    const user = users[uuid];

    user.state = message;

    broadCast();
    console.log(`${user.username} updated their state: ${JSON.stringify(user.state)}`);
}

const handleClose = ( uuid ) => {
    console.log(`${users[uuid].username} disconnected`)
    delete connections[uuid];
    delete users[uuid];
    //broadcast again for most up to date users
    broadCast()
}

//handshake(request) sending data(connection)
wsServer.on("connection",(connection,request) => {
    //For username existance in query(node)
   const {username} = url.parse(request.url, true).query;
   const uuid= uuidv4();
   console.log(username)
   console.log(uuid)

   connections[uuid] = connection;
   users[uuid] = {
    username:username,
    state: {  }
   }
   connection.on("message",message => handleMessage(message, uuid));
   connection.on("close",()=> handleClose(uuid));
})



server.listen(port,()=>{
    console.log(`websocket server is running on port ${port}`);
});