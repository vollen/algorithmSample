namespace Net{
    export function send(obj: Proto.ProtoObjectC2S, showMask:boolean = true){
        if(!NetController.instance.socket.connected){ return;}
        NetController.instance.send(obj);
        if(showMask){
            ui.WaitPanel.sendMsg(obj["_msgId"]);
        }
    }

    export function onRecv(id:number){
        ui.WaitPanel.recvMsg(id);
    }

    export function debug(prefix:string, msdId:number, obj:any){
    }
}