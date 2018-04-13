class Ticker {
    private lastTime: number = 0;
    private accTime: number = 0;
    private tickerList: TickBin[] = [];
    private static _instance: Ticker = new Ticker;
    private _timer: number = 0;
    private _ticking: boolean = false;

    public static get instance() {
        return this._instance;
    }

    public init(){
        this.accTime = 1 / egret.MainContext.instance.stage.frameRate;
        this.startTick();
        if(this.tickerList){
            this.tickerList.forEach(bin=>{
                TickContainer.doRemove(bin.thisObj, bin.tick);
            });
        }
        this.tickerList = [];
    }

    public startTick() {
        if(this._ticking){ return;}
        this._ticking = true;
        this.lastTime = egret.getTimer();
        // this.accTime = 0;
        // egret.startTick(this.tick, this);
        // UI.instance.addEventListener(egret.Event.ENTER_FRAME, this.tick, this);
        egret.callLater(this.tick, this);
    }

    public stopTick() {
        if(!this._ticking){ return;}
        this._ticking = false;
        // UI.instance.removeEventListener(egret.Event.ENTER_FRAME, this.tick, this);
        // egret.stopTick(this.tick, this);
    }

    public rgTick(func: Function, obj: any) {
        const bin: TickBin = TickContainer.add(obj, func);
        if (bin.isInit) {
            this.tickerList.push(bin);
            bin.isInit = false;
        }
    }

    public rmTick(func: Function, obj: any) {
        TickContainer.remove(obj, func);
    }

    public setTargetPause(obj: any, flag: boolean) {
        const list = this.tickerList;
        for(let i = 0, l = list.length; i < l; i++){
            if (list[i].thisObj === obj) {
                list[i].pause = flag;
            }
        }
    }

    protected tick(timeStamp: number): boolean {
        if(!this._ticking){ return;}
        timeStamp = egret.getTimer();
        this.accTime = (timeStamp - this.lastTime) / 1000;
        this.lastTime = timeStamp;
        // for(let i = 0; i < 10; i++){
        try{
            this.doTick(timeStamp);
        } catch(e){
            // Log.onError("ontick error", undefined, 0, 0, e);
            console.error("ontick err:", e);
        }
        // }

        egret.callLater(this.tick, this);
        return false;
    }
    private doTick(timeStamp: number) {
        // this.accTime = timeStamp -  this.lastTime;
        this._timer += this.accTime;

        const list = this.tickerList;
        for(let i = 0, l = list.length; i < l; i++){
            const bin = list[i];
            if(bin.toDel){
                this.tickerList.splice(i, 1);
                TickContainer.doRemove(bin.thisObj, bin.tick);
                i--; l--;
            } else if(!bin.pause){
                bin.tick.call(bin.thisObj, this.accTime);
            }
        }
        return false;
    }

    public get timer() {
        return this._timer;
    }
}

class TickTimer extends egret.EventDispatcher{
    private timer:number;
    private delay:number;
    private loop:number;
    constructor(delay:number, loop:number = 0){
        super();
        this.timer = 0;
        this.delay = delay;
        this.loop = loop;
        Ticker.instance.rgTick(this.update, this);
    }

    public stop(){
        Ticker.instance.rmTick(this.update, this);
    }

    private update(dt:number){
        this.timer += dt;
        if(this.timer >= this.delay){
            this.timer -= this.delay;
            if(this.loop > 0){
                this.loop --;
                if(this.loop === 0){
                    Ticker.instance.rmTick(this.update, this);
                    this.dispatchEventWith(egret.TimerEvent.TIMER_COMPLETE, false, this);
                }
            }
            this.dispatchEventWith(egret.TimerEvent.TIMER, false, this);
        }
    }
}

class TickBin {
    toDel: boolean = false;
    pause: boolean = false;
    isInit: boolean = false;
    tick: Function = undefined;
    thisObj: any = undefined;
}

interface TickContainer {
    tickList: TickBin[];
}
class TickContainer {
    public static add(obj: TickContainer, func: Function) {
        const curIndex = this.indexOf(obj, func);
        let tickbin: TickBin;
        if (curIndex !== -1) {
            tickbin = obj.tickList[curIndex];
        } else {
            tickbin = ObjectPool.instance.getObject(TickBin);
            tickbin.tick = func;
            tickbin.thisObj = obj;

            obj.tickList = obj.tickList || [];
            obj.tickList.push(tickbin);
            tickbin.isInit = true;
        }
        tickbin.toDel = false;
        tickbin.pause = false;
        return tickbin;
    }

    public static remove(obj: TickContainer, func: Function) {
        const curIndex = this.indexOf(obj, func);
        if (curIndex !== -1) {
            const bin = obj.tickList[curIndex];
            bin.toDel = true;
        }
    }

    public static doRemove(obj: TickContainer, func: Function) {
        const curIndex = this.indexOf(obj, func);
        if (curIndex !== -1) {
            const bin = obj.tickList[curIndex];
            bin.tick = undefined;
            bin.thisObj = undefined;
            obj.tickList.splice(curIndex, 1);
            ObjectPool.instance.disposeObject(bin);
        }
    }

    private static indexOf(obj: TickContainer, func: Function) {
        const list: TickBin[] = obj.tickList;
        if (list) {
            for(let i = 0, l = list.length; i < l; i++){
                if(list[i].tick === func){
                    return i;
                }
            }
        }
        return -1;
    }
}