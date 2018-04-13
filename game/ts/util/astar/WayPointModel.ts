
module astar {

	export class WayPointModel implements IMapModel{
		/**
		 * 位置数据（每个数据对应的坐标）
		 */
		public points : Array<any>;

		/**
		 * 连接数据（二维数组，表示每个数据之间的距离，为负则表示未连接）
		 */
		public wayMap : Array<any>;

		public constructor(wayMap:Array<any> = null){
			//if (points)
				//this.points = points;

			if (wayMap)
				this.wayMap = wayMap;
		}

		private noteMap : Array<any>;//node缓存
		private _map:Array<any>;

		/**
		 * 地图数据
		 */
		public get map():Array<any>{
			return this._map;
		}

		public set map(value:Array<any>){
			this._map = value;
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
		public setNode(v:any,node:TraversalNode):void{
			this.noteMap[v] = node;
		}

		/**
		 * 取出Node
		 *
		 * @param v	键
		 * @return
		 *
		 */
		public getNode(v:any):TraversalNode{
			return this.noteMap[v];
		}


		/**
		 * 判断两个节点是否相同
		 *
		 * @param p1	节点1
		 * @param p2	节点2
		 * @return 	是否相同的布尔值
		 *
		 */
		public reachEnd(cur:any,end:any):boolean{
			return cur == end;
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
		public getScoreAddon(start:any,cur:any,next:any,end:any):number{
			return this.wayMap[cur][next];
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
		public getCostAddon(start:any,cur:any,next:any,end:any):number{
//			var endPoint:Point = points[end];
//			var curPoint:Point = points[cur];
//			var nextPoint:Point = points[next];
//
//			return Point.distance(nextPoint,endPoint) - Point.distance(curPoint,endPoint);
			return 10;
		}

		/**
		 * 提供可遍历的节点
		 *
		 *
		 * @param v	当前节点
		 * @return
		 *
		 */
		public getArounds(v:any) : Array<any>{
			var result : Array<any> = [];
			var curWayMap : Array<any> = this.wayMap[v];

			for (var i : number = 0;i < curWayMap.length;i++){
				if (v != i && curWayMap[i] > 0)
					result.push(i);
			}
			return result;
		}

		public reachable(target:number):boolean{
			return true;
		}

		public floyd(path:any[]):any[]{
			return path;
		}


		public toString():string{
			var r:string = "";
			for (var j:number = 0;j < this.wayMap.length;j++){
				for (var i:number = 0;i < this.wayMap.length;i++){
					r += this.wayMap[i][j] ? "0" : "1"
				}
				r+="\n";
			}
			return r;
		}
	}
}