
module astar {

	export class DFS extends Traversal{
		public constructor(mapModel:MapModel, maxTry:number=5000){
			super(mapModel, maxTry);
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
			this.openList = [];

			this.mapModel.reset();
			var curTry : number = 0;

			this.openNote(start, 0, 0, null);//建立首节点

			while (this.openList.length > 0){
				if (++curTry > this.maxTry)
					return null;

				var cur:TraversalNode = this.openList.pop();
				//获得最前的节点，并将它加入关闭列表
				this.closeNote(cur);

				var curPoint : any = cur.point;

				//如果到达终点
				if (this.mapModel.reachEnd(curPoint,end))
					return this.getPath(start, cur);

				var aroundNotes : Array<any> = this.mapModel.getArounds(cur.point);

				var length:number = aroundNotes.length;
				for(var i:number = 0;i < length;i++){
					var p : any = aroundNotes[i];
					var n:TraversalNode = this.mapModel.getNode(p);
					if (n && n.noteClosed)//在关闭列表中则跳过
						continue;

					//否则加入开放列表
					this.openNote(p, 0, 0, cur);
				}
			}
			return null;
		}
	}
}