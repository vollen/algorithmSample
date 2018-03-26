var socket = new WebSocket("ws://127.0.0..1:12010:updates")
socket.onopen = function(){
    setInterval(function(){
        if (socket.bufferedAmount == 0 ){
            socket.send(getUpdateData());
        }
    })
};
socket.onmessage = function(event){
    console.log(event.data);
}

var count = 0;
function getUpdateData(){
    return "count : " + count ++;
}