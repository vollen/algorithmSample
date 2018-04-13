namespace check {
    export class CheckCondiNode extends CheckNode implements ICheckCondiNode {
        private _keyIndex: SparseArr<number> = {};
        private _curIndex: number = 0;
        public condiKeyColl = undefined;
        public resetWatcher() {
            super.resetWatcher();
            this._keyIndex = {};
            this._curIndex = 0;
            CondiMgr.instance.clearNeed(this);
        }

          //
        protected setTimeNeed(time: number) {
            this.setCondi(CondiTime, time);
        }



        protected setCondi(classz: typeof CondiNode, need: number, data?: any) {
            let valid;
            if (need) {
                valid = true;
            } else {
                valid = false;
                need = -1;
            }
            const key = classz.getKey(data);
            const afford = CondiMgr.instance.bindCondiNode(this, classz, need, data);
            this.setKey(key, valid, afford);
        }

        protected setBaseCondition(flag: boolean) {
            this.setKey(notify.KEY.KEY_CNT, true, flag);
        }

        private setKey(key: number, valid: boolean, afford: boolean) {
            if (valid) {
                this.addKey(key);
                this.setKeyFlag(key, afford);
            } else {
                this.delKey(key);
            }
        }

        private addKey(key: number) {
            if (this._keyIndex[key] !== undefined) {
                return;
            }
            const index = this.getCurIndex();
            this._keyIndex[key] = index;
            this._curIndex = index;
            this.addWatcher(index);
        }

        private delKey(key: number) {
            const index = this._keyIndex[key];
            if (index !== undefined) {
                this.removeWatcher(index);
                this._keyIndex[key] = undefined;
            }
        }

        private getCurIndex(): number {
            let index: number = this._curIndex;
            let mask: number = 1 << index;
            let indexes = this.indexes;
            while (mask & indexes) {
                index++;
                if (index > 31) {
                    mask = 1;
                    index = 0;
                } else {
                    mask <<= 1;
                }
            }
            return index;
        }

        /**
         * 设置结点监听的消息是否满足
         * @param key  监听的消息Id
         * @param flag 满足标记
         * @return: 监听是否有效
         */
        public setKeyFlag(key: number, flag: boolean): boolean {
            const index = this._keyIndex[key];
            if (index === undefined) {
                return false;
            }
            this.updateCount(index, flag);
            return true;
        }
    }
}