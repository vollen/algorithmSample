var http = require("http");
var crypto = require("crypto");

var server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': " text/plain"});
    res.end("Hello World\n");
})

server.listen(12010);

var protocol = "chat";
server.on("upgrade", function(res, socket, upgradeHead){
    var head = new Buffer(upgradeHead.length);
    upgradeHead.copy(head);
    var key = req.headers['sec-websocket-key'];
    var shasum = crypto.createHash("sha1");
    key = shasum.update(key + "258EAFA5-E914-47DA-95CA-C5ABoDC85B11").digest("base64");
    var headers = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: WebSocket",
        "Connection: Upgrade",
        "Sec-WebSocket-Accepet:" + key,
        "Sec-WebSocket-Protocol:" + protocol
    ];
    socket.setNoDelay(true);
    socket.write(headers.concat("", "").join("\r\n"));

    var websocket = new WebSocket();
    websocket.setSocket(socket);
})