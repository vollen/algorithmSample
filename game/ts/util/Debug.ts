namespace utils.debug {
    export function hook(classz:Object, funcName:string, filter?:Function, isPre:boolean = false){
        const p = classz;
        const origin = p[funcName].origin || p[funcName];
        p[funcName] = function(...params){
            let result;
            if(isPre) {
                result = origin.call(this, ...params);
                if(!filter || filter(this, ...params)) {
                    console.log("--on hook--", getClassName(classz), funcName, this);
                }
            }else{
                if(!filter || filter(this, ...params)) {
                    console.log("--on hook--", getClassName(classz), funcName, this);
                }
                result = origin.call(this, ...params);
            }
            return result;
        };
        if(!p[funcName].origin){
            p[funcName].origin = origin;
        }
        console.log("--hook-", getClassName(classz), funcName);
    }

    function getClassName(classz:Object){
        const func = classz["getDisplayName"];
        if(func) {
            return func.call(classz);
        }
        return "";
    }

    function isObject(v){
        return v && (typeof(v)).toLowerCase().indexOf("object") !== -1;
    }

    const times:TypedCollection<number> = {};
    const time:TypedCollection<number> = {};
    const savedparams:TypedCollection<any[]> = {};
    // var checkParamsFunc = eval(`function(savedparams, params){ return true;}`);
    var checkParamsFunc;
    function initCheckFunc(){
        if(!checkParamsFunc){
            checkParamsFunc = eval(`(function(){
                function checkParamsFunc(savedparams, params){
                    return  savedparams.every(function(v, i){
                        if(isObject(v) && isObject(params[i])){
                            return %HaveSameMap(v, params[i]);
                        }
                        return true
                    });
                }
                return checkParamsFunc;
            })()`);
        }
    }
    export function rgFuncCouter(clazz, name, loop){
        var key = (clazz.prototype.__class__ || "")  + ": " + name;
        var originFunc = clazz.prototype[name];
        loop = loop || 1;
        if(!originFunc){ return ;}
        clazz.prototype[name] = function(){
            var params = [];
            for(let i=0, l = arguments.length; i < l; i++){
                params[i] = arguments[i];
            }


            var start = new Date().getTime();
            for(let i = 0; i < loop - 1; i++){
                originFunc.apply(this, params);
            }
            var result = originFunc.apply(this, params);
            var diff = new Date().getTime() - start;
            if(diff > 0){
                times[key] = (times[key] || 0) + 1;
                time[key] = (time[key] || 0) + diff;
            }

            if(savedparams[key]){
                initCheckFunc();
                params.push(this);
                var flag = checkParamsFunc(savedparams[key], params);
                if(!flag){
                    console.log("--params---map---unmatch : " + key);
                }
            }
            savedparams[key] = params;

            return result;
        };
    }

    export function getFuncPerTime(clazz:any, name:string){
        var tag = (clazz.prototype.__class__ || "")  + ": " + name;
        if(times[tag]){
            return time[tag] / times[tag];
        } else{
            return "did not call ever";
        }
    }

    export function revert(classz:Function, funcName:string){
        const p = classz;
        const origin = p[funcName].origin;
        if(origin){
            p[funcName] = origin;
        }
        console.log("--revert-", getClassName(classz), funcName);
    }

    let nextClickTimer:number;
    let touches:number[][] = [];

    function randomClick(){
        const stage = egret.MainContext.instance.stage;
        const x = Math.random() * stage.stageWidth;
        const y = Math.random() * stage.stageHeight;
        const id = 0;
        if (doFakeClick(x, y, id)){
            touches.push([x, y, egret.getTimer()/1000]);
        };
    }

    export function doFakeClick(x, y, id){
        try{
        const stage = egret.MainContext.instance.stage;
        let target = stage.$hitTest(x, y) || stage;
        if(target && target.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
            egret.TouchEvent.dispatchTouchEvent(target, egret.TouchEvent.TOUCH_TAP, true, true, x, y, id, false);
            nextClickTimer = egret.getTimer()/1000 + 0.5;
            return true;
        }
        return false;
        } catch(e){
            console.log(e);
        }
    }

    function batchClick(dt:number){
        const timer = egret.getTimer()/1000;
        for(let i = 0; i < 1000; i++){
            if(timer >= nextClickTimer) {
                randomClick();
            } else{
                break;
            }
        }
        return false;
    }

    export function startTest(){
        nextClickTimer = 0;
        egret.startTick(batchClick, this);
    }

    export function stopTest(){
        egret.stopTick(batchClick, this);
    }

    export function doClickList(poses:number[][]){
        const pos = poses.shift();
        if(pos){
            doFakeClick(pos[0], pos[1], 1);
            const next = poses[0];
            if (next){
                let delay = next[2] - pos[2];
                delay = Math.min(delay, 2);
                egret.setTimeout(doClickList, undefined, delay * 1000, poses);
            }
            console.log("---doClickList-->> x: "+ pos[0] +", y: " + pos[1]+ ", left:"+ poses.length);
        }
    }

    export function outputClickList(){
        let str = "[";
        touches.forEach(v=>{
            str += "[" + v[0] +"," + v[1] + "," + v[2] +"],";
        });
        str += "]";
        console.log(str);
        touches = [];
    }

    export function showStageTree(){
        const stage = egret.MainContext.instance.stage;
        console.log(getContainerTree(stage));
    }

    export function getContainerTree(node:egret.DisplayObjectContainer):DebugTree{
        const num = node.numChildren;

        let count = num;
        const tree:DebugTree = <any>{};
        const subTrees:DebugTree[] = [];
        for(let i = 0; i< num; i++){
            const child = node.$children[i];
            if(child instanceof egret.DisplayObjectContainer){
                const subTree = getContainerTree(child);
                count += subTree.totalChildCnt;
                subTrees.push(subTree);
            } else {
                const subStr = child["__class__"];
                subTrees.push({self:child, selfStr: subStr});
            }
        }
        const selfStr = node["__class__"] + ", childrenCnt: " + num + ", totalCnt:" + count;
        tree.self = node;
        tree.subTrees = subTrees;
        tree.selfStr = selfStr;
        tree.totalChildCnt = count;

        return tree;
    }

    export function showNodeTreeString(node:egret.DisplayObjectContainer){
        const results = _getTreeString(getContainerTree(node));
        console.log(results.join("\n"));
    }

    function _getTreeString(tree:DebugTree, results:string[] = [], prefix:string = ""){
        results.push(prefix + tree.selfStr);
        if(tree.subTrees){
            const childPrefix = prefix + "\t";
            tree.subTrees.forEach(subTree=>{
                _getTreeString(subTree, results, childPrefix);
            });
        }
        return results;
    }

    export let callTimes;
    export let callTime;
    export let recordTotalTimer:number;
    export let averTime;
    export let maxTime;
    export let minTime;
    let recordStartTime:number;
    export function startRecord(){
        recordStartTime = egret.getTimer();
        callTime = {};
        callTimes = {};
    }

    export function stopRecord(){
        const timer = egret.getTimer();
        recordTotalTimer = timer + recordStartTime;
        recordStartTime = undefined;
    }

    let callStartTime;
    export function recordFuncTimeStart(key:string){
        if(!recordStartTime){return;}
        callStartTime[key] = egret.getTimer();
        callTimes[key] = (callTimes[key] || 0) + 1;
    }

    export function recordFuncTimeEnd(key:string){
        if(!recordStartTime){return;}
        const lastTimer = callStartTime[key];
        if(!lastTimer){return;}
        const timer = egret.getTimer();
        callTime[key] = callTime[key] + (timer - lastTimer);
    }

    export function outputRecord(type:string){
        console.log("record total time: " + recordStartTime);
        let list:string[] = Object.keys(callTimes);
        if(type === "times"){
            list.sort((a, b)=>{
                return callTimes[b] - callTimes[a];
            });
        } else {
            list.sort((a, b)=>{
                return callTime[b] - callTime[a];
            });
        }

         list.forEach(key=>{
             console.log("FuncName : " + key + ", times: " + callTimes[key] + ", time" + callTime[key]);
         });
    }

    interface DebugTree{
        self:egret.DisplayObject;
        selfStr:string;
        totalChildCnt?:number;
        subTrees?:DebugTree[];
    }
}