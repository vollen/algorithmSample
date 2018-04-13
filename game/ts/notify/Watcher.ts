namespace notify{
    class Watcher{
        private watchers:WatcherBin[];

        public watch(key:number, func:Function, thisObj:any){
            if(!this.watchers){this.watchers = [];}
            let bin:WatcherBin = Watcher.prototype.getBin.call(this, func, thisObj);
            if(!bin){
                bin = new WatcherBin(func, thisObj);
                this.watchers.push(bin);
            }
            if(!bin.isKeyExist(key)){
                Game.notifier.watch(key, bin);
            }
        }

        public unwatch(key:number, func:Function, thisObj:any){
            const bin = Watcher.prototype.getBin.call(this, func, thisObj);
            if (bin && bin.isKeyExist(key)){
                Game.notifier.unwatch(key, bin);
            }
        }

        public clear(){
            if(!this.watchers){return;}
            this.watchers.forEach(bin=>{
                Game.notifier.removeBin(bin);
            });
            this.watchers = undefined;
        }

        private getBin(func:Function, thisObj:any){
            if(!this.watchers){return;}
            let result:WatcherBin;
            this.watchers.every(bin=>{
                if (func === bin.func && thisObj === bin.thisObj){
                    result = bin;
                }
                return result === undefined;
            });
            return result;
        }
    }

    export class WatcherBin{
        private $notifyTime:number;
        private $func:Function;
        private $thisObj:any;
        private $keys:number[] = [];
        private $toDelKeys:SparseArr<boolean> = {};

        constructor(func:Function, thisObj:any){
            this.$func = func;
            this.$thisObj = thisObj;
        }

        public notify(key:number){
            try{
                this.$func.call(this.$thisObj, key);
            } catch(e){
                console.error(e);
            }
        }

        public addKey(key:number){
            delete this.$toDelKeys[key];
            this.$keys.push(key);
        }

        public markKeyDelete(key:number){
            this.$toDelKeys[key] = true;
        }

        public delKey(key:number){
            delete this.$toDelKeys[key];
            const index = this.$keys.indexOf(key);
            this.$keys.splice(index, 1);
        }

        public isKeyDetete(key:number):boolean{
            return this.$toDelKeys[key];
        }

        public isKeyExist(key:number){
            return this.$keys.indexOf(key) !== -1 && !this.$toDelKeys[key];
        }

        public get toDelKeys(){
            return this.$toDelKeys;
        }

        public getKeys(){
            return this.$keys;
        }

        public get func(){
            return this.$func;
        }

        public get thisObj(){
            return this.$thisObj;
        }

        public get notifyTime(): number {
            return this.$notifyTime;
        }

        public set notifyTime(value: number) {
            this.$notifyTime = value;
        }
    }

    function autoClear(){
        clear(this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, autoClear, this);
    }

    //导出事件监听函数
    export function watch(target:any, key:number, func:Function){
        if(target instanceof egret.DisplayObject){
            target.addEventListener(egret.Event.REMOVED_FROM_STAGE, autoClear, target);
        }
        Watcher.prototype.watch.call(target, key, func, target);
    }

    export function unwatch(target:any, key:number, func:Function){
        Watcher.prototype.unwatch.call(target, key, func, target);
    }

    export function clear(target:any){
        Watcher.prototype.clear.call(target);
    }
}