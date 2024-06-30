const http = require('http');
const { WebSocketServer } = require('ws');

const server = http.createServer();
const webServer = new WebSocketServer({server});
const port = 8000;



server.listen(port,()=>{
    console.log(`websocket server is running on port ${port}`);
});