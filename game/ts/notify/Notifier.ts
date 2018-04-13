namespace notify{
    export class Notifier{
        private _watchers:TypedCollection<WatcherBin[]>;
        private _dirty:boolean;
        private _dirtyList:number[];
        private _keyNotifyTime:TypedCollection<number>;
        private _toDel:WatcherBin[];
        private _toAdd:WatcherBin[];

        constructor(){
            this._watchers = {};
            this._dirty = false;
            this._dirtyList = [];
            this._keyNotifyTime = {};
            this._toAdd = [];
            this._toDel = [];
            Ticker.instance.rgTick(this.tick, this);
        }

        public notify(key:number, data?:any){
            if(data !== undefined){
                this.callWatchers(key, data);
                return;
            };

            if (this._keyNotifyTime[key] === Ticker.instance.timer){
                return;
            }
            this._keyNotifyTime[key] = Ticker.instance.timer;

            this._dirty = true;
            this._dirtyList.push(key);
        }

        public watch(key:number, bin:WatcherBin){
            let list = this._watchers[key];
            if (! list){
                list = [];
                this._watchers[key] = list;
            }
            list.push(bin);
            bin.addKey(key);
        }

        public unwatch(key:number, bin:WatcherBin){
            bin.markKeyDelete(key);
            this._toDel.push(bin);
            this._dirty = true;
        }

        public removeBin(bin:WatcherBin){
            bin.getKeys().forEach(key=>{
                bin.markKeyDelete(key);
            });
            this._toDel.push(bin);
            this._dirty = true;
        }

        private callWatchers(key:number, data:any){
            const list = this._watchers[key];
            if(list){
                list.forEach(v=>{
                    if(v.isKeyDetete(key)){ return;}
                    v.func.call(v.thisObj, data);
                });
            }
        }

        private tick(dt:number){
            if(!this._dirty){
                return;
            }

            if(this._toDel.length > 0){
                this._toDel.forEach(bin=>{
                    const keys = bin.toDelKeys;
                    for(let key in keys){
                        const list = this._watchers[key];
                        if(list){
                            const index = list.indexOf(bin);
                            if (index !== -1){
                                bin.delKey(+key);
                                list.splice(index, 1);
                            }
                        }
                    }
                });
                this._toDel = [];
            }

            const time = Ticker.instance.timer;
            this._dirtyList.forEach(key=>{
                const list = this._watchers[key];
                if (list){
                    list.forEach(bin=>{
                        if(bin.isKeyDetete(key) || bin.notifyTime === time){return;}
                        bin.notifyTime = time;
                        bin.notify(key);
                    });
                }
            });
            this._dirtyList = [];
            this._dirty = false;
        }
    }
}
