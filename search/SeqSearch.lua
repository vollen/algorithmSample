local function search( arr, key, func)
    for i,v in ipairs(arr) do
        if(func(v, key) == 0) then
            return i;
        end
    end
    return -1
end

return search