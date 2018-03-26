require("./utils")
function binarySearch(arr, num){
    var index;
    var min = 0; max = arr.length - 1;
    while(min <= max){
        index = Math.floor((min + max) / 2);
        var value = arr[index]; 
        if( value === num){
            return index;
        } else if(value > num) {
            max = index - 1;
        } else{
            min = index + 1;
        }
    }
    
    return -1;
}

var a = Array.random(100);
var b = 100;
var index = binarySearch(a, b);
console.log(index);
