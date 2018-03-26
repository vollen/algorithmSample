/*
 * 选择排序 
 * 每一轮找到最小值， 然后将最小值交换到最前面。
 * 比较次数多， 交换次数少
 */
var {swap} = require("./util");

function sort(arr, func){
    var n = arr.length;
    for(var i = 0; i < n - 1; i++){
        var min = i;
        for (var j = i+ 1; j < n; j++){
            if(func(arr[min], arr[j]) > 0){
                min = j;
            }
        }
        if(i !== min){
            swap(arr, i, min);
        }
    }
}

exports.sort = sort;

