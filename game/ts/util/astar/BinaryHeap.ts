
module astar {

	export class BinaryHeap{
		private data:Array<any> ;//需要注意的是，二叉堆数据的下标是从1开始排列的

		/**
		 * 排序函数
		 */
		public sortMetord:Function = BinaryHeap.defaultSortMetord;

		public constructor(){
			this.clear();
		}

		/**
		 * 数据长度
		 *
		 * @return
		 *
		 */
		public get length():number{
			return this.data.length - 1;
		}

		/**
		 * 添加节点
		 * @param o
		 *
		 */
		public push(o:any):void{
			var s:number = this.data.push(o) - 1;//s 当前节点
			this.modifyIndex(s);
		}

		/**
		 * 修改节点后重排顺序
		 * @param o
		 *
		 */
		public modify(o:any):void{
			var index:number = this.data.indexOf(o);
			if (index > 0)
				this.modifyIndex(index);
		}

		private modifyIndex(index:number = 0):void{
			var s:number = index;//s 当前节点
			while (s > 1){
				var p:number = Math.floor(s / 2);//p 父节点
				if (this.sortMetord(this.data[s],this.data[p])){
					var t:any = this.data[s];
					this.data[s] = this.data[p];
					this.data[p] = t;
				}
				else
					break;

				s = p;
			}
		}

		/**
		 * 从数组中取出首节点（最小值）
		 * @param index
		 *
		 */
		public shift():any{
			if (this.data.length === 1)//数组为空
				return null;

			if (this.data.length === 2)//数组只有一个节点
				return this.data.pop();

			var v:any = this.data[1];
			var s:number = 1;//s 当前节点

			this.data[1] = this.data.pop();//将末节点移动到队首

			const length = this.data.length;
			while (true){
				var os:number = s;//os s的旧值
				var p:number = s * 2;//p 子节点
				if (p < length){
					if (this.sortMetord(this.data[p],this.data[s]))
						s = p;

					//如果另一个子节点更小
					if (p + 1 < length && this.sortMetord(this.data[p + 1],this.data[s]))
						s = p + 1;
				}

				if (s !== os){
					var t:any = this.data[s];
					this.data[s] = this.data[os];
					this.data[os] = t;
				}
				else
					break;
			}
			return v;
		}

		/**
		 * 清空
		 *
		 */
		public clear():void{
			this.data = [null];
		}

		/**
		 * 默认排序函数
		 *
		 * @param obj1
		 * @param obj2
		 * @return
		 *
		 */
		public static defaultSortMetord(obj1:any,obj2:any):boolean{
			return obj1 < obj2;
		}

	}
}