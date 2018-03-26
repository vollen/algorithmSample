

/*冒泡排序
相邻两个数比较，较大的数交换到后面， 每一轮遍历之后， 都会将最大的数排到最后。
优化： 当某次冒泡没有交换时，表示已经排序成功， 无需再遍历
优化2： 上一轮交换的最大索引值之后的部分， 都已经有序。
*/

var {swap} = require("./util");

function sort(arr, func){
    var n = arr.length;
    var flag = true;
    // var max = n;
    for(var i = 1; i < n && flag; i++){
        flag = false;
        for (var j = 0; j < n - i; j++){
            if(func(arr[j], arr[j + 1]) > 0){
                swap(arr, j, j + 1);
                flag = true;
            }
        }
    }
}

exports.sort = sort;

