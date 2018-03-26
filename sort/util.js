function comp(a, b){
    return a - b;
}

function swap(arr, i, j){
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function randomIn(max){
    return Math.floor(Math.random() * max);
}

function printArr(arr, prefix){
    prefix = prefix || "";
    console.log(prefix + arr.join(","));
}

module.exports = {
    swap,
    comp,
    randomIn,
    printArr
}
