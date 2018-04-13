class Log {
    public static debug:boolean = false;
    public static info(str: string, ...params:any[]): void {
        if (!Log.enableDebug) {return;}

        var kFormatStr: string = Math.floor(Ticker.instance.timer) + "[Log]:" + StringUtils.format(str, ...params);
        // console.info(kFormatStr);
    }

    public static Warn(str: string, ...params:any[]): void {
        if (!Log.enableDebug) {return;}

        var kFormatStr: string = Math.floor(Ticker.instance.timer) + "[Warn]:" + StringUtils.format(str, ...params);
        // console.warn(kFormatStr);
    }

    public static Error(str: string, ...params:any[]): void {
        if (!Log.enableDebug) {return;}

        var kFormatStr: string = Math.floor(Ticker.instance.timer) + "[Err]:" + StringUtils.format(str, ...params);
        console.error(kFormatStr);
        alert(kFormatStr);
    }

    private static get INNER_ENV():boolean{
        return this.debug || LEO_PARTNER && LEO_PARTNER.toLowerCase() === "dev" && LEO_CHANNEL === 0;
    }
    private static get enableDebug(): boolean{
        return this.INNER_ENV;
    };

    public static get enableConsoleLog(): boolean{
        return this.INNER_ENV;
    }

    public static get enableGm():boolean{
        return this.INNER_ENV;
    }

    public static rewrite(originFunc, originThis){
        return function(...params){
            if(Log.enableDebug){
                return originFunc.apply(originThis || window, params);
            } else {
                return false;
            }
        };
    }

    public static onError(msg, url, line, col, error){
        // alert("系统出错啦，问题已经上报，请耐心等待程序员哥哥们解决");
        if(error && error instanceof Error){
            msg = error.stack;
        }

        if(msg.toLowerCase().indexOf('script error') !== -1){
            const xhr = new XMLHttpRequest();
            const acc = mod.Acc && mod.Acc.acc;
            const accName = acc ? "openId=" + acc.openID + ", sid=" + acc.sid : "openId=undefined";
            xhr.open('GET', 'https://dev.sqh5.7road.net/leo-bugfree?' + accName + ", stack=" + msg, true);
            xhr.send(null);
        }
        console.error(msg);
        return false;
    }
}

// window.onerror = Log.onError;
window.alert = function(msg){
    ui.misc.info(msg);
};
if(!Log.enableConsoleLog){
    console.log = Log.rewrite(console.log, console);
    console.info = Log.rewrite(console.info, console);
    console.warn = Log.rewrite(console.warn, console);

    document.onkeydown = function (event) {
        const code = event.keyCode;
        if (code !== 116 && (code >= 112 && code <= 123)){
            (<any>event).keyCode = 0;
            event.returnValue = false;
        }
    };
    window["onhelp"] = function () {
        return false;
    };
    document.oncontextmenu = function () {
        window.event.returnValue = false;
        return false;
    };
}