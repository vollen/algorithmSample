

-- local find = require("bisectorSearch")
local find = require("SeqSearch")
math.randomseed(os.time());

local defaultFindFunc = function (a, b)
    return a - b
end

function randomData()
    local a = {};
    for i=1,100 do
    -- for i=1,10 do
        table.insert(a, math.random(100))
    end
    -- a = {45, 15, 12}
    return a;
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

function varify(data, value, i, func)
    local flag = true;
    local index;
    if(i == -1) then
        for i,v in ipairs(data) do
            if(func(v, value)) == 0 then
                flag = false
                index = i;
                break
            end
        end
    else
        flag = func(data[i], value) == 0;
    end
    if(not flag) then
        printt(data)
        print(value, i, index)
    end
    return flag
end

function test()
    local func = defaultFindFunc;
    local data = randomData();
    local value = data[math.random(1.5 * #data)] or 10000
    local i = find(data, value, func);
    return varify(data, value, i, func);
end

function bench()
    for i=1,10 do
        if(not test()) then
            print("find failed")
            return
        end
    end

    print("find successed")
end

bench();