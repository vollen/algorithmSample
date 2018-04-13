
module astar {

	export interface IMapModel{
		/**
		 * 地图数据
		 * @return
		 *
		 */
		map:any;
		/**
		 * 初始化
		 *
		 */
		reset():void

		/**
		 * 保存Node
		 *
		 * @param v	键
		 * @param node
		 *
		 */
		setNode(v:any,node:TraversalNode):void

		/**
		 * 取出Node
		 *
		 * @param v	键
		 * @return
		 *
		 */
		getNode(v:any):TraversalNode

		/**
		 * 提供可遍历的节点
		 *
		 * 这里提供的是八方向移动
		 *
		 * @param p	当前节点
		 * @return
		 *
		 */
		getArounds(p:any) : Array<any>;


		/**
		 * 根据x,y,返回地图坐标
		 */
		getPos?: (x:number, y:number)=> any;

		/**
		 * 根据地图坐标, 返回 x,y
		 */
		getXY?:(pos:any)=>{x:number, y:number};

		/**
		 * 判断是否结束
		 *
		 * @param cur	当前节点
		 * @param end	终点
		 * @return 	是否相同的布尔值
		 *
		 */
		reachEnd(cur:any,end:any):boolean;

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
		getCostAddon(start:any,cur:any,next:any,end:any):number

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
		getScoreAddon(start:any,cur:any,next:any,end:any):number

		//指定格子是否可达
		reachable(target:any):boolean;
		//佛洛依德优化
		floyd(path:any[]):any[];
	}
}