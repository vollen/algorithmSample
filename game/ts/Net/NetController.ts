// TypeScript file

class NetController extends egret.EventDispatcher {
    private _socket: egret.WebSocket;
    private static _instance: NetController;
    private _data: egret.ByteArray;

    public static get instance() {
        if (this._instance === void 0) {
            console.log("new netcontroller")
            this._instance = new NetController();
        }
        return this._instance;
    }

    public get socket(): egret.WebSocket {
        return this._socket;
    }

    constructor() {
        super();
        this._data = new egret.ByteArray();
        this._socket = new egret.WebSocket();
        this._socket.type = egret.WebSocket.TYPE_BINARY;
        this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this._socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this._socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
    }

    public connect(host: string, port: number, path?:string, isSecurity?:boolean): void {
        const proto = isSecurity ? "wss://" :　"ws://";
        let socketServerUrl = proto + host + ":" + port;
        if(path){
            socketServerUrl += ("/" + path);
        }
        this._socket.connectByUrl(socketServerUrl);
    }

    private onSocketOpen(): void {
        console.log("WebSocketOpen");
        this.dispatchEventWith(egret.Event.CONNECT);
    }

    private onSocketClose(): void {
        console.log("WebSocketClose");
        this.dispatchEventWith(egret.Event.CLOSE);
    }

    private onSocketError(): void {
        console.log("WebSocketError");
        // this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
    }

    private onNewMsg() {
        // 直到分析完整个缓冲区
        while (this._data.length !== this._data.position) {
            let byteArray = new egret.ByteArray();
            let len = this
                ._data
                .readUnsignedShort();
            if (len > this._data.bytesAvailable) {
                console.log("数据长度不够")
                // 回退
                this._data.position = this._data.position - 2;
                break;
            }
            // 读取一个msg的数据进byteArray
            this
                ._data
                .readBytes(byteArray, 0, len);
            let index = byteArray.readUnsignedByte();
            if (index) {
                console.log("decrypt");
                byteArray = Proto.decrypt(index, byteArray);
            }
            let secId = byteArray.readUnsignedByte();
            let subId = byteArray.readUnsignedByte();
            let msgId = (secId << 8) + subId;
            const clazz = ProtoMsgId[msgId];
            if(clazz && clazz.decode){
                let obj = clazz.decode(byteArray);
                obj["_msgId"] = msgId;
                if(DEBUG){
                    Net.debug("recv", msgId, obj);
                }
                Net.onRecv(msgId);
                const eventType = ProtoEventType[msgId];
                ProtoHandler[ProtoSection[secId]]
                    .dispatchEventWith(ProtoEventS2C[eventType], false, obj);
            } else {
                console.error("unknown msg id: ", msgId);
            }
        }
    }

    // onReceiveMessage只负责将socket数据写入缓冲区，触发分析缓冲区事件
    private onReceiveMessage(e: egret.Event) {
        //    let byteArray  = new egret.ByteArray; this._data.position =
        // 当缓冲区全部分析完且长度大于一定值时清空缓冲
        if (this._data.length === this._data.position && this._data.length >= 1024) {
            this._data.clear();
        }
        // 从this._data末尾写入，并不会修改this._data 的position
        this
            ._socket
            .readBytes(this._data, this._data.length);
        this.onNewMsg();
    }

    public send(obj: Proto.ProtoObjectC2S) {
        if(DEBUG){
            Net.debug("send", obj["_msgId"], obj);
        }
        egret.callLater(this._doSend, this, obj);
    }

    private _doSend(obj:Proto.ProtoObjectC2S){
        this._socket.writeBytes(obj.encode());
    }
}