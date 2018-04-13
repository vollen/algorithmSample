namespace check{
    export const INTER_CHANGE = "inner_change";
    export class CheckBase extends egret.EventDispatcher{
        private _count:number = 0;
        private changeFlag:boolean;
        public autoClear:boolean;
        public isTypeNew:boolean;

        public get count(){
            return this.$getCount();
        }

        private $getCount(){
            return this._count;
        }

        public set count(num:number){
            if(num === this._count){ return;}
            this.$setCount(num);
        }

        private $setCount(num:number){
            const diff = num - this._count;
            this._count = num;
            this.sendChangeNum(diff);
        }

        private sendChangeNum(diff:number){
            this.dispatchEventWith(INTER_CHANGE, false, diff);
            if(!this.changeFlag){
                egret.callLater(this.onCountChange, this);
                this.changeFlag = true;
            }
        }

        protected onCountChange(){
            this.changeFlag = false;
            this.dispatchEventWith(egret.Event.CHANGE, false, this);
        }

        public clear(){
            this.count = 0;
            notify.clear(this);
            if(this._baseCondiNode){
                this._baseCondiNode.clear();
                this._baseCondiNode = undefined;
            }
        }

        private _baseCondiNode:CheckBase;
        protected get baseCondiNode(): CheckBase {
            return this._baseCondiNode;
        }

        protected set baseCondiNode(value: CheckBase) {
            if(this._baseCondiNode){
                this._baseCondiNode.removeEventListener(INTER_CHANGE, this.onBaseCondiChanged, this);
                this._baseCondiNode.clear();
                this.sendBaseChange();
            }
            const pre = this._baseCondiNode ? this._baseCondiNode.count : 1;
            this._baseCondiNode = value;
            if(value){
                this.$getCount = this.$getCountWithBaseCondi.bind(this);
                this.$setCount = this.$setCountWithBaseCondi.bind(this);
                value.addEventListener(INTER_CHANGE, this.onBaseCondiChanged, this);
            }

            const cur = value ? value.count : 1;
            if(pre * cur <= 0){
                this.sendBaseChange();
            }
        }

        private onBaseCondiChanged(event:egret.Event){
            const diff = event.data as number;
            const count = this._baseCondiNode.count;
            const pre = count - diff;
            if(count * pre <= 0){
                this.sendBaseChange();
            }
        }

        private sendBaseChange(){
            const baseCount = this._baseCondiNode.count;
            this._count = this.$getRealCount();
            const diff = baseCount > 0 ? this._count : -this._count;
            this.sendChangeNum(diff);
        }

        private $getCountWithBaseCondi(){
            return (!this._baseCondiNode || this._baseCondiNode.count > 0) ? this._count : 0;
        }

        private $setCountWithBaseCondi(num:number){
            if(!this._baseCondiNode || this._baseCondiNode.count > 0 ){
                CheckBase.prototype.$setCount.call(this, num);
            } else {
                this._count = num;
            }
        }

        protected $getRealCount(){
            return this._count;
        }
    }

    export class CheckGroup extends CheckBase{
        private _children:SparseArr<CheckBase> = {};
        public addChild(key:string|number, child:CheckBase){
            this.delChildAt(key);
            if(!child){ return;}
            this._children[key] = child;
            this.updateCount(child.count);
            child.addEventListener(INTER_CHANGE, this.onChildCountUpdate, this);
        }

        public delChildAt(key:string|number){
            const child = this._children[key];
            if(child){
                this.updateCount(-child.count);
                child.removeEventListener(INTER_CHANGE, this.onChildCountUpdate, this);
                delete this._children[key];
            }
        }

        public getChild(...params:(number|string)[]){
            let ret:CheckBase = this;
            for(let i =0; i < params.length; i++){
                if(ret instanceof CheckGroup){
                    ret = ret._children[params[i]];
                } else{
                    return undefined;
                }
            }
            return ret;
        }

        public clear(clearChildren?:boolean){
            super.clear();
            this.removeAllChildren(clearChildren);
        }

        public removeAllChildren(clearChildren:boolean = false){
            if(clearChildren){
                for(let k in this._children){
                    const child = this._children[k];
                    child.clear();
                }
            } else {
                for(let k in this._children){
                    const child = this._children[k];
                    child.removeEventListener(INTER_CHANGE, this.onChildCountUpdate, this);
                }
            }
            this.count = 0;
            this._children = [];
        }

        protected get children(){
            return this._children;
        }

        private onChildCountUpdate(event:egret.Event){
            this.count += event.data;
        }

        private updateCount(num:number){
            this.count += num;
        }

        protected $getRealCount(){
            let count = 0;
            for(let k in this._children){
                count += this._children[k].count;
            }
            return count;
        }
    }

    export class CheckNode extends CheckBase{
        private result:number = 0;
        protected indexes:number = 0;
        protected addWatcher(index:number){
            const bits = (1 << index);
            this.result |= bits;
            this.indexes |= bits;
            this.count = 0;
        }

        protected removeWatcher(index:number){
            const bits = ~(1 << index);
            this.indexes &= bits;
            this.result &= bits;
        }

        public clear(){
            super.clear();
            this.resetWatcher();
        }

        public resetWatcher(){
            this.indexes = 0;
            this.result = 0;
            this.count = 0;
        }

        protected updateCount(index:number, flag:boolean){
            const old = this.result;
            let bits = 1 << index;
            if(flag){
                this.result &= ~bits;
            } else {
                this.result |= bits;
            }
            if(!old !== !this.result){
                this.count = this.result ? 0 : 1;
            }
        }
    }

    //配置格式
    export interface ConfigData{
        key?:string;
        class?:any;
        start?:number;
        num?:number;
        children?:ConfigData[];
    }

    //根据配置对象， 解析检查树
    export function parseNodes(config:ConfigData, ...params:any[]){
        const classz = config.class || CheckGroup;
        const cnt = config.num || 1;
        let start = config.start || 0;
        const nodes = [];
        for(let i = 0; i< cnt; i++){
            if(cnt > 1){
                params.push(start);
                start ++;
            }
            const node = new classz(...params);
            const children = config.children;
            if(children){
                children.forEach(subConfig=>{
                    const nodes = parseNodes(subConfig, ...params);
                    addNodes(node, nodes, subConfig.key, subConfig.start);
                });
            }
            params.pop();
            nodes.push(node);
        }
        return nodes;
    }

    export function addNodes(group:CheckGroup, nodes:CheckBase[], key:string, start:number = 0){
        if(nodes.length > 1){
            let index = start;
            nodes.forEach((node, i)=>{
                group.addChild(getKey(key, index), node);
                index ++;
            });
        } else {
            group.addChild(key, nodes.pop());
        }
    }

    export function safeGetChild(root:CheckBase, ...params:(string|number)[]){
        if(!root){ return undefined;}
        if(root instanceof CheckGroup) {
            return root.getChild(...params);
        }
        return undefined;
    }
}