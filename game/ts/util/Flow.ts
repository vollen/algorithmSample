namespace utils{
    export class FlowStep{
        public delay:number;
        public callback:Function;
        public callbackThis?:any;
        constructor(delay:number, callback:Function, callbackThis?:any){
            this.delay = delay;
            this.callback = callback;
            this.callbackThis = callbackThis;
        }
    }
    export class Flow extends egret.EventDispatcher{
        private flowList:FlowStep[];
        private curStep:FlowStep;
        constructor(list:FlowStep[] = []){
            super();
            this.flowList = list;
            if(list.length > 0){
                this.next();
            }
        }

        public addStep(step:FlowStep){
            this.flowList.push(step);
            if(!this.curStep){
                this.next();
            }
        }

        public step(dt:number){
            const step = this.curStep;
            if(!step){ return;}

            step.delay -= dt;
            const delay = step.delay;
            if(delay > 0){ return;}

            step.callback.call(step.callbackThis);
            this.next();
            if(delay < 0){
                this.step(-delay);
            }
        }

        public next(){
            const next = this.flowList.shift();
            if(next){
                this.curStep = next;
            } else {
                this.curStep = undefined;
                this.dispatchEventWith(egret.Event.COMPLETE);
            }
        }
    }
}