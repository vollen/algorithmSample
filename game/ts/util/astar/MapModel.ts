
module astar {
	export class MapGrid{
		public row:number = 0;
		public col:number = 0;
		public index:number = 0;
	}

	export class MapModel implements IMapModel{
		private COST_STRAIGHT : number = 10;//水平分值
		private COST_DIAGONAL : number = 14;//斜向分值
		private static _gridPool:utils.ObjectPool<MapGrid> = new utils.ObjectPool(MapGrid);
		private sideIndexes:number[];
		private sideRowChange:number[][];
		private diagonalIndexes:number[];
		private diagonalRowChange:number[][];

		public static get gridPool(){
			return this._gridPool;
		}

		/**
		 * 是否启用斜向移动
		 */
		public diagonal:boolean = true;
		private noteMap : Array<any> = undefined;//node缓存
		private _map:utils.MapTerrainData = undefined;
		private _counter:GridCounter;

		public constructor(map?:utils.MapTerrainData){
			this.map = map;
			this._counter = new GridCounter(this);
		}


		public get counter(){
			return this._counter;
		}

		/**
		 * 地图数据
		 */
		public get map(): utils.MapTerrainData {
			return this._map;
		}


		public set map(value: utils.MapTerrainData) {
			this._map = value;
			if(value){
				const colCount = value.colCount;
				this.sideIndexes = [1, -1, colCount, -colCount];
				this.sideRowChange = [[0, 1], [0, -1], [1, 0], [-1, 0]];
				this.diagonalIndexes = [colCount + 1, colCount -1, -colCount + 1, -colCount - 1];
				this.diagonalRowChange = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
			}
		}

		/**
		 * 初始化
		 *
		 */
		public reset():void{
			this.noteMap = [];
		}

		/**
		 * 保存Node
		 *
		 * @param v	键
		 * @param node
		 *
		 */
		public setNode(grid:MapGrid,node:TraversalNode):void{
			this.noteMap[grid.index] = node;
		}

		/**
		 * 取出Node
		 *
		 * @param v	键
		 * @return
		 *
		 */
		public getNode(grid:MapGrid):TraversalNode{
			return this.noteMap[grid.index];
		}


		/**
		 * 判断是否到达终点
		 *
		 * @param p1	节点1
		 * @param p2	节点2
		 * @return 	是否相同的布尔值
		 *
		 */
		public reachEnd(cur:MapGrid,end:MapGrid):boolean{
			return cur.index === end.index;
		}

		/**
		 * 获得Cost对于父节点Cost的加值
		 *
		 * @param start	首节点
		 * @param cur	父节点
		 * @param next	当前节点
		 * @param end	终点
		 * @return
		 *
		 */
		public getCostAddon(start:MapGrid,cur:MapGrid,next:MapGrid,end:MapGrid):number{
			return (next.col === cur.col || next.row === cur.row) ? this.COST_STRAIGHT : this.COST_DIAGONAL;
		}

		/**
		 * 获得Score对于Cost的加值
		 *
		 * @param start	首节点
		 * @param cur	父节点
		 * @param next	当前节点
		 * @param end	终点
		 * @return
		 *
		 */
		public getScoreAddon(start:MapGrid,cur:MapGrid,next:MapGrid,end:MapGrid):number{
			return (Math.abs(end.row - next.row) + Math.abs(end.col - next.col)) * this.COST_STRAIGHT;
		}

		/**
		 * 提供可遍历的节点
		 *
		 * 这里提供的是八方向移动
		 *
		 * @param p	当前节点
		 * @return
		 *
		 */
		public getArounds(point:MapGrid) : Array<MapGrid>{
			var result : Array<MapGrid> = [];

			const row = point.row, col = point.col, index = point.index;
			const indexes = this.sideIndexes;
			const terrins = this.map.terrains;
			for(let i = 0, l = indexes.length; i < l; i++){
				let tmpIndex = index + indexes[i];
				if(terrins[tmpIndex] !== utils.TERRAIN_TYPE.BLOCK){
					const change = this.sideRowChange[i];
					result.push({row: row + change[0], col :col + change[1], index : tmpIndex});
				}
			}

			if (this.diagonal){
				const diagonalIndexes = this.diagonalIndexes;
				for(let i = 0, l = indexes.length; i < l; i++){
					let tmpIndex = index + diagonalIndexes[i];
					if(terrins[tmpIndex] !== utils.TERRAIN_TYPE.BLOCK){
						const change = this.diagonalRowChange[i];
						result.push({row: row + change[0], col :col + change[1], index : tmpIndex});
					}
				}
			}
			return result;
		}

		/**
		 * 转换为位图显示
		 * @param source
		 * @return
		 *
		 */
		public toBitmap():egret.Bitmap{
           // var bitmap: egret.Bitmap = new egret.Bitmap(new BitmapData(this._map[0].length, this._map.length))
            var bitmap: egret.Bitmap = new egret.Bitmap();
			//for (var j:number = 0;j < this._map.length;j++){
			//	for (var i:number = 0;i < this._map[j].length;i++){
		//			if (this._map[j][i])
		//				bitmap.bitmapData.setPixel(i,j,0x0);
		//		}
		//	}
			return bitmap;
		}

		public getPos(x:number, y:number, grid?:MapGrid): MapGrid{
			return this.map.getGridByPos(x, y, grid);
		}

		public getXY(pos:MapGrid):{x:number, y:number}{
			return this.map.getPosByGrid(pos);
		}

		public reachable(target:MapGrid):boolean{
			return !this.map.isBlock(target);
		}

		public floyd(path:MapGrid[]):MapGrid[]{
			let count = path.length;
			if(count <= 2){ return path; }

			let p1 = path[count - 1];
			let p2 = path[count - 2];
			let dRow = p1.row - p2.row;
			let dCol = p1.col - p2.col;

			let p3, dRow2, dCol2;
			for(let i = count - 3; i >= 0; i--){
				p3 = path[i];
				dRow2 = p2.row - p3.row;
				dCol2 = p2.col - p3.col;
				if(dRow === dRow2 && dCol === dCol2){
					path.splice(i + 1, 1);
				}
				dRow = dRow2;
				dCol = dCol2;
				p1 = p2;
				p2 = p3;
			}

			count = path.length;
			if(count <= 2){ return path; }

			p1 = path[count - 1];
			p2 = path[count - 2];
			for(let i = count - 3; i >= 0; i--){
				p3 = path[i];
				if(this.isGridReachable(p1, p3)){
					path.splice(i + 1, 1);
				} else {
					p1 = p2;
				}
				p2 = p3;
			}
			return path;
		}

		public isGridReachable(gridA:MapGrid, gridB:MapGrid){
			const dRow = gridA.row - gridB.row;
			const dCol = gridA.col - gridB.col;
			let index = gridA.index;
			let start, end, delta, indexChange1, indexChange2;
			let indexChangeRow = this.map.colCount;
			let indexChangeCol = 1;

			let key1, key2;
			if(Math.abs(dRow) > Math.abs(dCol)){
				key1 = "row";
				key2 = "col";
				indexChange1 = indexChangeRow;
				indexChange2 = indexChangeCol;
			} else {
				key1 = "col";
				key2 = "row";
				indexChange1 = indexChangeCol;
				indexChange2 = indexChangeRow;
			}

			if(gridA[key1] > gridB[key1]){
				start = gridB;
				end = gridA;
			} else {
				start = gridA;
				end = gridB;
			}
			if(gridA[key2] < gridB[key2]){
				indexChange2 = - indexChange2;
			}

			index = start.index;
			let startI = start[key1];
			let endI = end[key1];
			delta = (start[key2] - end[key2]) / (startI - endI);

			let value2 = start[key2];
			let value22 = value2;
			var map = this.map;
			for(let i = startI; i < endI; i ++){
				value22 += delta;
				index += indexChange1;
				if(Math.floor(value22) !== value2){
					index += indexChange2;
					value2 = Math.floor(value22);
				}
				if(map.isBlockIndex(index)){
					return false;
				}
			}
			return true;
		}
	}
}