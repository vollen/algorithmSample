local counter = {}
local names = {}

local function hook()
    local func = debug.getinfo(2, "f").func;
    if(not counter[func]) then
        counter[func] = 1;
        names[func] = debug.getinfo(2, "Sn");
    else
        counter[func] = counter[func] + 1;
    end
end

local function getName(func)
    local info = names[func];
    if(info.what == "C") then
        return "C:" .. (info.name or "");
    else
        local lc = string.format("[%s]:%s", info.short_src, info.linedefined)
        if(info.namewhat ~= "") then
            return string.format("%s(%s)", lc, info.name);
        else
            return lc;
        end
    end
end

local entry = ...
local f = assert(loadfile(entry));
debug.sethook(hook, "c");
f()
debug.sethook();
for func, count in pairs(counter) do
    print(getName(func), count)
end
