class ObjectPool {
    private static _instance: ObjectPool;

    public static get instance(): ObjectPool {
        return this._instance || (this._instance = new ObjectPool);
    }

    constructor() {
        this._pool = {};
    }

    private _pool:Object;

    public getObject(classz:Function): any {
        const document_class = classz.prototype.__class__;
        var result;
        var arr = this._pool[document_class];
        if (arr && arr.length) {
            result = arr.pop();
        } else {
            result = new (egret.getDefinitionByName(document_class))();
            result.key = document_class;
        }

        return result;
    }

    public disposeObject(obj: any) {
        var key:string = obj.key;
        if (!this._pool[key]) {
            this._pool[key] = [];
        }

        this._pool[key].push(obj);
    }

    public clearObject(classz:Function){
        const document_class = classz.prototype.__class__;
        delete this._pool[document_class];
    }
}