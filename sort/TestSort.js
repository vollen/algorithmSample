/*
    测试脚本
    [十大排序算法](https://blog.csdn.net/qq_21688757/article/details/53749198)
*/
var {sort} = require("./InsertSort");
var utils = require("./util");

function randomData(n){
    var data = [];
    var max = 2 * n;
    for(let i = 0; i < n; i++){
        data[i] = utils.randomIn(max);
    }
    return data;
}

function varify(data, func){
    var len = data.length;
    for(var i = 1; i < len; i++){
        if(func(data[i], data[i - 1]) < 0){
            return false;
        }
    }

    return true;
}

function test(){
    var func = utils.comp;
    var data = randomData(utils.randomIn(100));
    sort(data, func);
    if(!varify(data, func)){
        console.log("sort failed");
        utils.printArr(data);
        return false;
    }
    // utils.printArr(data, "result: ");
    return true;
}

function benchTest(){
    for(var i = 0; i < 10; i++){
        if(!test()){
            return;
        }
    }
    console.log("sort successed");
}
benchTest();