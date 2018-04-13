module astar {
	export class AStar extends Traversal{
		public heapOpenList : BinaryHeap;//开放列表，为二叉堆，将自动排序
		private static nodePool:utils.CachedPool<TraversalNode> = new utils.CachedPool(TraversalNode);

		public constructor(mapModel : IMapModel, maxTry : number = 5000){
			super(mapModel,maxTry);
		}

		/** @inheritDoc*/
		public find(start:any, end:any) : Array<any>{
			const mapModel = this.mapModel;
			if(!mapModel.reachable(end)){
				return null;
			}

			this.heapOpenList = new BinaryHeap();
			this.heapOpenList.sortMetord = this.sortMetord;
			mapModel.reset();
			var curTry : number = 0;

			this.openNote(start, 0, 0, null);//建立首节点

			while (this.heapOpenList.length > 0){
				if (++curTry > this.maxTry){
					return null;
				}

				var cur:TraversalNode = this.heapOpenList.shift();
				//获得最前的节点，并将它加入关闭列表
				this.closeNote(cur);

				var curPoint : any = cur.point;

				//如果到达终点
				if (mapModel.reachEnd(curPoint,end)){
					mapModel.reset();
					let path = this.getPath(start, cur);
					path = mapModel.floyd(path);
					AStar.nodePool.disposeAll();
					return path;
				}

				var aroundNotes : Array<any> = mapModel.getArounds(cur.point);
				var length:number = aroundNotes.length;
				for(var i:number = 0;i < length;i++){
					var p : any = aroundNotes[i];
					var n:TraversalNode = mapModel.getNode(p);
					if (n && n.noteClosed){//在关闭列表中则跳过
						continue;
					}
					//计算F和G值
					var cost : number = cur.cost + mapModel.getCostAddon(start,cur.point,p,end);
					// var cost : number = cur.cost + 10;
					var score : number = cost + mapModel.getScoreAddon(start,cur.point,p,end);
                    if (n && n.noteOpen) { //如果节点已在开放列表中
						//如果新的G值比节点原来的G值小,修改F,G值，重新排序
						if (cost < n.cost){
							n.cost = cost;
							n.score = score;
							n.parent = cur;
							this.heapOpenList.modify(n);
						}
					}
					else	//否则加入开放列表
                    {
                        this.openNote(p, score, cost, cur);
                    }
				}
			}

			mapModel.reset();
			AStar.nodePool.disposeAll();
			return null;
		}

		/** @inheritDoc*/
		public openNote(p : any, score : number, cost : number, parent : astar.TraversalNode)  : void{
            var node:astar.TraversalNode = AStar.nodePool.get();
			node.point = p;
			node.score = score;
			node.cost = cost;
			node.parent = parent;
			node.noteOpen = true;

			this.mapModel.setNode(p,node);
			this.heapOpenList.push(node);
		}

		//分值排序方法
		private sortMetord(n1:astar.TraversalNode, n2:astar.TraversalNode):boolean{
			return n1.score < n2.score;
		}
	}
}