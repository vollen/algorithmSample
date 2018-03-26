/**
 * 插入排序
 * 仿照插入扑克牌的思想， 拿到一个牌之后， 将它插入到合适的位置。
 */

var {swap} = require("./util");


function insert(arr, j, i){
    var tmp = arr[j];
    for(var k = j - 1; k >= i; k--){
        arr[k + 1] = arr[k];
    }
    arr[i] = tmp;
}

function sort(arr, func){
    var n = arr.length;
    for(var i = 1; i < n; i++){
       for(var j = 0; j < i; j++){
           if(func(arr[i], arr[j]) < 0){
               insert(arr, i, j);
           }
       } 
    }
}

exports.sort = sort;