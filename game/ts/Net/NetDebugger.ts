/// <reference path="Net.ts" />

// /**
namespace Net{
    if(DEBUG){
    // Net.prototype[]
    Net["debug"] = function debug(prefix:string, msgId:number, obj:any){
        const msgName = ProtoEventType[msgId] || "";
        if(fliter(msgName)){
            console.log(prefix, msgName, obj);
        }
    };

    const debugList = [
        "",
    ];

    function fliter(msgName:string){
        msgName = msgName.toLowerCase();
        return debugList.some((str)=>{
            return (msgName.indexOf(str) !== -1);
        });
    }
    }
}
//*/