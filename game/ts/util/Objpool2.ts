namespace utils{
    //可以手动添加对象入池
    export class ObjectPool<T extends any>{
        private _pool:T[];
        private classz:new()=>T;

        constructor(classz:new()=>T) {
            this.classz = classz;
            this._pool = [];
        }

        public get(){
            let obj:T;
            if(this._pool.length > 0){
                obj = this._pool.pop();
            } else {
                obj = new this.classz();
            }

            return obj;
        }

        public dispose(obj:T){
            if(obj.clear) {
                obj.clear();
            }

            this._pool.push(obj);
        }
    }

    //会缓存已分配的对象
    export class CachedPool<T extends any> extends ObjectPool<T>{
        private _list:T[];
        constructor(classz:new()=>T) {
            super(classz);
            this._list = [];
        }

        public get(){
            const obj = super.get();
            this._list.push(obj);
            return obj;
        }

        public dispose(obj:T){
            super.dispose(obj);
            const index = this._list.indexOf(obj);
            if(index !== -1){
                this._list.splice(index, 1);
            }
        }

        public disposeAll(){
            const list = this._list;
            this._list = [];
            list.forEach(v=>{
                super.dispose(v);
            });
        }
    }
}