namespace astar{
    export class GridCal{

    }

    export class GridCounter{
        private gridCnt:SparseArr<number> = {};
        private map:MapModel;
        private blockMap:SparseArr<number> = {};
        constructor(map:MapModel){
            this.map = map;
        }

        //目标点上有角色时, 计数 + 1;
        //目标点上有角色想来时, 计数 + 0.1;
        // 寻找目标点时， 不考虑 大于 0 的点
        // 在目标点停留时， 不考虑大于 1 的点
        public updateGridCnt(grid:MapGrid, change:number){
            this.gridCnt[grid.index] = (this.gridCnt[grid.index] || 0) + change;
        }

        public setGridTarget(grid:MapGrid){
            this.gridCnt[grid.index] = (this.gridCnt[grid.index] || 0) + 1;
        }

        public unsetGridTarget(grid:MapGrid){
            if(this.gridCnt[grid.index]){
                this.gridCnt[grid.index] -= 1;
            }
        }

        public isGridIdle(grid:MapGrid, max:number = 1){
            const num = this.gridCnt[grid.index];
            return !num || num <= max;
        }

        //根据起点，目标点， 查找周边空闲的点
        public getIdleGrid(grid:MapGrid, fromGrid:MapGrid, maxRoleCnt:number = 0, offset:number = 1){
            const dx = grid.col - fromGrid.col;
            const dy = grid.row - fromGrid.row;

            return this.getIdleByDir(grid, dx, dy, maxRoleCnt, offset) || this.getIdleByDir(grid, dx, -dy, maxRoleCnt, offset);
        }

        public setGridBlock(grid:MapGrid){
            this.blockMap[grid.index] = Game.serverTime + 5;
        }

        //从不同方向找空闲点
        private getIdleByDir(grid:MapGrid, dx:number, dy:number, maxRoleCnt:number, offset:number){
            const coffiX = dx > 0 ? -1 : 1;
            const coffiY = dy > 0 ? -1 : 1;

            let k = dx * dy > 0 ? -1 : 1;
            let row = grid.row, col = grid.col, index = grid.index;
            const colCnt = this.map.map.colCount;
            for(let i = 1; i < 3; i ++){
                const dRow = coffiY * (i - 1);
                const dCol = coffiX;
                const base = index + dRow * colCnt + dCol;
                let result = this.getIdleVertical(row + dRow, col + dCol, base, maxRoleCnt, offset, k);
                if(result){
                    return result;
                }
            }
        }

        //查找某一斜线上的空闲点
        private getIdleVertical(row:number, col:number, index:number, maxRoleCnt:number,  offset:number, k:number){
            let resultRow, resultIndex, resultCol;
            const colCnt = this.map.map.colCount;
            if(this.isIndexIdle(index, maxRoleCnt)){
                resultRow = row;
                resultCol = col;
                resultIndex = index;
            } else {
                for(let j = 1; j < offset + 1; j++){
                    let di = j * colCnt;
                    let diffCol = k * j;
                    if(this.isIndexIdle(index + di + diffCol, maxRoleCnt)){
                        resultRow = row + j;
                        resultCol = col + diffCol;
                        resultIndex = index + di + diffCol ;
                        break;
                    } else if(this.isIndexIdle(index - di - diffCol, maxRoleCnt)){
                        resultRow = row - j;
                        resultCol = col - diffCol;
                        resultIndex = index - di - diffCol;
                        break;
                    }
                }
            }

            if(resultRow){
                const result = new MapGrid;
                result.row = resultRow;
                result.col = resultCol;
                result.index = resultIndex;
                return result;
            }
        }

        private isIndexIdle(index:number, maxRoleCnt:number){
            if(this.blockMap[index]){
                const time = this.blockMap[index];
                if(Game.serverTime > time){
                    this.blockMap[index] = undefined;
                }
                return false;
            }
            const num = this.gridCnt[index];
            return (!num || num < maxRoleCnt) && !this.map.map.isBlockIndex(index);
        }
    }
}