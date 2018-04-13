class Queue<T>{
    private dataList:T[] = [];
    private index:number = 0;
    private max:number = -1;
    private capacity:number;
    private _length:number = 0;
    constructor(capacity:number){
        this.capacity = capacity || 10;
    }

    public get length(){
        return this._length;
    }

    //入队
    public enqueue(data:T){
        let next = this.max + 1;
        if(next >= this.capacity){
            next = 0;
        }
        //扩容
        if(this.dataList[next] !== undefined){
            this.resize();
            next = this.max + 1;
        }

        this.dataList[next] = data;
        this.max = next;
        this._length ++;
    }

    //出队
    public dequeue():T{
        const data = this.dataList[this.index];
        if(data !== undefined){
            this.dataList[this.index] = undefined;
            this.index ++;
            if(this.index >= this.capacity){
                this.index = 0;
            }
            this._length --;
        }
        return data;
    }

    //最后一个
    public getLast(){
        return this.dataList[this.max];
    }

    public getDataList(){
        const result = [];
        for(let i = 0; i < this.length; i++){
            let index = (this.index + i) % this.capacity;
            result.push(this.dataList[index]);
        }
        return result;
    }

    public every(func:(T)=>boolean){
        for(let i = 0; i < this.length; i++){
            let index = (this.index + i) % this.capacity;
            if(!func(this.dataList[index])){
                return false;
            }
        }
        return true;
    }


    private reverse(list:any[], start:number, end:number){
        while(start < end){
            const tmp = list[start];
            list[start ++] = list[end];
            list[end --] = tmp;
        }
    }

    private resize(){
        const max = this.capacity - 1;
        if(this.max !== max){
            this.reverse(this.dataList, 0, this.max);
            this.reverse(this.dataList, this.max + 1, max);
            this.reverse(this.dataList, 0, max);
        }

        this.max = max;
        this.capacity *= 2;
        this.index = 0;
    }
}