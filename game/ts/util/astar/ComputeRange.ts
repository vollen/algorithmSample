// TypeScript file
namespace astar {
    export class ComputeRange {
        private rangeX: number;
        private rangeY: number;
        private rangeW: number;
        private rangeH: number;
        private posCnt: number;
        private curMax: number;
        private posColCnt: number;
        private _posList: number[] = [];
        public mapModel: astar.MapModel;
        private rePosTimes: number = 0;

        public getRobotEnemyPos() {
            const count = this.curMax;
            this.curMax--;
            if (this.curMax === 0) {
                this.curMax = this.posCnt;
            }

            const random = utils.random(count);
            const posIndex = this._posList[random] || random;
            this._posList[posIndex] = count;

            const col = posIndex % this.posColCnt;
            const row = (posIndex - col) / this.posColCnt;

            let x = this.rangeX + col * 50 + utils.random(50);
            let y = this.rangeY + row * 50 + utils.random(50);

            if (this.mapModel) {
                const grid = this.mapModel.getPos(x, y);
                if (this.rePosTimes > this.posCnt) {
                    x = this.rangeX + this.rangeW / 2;
                    y = this.rangeY + this.rangeH / 2;
                } else if (this.mapModel.map.isBlock(grid)) {
                    this.rePosTimes++;
                    return this.getRobotEnemyPos();
                }

                this.rePosTimes = 0;
            }
            return { x: x, y: y };
        }

        public setRange(x: number, y: number, width: number, height: number, mapModel?: astar.MapModel) {
            const rowCnt = Math.ceil(height / 30);
            const colCnt = Math.ceil(width / 30);
            this.posColCnt = colCnt;
            this.posCnt = rowCnt * colCnt;
            this.rangeX = x;
            this.rangeY = y;
            this.rangeW = width;
            this.rangeH = height;
            this.mapModel = mapModel;
            this.curMax = this.posCnt;
        }

        public get posList() {
            return this._posList;
        }
    }
}