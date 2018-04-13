namespace check {
    export interface ICheckCondiNode {
        setKeyFlag(key: number, flag: boolean): boolean;
        condiKeyColl: SparseArr<boolean>;
    }

    export function normalizeLvl(lvl: number = 0, transfer: number = 0, star: number = 0) {
        return lvl + transfer * 100 + star;
    }

    export class CondiMgr {
        private static _instance: CondiMgr;
        public static clear() {
            this._instance = undefined;
        }
        public static get instance(): CondiMgr {
            if (this._instance === void 0) {
                this._instance = new CondiMgr;
            }
            return this._instance;
        }

        public nodes: SparseArr<CondiNode> = {};
        public bindCondiNode(node: ICheckCondiNode, classz: typeof CondiNode, need: number, data?: number) {
            let key = classz.getKey(data);
            if (need !== -1) {
                const cNode = this.getNode(classz, data);
                this.markNode(node, key, true);
                return cNode.addNode(node, need);
            } else {
                this.markNode(node, key, false);
                return false;
            }
        }

        private markNode(node: ICheckCondiNode, key: number, flag: boolean) {
            let keys = node.condiKeyColl;
            //之前注册过， 先移除
            if (keys && keys[key]) {
                const cNode = this.nodes[key];
                cNode.addNode(node, -1);
            }

            if (flag) {
                if (!keys) {
                    keys = node.condiKeyColl = Object.create(null);
                }
                keys[key] = true;
            } else if (keys) {
                delete keys[key];
            }
        }

        public clearNeed(node: ICheckCondiNode) {
            const keys = node.condiKeyColl;
            if (keys) {
                for (let key in keys) {
                    const cNode = this.nodes[key];
                    cNode.addNode(node, -1);
                }
                node.condiKeyColl = undefined;
            }
        }

        private getNode(classz: typeof CondiNode, data?: number) {
            const key = classz.getKey(data);
            let node = this.nodes[key];
            if (!node) {
                node = new (<any>classz)();
                node.init(data);
                this.nodes[key] = node;
            }
            return node;
        }
    }

    export abstract class CondiNode {
        protected key: number;
        protected bin: notify.WatcherBin;
        private nodeList: ICheckCondiNode[] = [];
        private needList: number[] = [];
        private affordIndex: number = -1;
        protected lastNum: number = 0;
        private lock: boolean = false;
        private tmpNodeList: ICheckCondiNode[] = [];
        private tmpNeedList: number[] = [];

        public init(data?: number) {
            const classz = (<any>this).__proto__.constructor as typeof CondiNode;
            this.key = classz.getKey(data);
            this.bin = new notify.WatcherBin(this.onCondiChange, this);
            Game.notifier.watch(this.key, this.bin);
            this.lastNum = this.getNum();
        }

        public getKey() {
            return this.key;
        }

        public static getKey(data?: any): number {
            return undefined;
        }

        protected abstract getNum(): number;
        public addNode(node: ICheckCondiNode, num: number): boolean {
            if (this.lock) {
                this.tmpNodeList.push(node);
                this.tmpNeedList.push(num);
            } else {
                this.doChange(node, num);
            }
            return num <= this.lastNum;
        }

        private doChange(node: ICheckCondiNode, num: number) {
            const isDel = num === -1;
            if (isDel) {
                const index = this.nodeList.indexOf(node);
                num = this.needList[index];
                this.nodeList.splice(index, 1);
                this.needList.splice(index, 1);
            } else {
                const index = this.getIndex(num);
                this.nodeList.splice(index, 0, node);
                this.needList.splice(index, 0, num);
            }

            if (num <= this.lastNum) {
                this.affordIndex += isDel ? -1 : 1;
            }
        }

        public clear() {
            Game.notifier.removeBin(this.bin);
        }

        protected onCondiChange() {
            const curNum = this.getNum();
            const lastNum = this.lastNum;
            this.lastNum = curNum;

            const needList = this.needList;
            const nodeList = this.nodeList;
            const key = this.key;

            this.lock = true;
            if (lastNum > curNum) {
                for (let i = this.affordIndex; i >= 0; i--) {
                    if (needList[i] <= curNum) {
                        break;
                    }
                    nodeList[i].setKeyFlag(key, false);
                    this.affordIndex = i - 1;
                }
            } else {
                for (let i = this.affordIndex + 1, cnt = nodeList.length; i < cnt; i++) {
                    if (needList[i] > curNum) {
                        break;
                    }
                    nodeList[i].setKeyFlag(key, true);
                    this.affordIndex = i;
                }
            }
            this.lock = false;

            if (this.tmpNodeList.length > 0) {
                for (let i = 0, l = this.tmpNeedList.length; i < l; i++) {
                    this.doChange(this.tmpNodeList[i], this.tmpNeedList[i]);
                }
                this.tmpNodeList = [];
                this.tmpNeedList = [];
            }
        }

        protected getIndex(num: number) {
            return utils.binarySearch(this.needList, num, this.compareNum);
        }
        private compareNum(a: number, b: number) {
            return a > b ? 1 : -1;
        }
    }

    export class CondiGoods extends CondiNode {
        private goodsId: number;
        public init(data: number) {
            this.goodsId = data;
            super.init(data);
        }

        public static getKey(id: number) {
            return notify.keyGoods(id);
        }

        protected getNum(): number {
            return mod.Bag.getGoodsNum(this.goodsId);
        }
    }

}