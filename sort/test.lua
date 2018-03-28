

local sort = require("HeapSort")
-- local sort = require("QuickSort")
-- local sort = require("ShellSort")
math.randomseed(os.time());
function randomData()
    local a = {};
    for i=1,100 do
    -- for i=1,10 do
        table.insert(a, math.random(100))
    end
    -- a = {45, 15, 12}
    return a;
end

local defaultSortFunc = function (a, b)
    return a <= b
end

function swap(arr, i, j)
    arr[i], arr[j] = arr[j], arr[i]
end


function varify(arr, func)
    local pre
    for i,v in ipairs(arr) do
        if(pre and not func(pre, v))then
            printt(arr)
            return false;
        end
        pre = v
    end
    return true
end

function printt(t, i, j)
    i = i or 1
    j = j or #t;
    local str = "";
    for index = i, j do
        str = str .. t[index] .. ", "
    end
    print(str)
end

function test()
    local func = defaultSortFunc;
    local data = randomData();
    sort(data, func);
    return varify(data, func);
end

function bench()
    for i=1,10 do
        if(not test()) then
            print("sort failed")
            return
        end
    end

    print("sort successed")
end

bench();