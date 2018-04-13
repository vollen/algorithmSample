namespace utils {
    const _datas: TypedCollection<MapTerrainData> = {};
    const _errorRes: TypedCollection<boolean> = {};
    export class MapTerrainLoader extends egret.EventDispatcher {

        public static TERRAIN_DATA = "terrain_data";
        public loadFile(path) {
            if (_errorRes[path]) {
                this.dispatchEventWith(MapTerrainLoader.TERRAIN_DATA, false, undefined);
                return;
            }
            const url = path;
            // RES.getResAsync(url, (data)=>{this.parserData(path, data);}, this);
            if (_datas[path]) {
                this.dispatchEventWith(MapTerrainLoader.TERRAIN_DATA, false, _datas[path]);
            } else {
                RES.getResAsync(url, (data) => { this.parserData(path, data); }, this);
            }
        }

        private parserData(path: string, buffer: ArrayBuffer) {
            if (buffer === undefined) {
                _errorRes[path] = true;
                this.dispatchEventWith(MapTerrainLoader.TERRAIN_DATA, false, undefined);
                return;
            }
            const terrainData = new MapTerrainData();
            terrainData.path = path;
            terrainData.fromBuffer(buffer);
            _datas[path] = terrainData;
            this.dispatchEventWith(MapTerrainLoader.TERRAIN_DATA, false, terrainData);
        }
    }

    export class MapTerrainData {
        public path: string;
        public width: number = 0;
        public height: number = 0;
        public gridW: number = 1;
        public gridH: number = 1;
        public terrains: number[] = [];
        public colCount: number = 0;
        public rowCount: number = 0;
        private topOffset: number = 0;

        public fromBuffer(buffer: ArrayBuffer) {
            const data = new egret.ByteArray(buffer);
            data.endian = egret.Endian.LITTLE_ENDIAN;
            this.width = data.readUnsignedShort();
            this.height = data.readUnsignedShort();
            this.gridW = data.readUnsignedShort();
            this.gridH = data.readUnsignedShort();
            const colCount = Math.ceil(this.width / this.gridW);
            const rowCount = Math.ceil(this.height / this.gridH);
            this.topOffset = rowCount * this.gridH - this.height;
            this.colCount = colCount + 2;
            this.rowCount = rowCount + 2;

            const gridCnt = data.readUnsignedShort();

            let index = (this.rowCount - 1) * this.colCount;
            let terrains: number[] = [];
            for(let i =0; i <this.colCount; i++){
                terrains[index++] = TERRAIN_TYPE.BLOCK;
                terrains[i] = TERRAIN_TYPE.BLOCK;
            }
            let colIndex = 0;
            for (let i = 0; i < gridCnt; i += 4) {
                let n = data.readUnsignedByte();
                for (let j = 0; j < 4 && i + j < gridCnt; j ++ ) {
                    colIndex ++;
                    if (colIndex === 1) {
                        index -= 2 * this.colCount;
                        terrains[index++] = TERRAIN_TYPE.BLOCK;
                        colIndex ++;
                    }
                    const type = n % 4;
                    n = (n - type) / 4;
                    terrains[index++] = type;
                    if(colIndex + 1 === this.colCount){
                        colIndex = 0;
                        terrains[index++] = TERRAIN_TYPE.BLOCK;
                    }
                }
            }

            this.terrains = terrains;
        }

        public getGridByPos(x: number, y: number, grid?:astar.MapGrid) {
            const col = Math.floor(x / this.gridW) + 1;
             const row = Math.max(0, Math.floor((y + this.topOffset) / this.gridH)) + 1;
            if(!grid){
                grid = new astar.MapGrid();
            }
            grid.row = row;
            grid.col = col;
            grid.index = row * this.colCount + col;
            return grid;
        }

        public getGridIndex(row:number, col:number){
            return row * this.colCount + col;
        }

        public getPosByGrid(grid:astar.MapGrid, point?:egret.Point) {
            if(!point){
                point = new egret.Point();
            }
            point.x = (grid.col - 0.5) * this.gridW;
            point.y = (grid.row - 0.5) * this.gridH - this.topOffset;
            return point;
        }

        //是否透视
        public isShield(grid:astar.MapGrid) {
            return this.terrains[grid.index] === TERRAIN_TYPE.PERSEPECT;
        }

        public isBlock(grid: astar.MapGrid) {
            return this.terrains[grid.index] === TERRAIN_TYPE.BLOCK;
        }

        public isBlockIndex(index:number){
            return this.terrains[index] === TERRAIN_TYPE.BLOCK;
        }
    }

    export const enum TERRAIN_TYPE {
        NULL = 0,
        BLOCK = 1,
        PERSEPECT = 2,
    }
}