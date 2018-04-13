module astar {
	export class TraversalNode{
		public noteOpen : boolean;//是否在开放列表
		public noteClosed : boolean;//是否在关闭列表
		public cost:number;//距离消耗
		public score:number;//节点得分
		public parent:TraversalNode;//父节点
		public point:any;//坐标

		constructor(){
			this.noteOpen = true;
			this.noteClosed = false;
			this.cost = 0;
			this.score = 0;
			this.parent = undefined;
			this.point = undefined;
		}

		public clear(){
			this.parent = undefined;
			this.point = undefined;
		}
	}
}