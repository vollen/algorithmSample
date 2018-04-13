
module astar {

	export class BinaryTree{
		private data:Array<any>;
		
		public constructor(){
			this.clear();
		}
		
		public getValue(index:number = 0):any{
			return index < this.data.length ? this.data[index] : null; 
		}
		
		public setValue(index:number,v:any):void{
			this.data[index] = v;
		}
		
		public indexOf(v:any):number{
			return this.data.indexOf(v);
		}
		
		public clear():void{
			this.data = [null];
		}
		
		public getLeftChildIndex(index:number = 0):number{
			return index << 1;
		}
		
		public getRightChildIndex(index:number = 0):number{
			return (index << 1) + 1;
		}
		
		public getParentIndex(index:number = 0):number{
			return index >> 1;
		}
		
		public getLeftChild(index:number = 0):any{
			var n:number = index << 1;
			return n < this.data.length ? this.data[n] : null; 
		}
		
		public getRightChild(index:number = 0):any{
			var n:number = (index << 1) + 1;
			return n < this.data.length ? this.data[n] : null; 
		}
		
		public getParent(index:number = 0):any{
			var n:number = index >> 1;
			return n < this.data.length ? this.data[n] : null; 
		}
		
		public setLeftChild(index:number,v:any):number{
			var n:number = index << 1;
			this.data[n] = v;
			return n;
		}
		
		public setRightChild(index:number,v:any):number{
			var n:number = (index << 1) + 1;
			this.data[n] = v;
			return n;
		}
		
		public setParent(index:number,v:any):number{
			var n:number = index >> 1;
			this.data[n] = v;
			return n;
		}
		
		public getDeep(index:number = 0):number{
			return Math.log(index) / Math.LN2;
		}
		
		private getArraySub(index:number = 0):Array<any>{
			if (index >= this.data.length || !this.data[index])
				return null;
			
			return [this.data[index],[this.getArraySub(index << 1),this.getArraySub((index << 1) + 1)]];
		}
		
		public toArray():Array<any>{
			return this.getArraySub(1);
		}
		
		private getArrayString(index:number = 0):string{
			if (index >= this.data.length || !this.data[index])
				return null;
			
			return "["+this.data[index]+","+this.getArrayString(index << 1)+","+this.getArrayString((index << 1) + 1)+"]";
		}
		
		public toString():string{
			return this.getArrayString(1);
		}
	}
}