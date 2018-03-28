-----------------------------------------------
-- [FILE] quickSort.lua
-- [DATE] 2016-07-04
-- [CODE] BY gaofeng
-- [MARK] NONE
-----------------------------------------------
local function _quickSort(tmp, arr, low, high, sortFunc)
    if low >= high then return end

    local mid = math.floor((low + high) / 2)
    _quickSort(tmp, arr, low, mid, sortFunc)
    _quickSort(tmp, arr, mid + 1, high, sortFunc)
end


local function quickSort(arr, sortFunc)
    sortFunc = sortFunc
    local tmp = {}
    local len = #arr
    _quickSort(tmp, arr, 1, len,  sortFunc)
end

return quickSort
