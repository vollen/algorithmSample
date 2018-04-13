module astar {
	export class ComposeMapModel extends MapModel{
        constructor(){
            super();
            this.map = new utils.MapTerrainData;
        }

        //暂时只支持格子大小相同的地图拼接
        public addMapData(map:utils.MapTerrainData, x:number, y:number){
            // this.map.gridW = map.gridW;
            // this.map.gridH = map.gridH;

            // const grid = this.getPos(x, y);
            // let row = grid.row;
            // for(let i = 0; i < map.rowCount; i++){
            //     let rowData = this.map.terrains[row];
            //     if(!rowData){
            //         rowData = [];
            //         this.map.terrains[row] = rowData;
            //     }
            //     let col = grid.col;
            //     for(let j = 0; j < map.colCount; j++){
            //         rowData[col] = map.terrains[i][j];
            //         col ++;
            //     }
            //     row ++;
            // }

            // const rowMax = grid.row +　map.rowCount;
            // const colMax = grid.col +　map.colCount;
            // if(rowMax > this.map.rowCount){
            //     this.map.rowCount = rowMax;
            // }
            // if(colMax > this.map.colCount){
            //     this.map.colCount = colMax;
            // }

            // const xMax = x + map.width;
            // const yMax = y + map.height;
            // if(xMax > this.map.width){
            //     this.map.width = xMax;
            // }
            // if(yMax > this.map.height){
            //     this.map.height = yMax;
            // }
        }
    }
}