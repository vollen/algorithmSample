Array.random = function (n, max){
    n = n || 100;
    max = max || 1000;
    var a = [];
    for (var i = 0; i < n; i++) {
        a[i] = Math.floor(Math.random() * max);
    }

    a.sort((a, b)=>{return a-b;});
    return a;
}
