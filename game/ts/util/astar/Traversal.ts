
module astar {

	export class Traversal{
		/**
		 * 最长限制步数
		 */
		public maxTry : number;

		/**
		 * 地图模型
		 */
		public mapModel : IMapModel;

		/**
		 * 开放列表
		 */
		public openList : Array<any>;

		public constructor(mapModel : IMapModel, maxTry : number = 5000){
			//AbstractUtil.preventConstructor(this,Traversal,"Traversal为抽象类，必须实现find方法！");

			this.mapModel = mapModel;
			this.maxTry = maxTry;
		}

		/**
		 * 计算两个坐标之间的路径
		 *
		 * @param startP	开始坐标
		 * @param endP	结束坐标
		 * @return	一个数组，为中间步骤的坐标
		 *
		 */
		public find(start:any, end:any) : Array<any>{
			//在这里添加遍历方法
			return null;
		}

		/**
		 * 加入开放列表
		 *
		 * @param p
		 * @param score
		 * @param cost
		 * @param parent
		 *
		 */
		public openNote(p : any, score : number, cost : number, parent : TraversalNode)  : void{
			var node:TraversalNode = new TraversalNode();
			node.point = p;
			node.score = score;
			node.cost = cost;
			node.parent = parent;

			this.mapModel.setNode(p,node);

			this.openList.push(node);
		}

		/**
		 * 加入关闭列表
		 * @param node
		 *
		 */
		public closeNote(node : TraversalNode) : void{
			node.noteOpen = false;
			node.noteClosed = true;
		}

		/**
		 * 获得返回路径
		 *
		 * @param start
		 * @param node
		 * @return
		 *
		 */
		public getPath(start:any, node:TraversalNode) : Array<any>{
			var arr : Array<any> = [];
			while (node){
				arr.push(node.point);
				node = node.parent;
			}
			return arr.reverse();
		}
	}
}