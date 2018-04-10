

function printValue()
    local info = debug.getinfo(2);
    
    for i = 1, math.huge do
        local n, v = debug.getlocal(2, i)
        if(not n) then break end

        print("--local value---", n, v)
    end

    local func = debug.getinfo(2, "f").func;
    for i = 1, math.huge do
        local n, v = debug.getupvalue(func, i)
        if(not n) then break end

        print("--upvalue---", n, v)
    end
end

function trace(event, line)
    local s = debug.getinfo(2).short_src
    print(s .. ":" .. line)
end

-- debug.sethook(trace, "l");

local function printt(t)
    for k, v in pairs(t) do
        print(k, v)
    end
end

local up = 2;
local function test(b, c, d)
    local a = 1;
    for i = 1, 10 do
        print(i, i)
    end
    printValue()

    local t = debug.getinfo(1);
    printt(t)
end

test(1)