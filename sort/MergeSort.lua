-----------------------------------------------
-- [FILE] MergeSort.lua
-- [DATE] 2016-07-04
-- [CODE] BY gaofeng
-- [MARK] NONE
-----------------------------------------------
local function merge(tmp, arr, low, mid, high, sortFunc)
    for i=low, high do
        tmp[i] = arr[i]
    end

    local li, ri = low, mid + 1
    for i=low, high do
        if li > mid then
            arr[i] = tmp[ri]
            ri = ri + 1
        elseif ri > high then
            arr[i] = tmp[li]
            li = li + 1
        elseif sortFunc(tmp[li], tmp[ri]) then
            arr[i] = tmp[li]
            li = li + 1
        else
            arr[i] = tmp[ri]
            ri = ri + 1
        end
    end
end

local function _mergeSort(tmp, arr, low, high, sortFunc)
    if low >= high then return end

    local mid = math.floor((low + high) / 2)
    _mergeSort(tmp, arr, low, mid, sortFunc)
    _mergeSort(tmp, arr, mid + 1, high, sortFunc)
    merge(tmp, arr, low, mid, high, sortFunc)
end

local defaultSortFunc = function (a, b)
    return a < b
end

local function mergeSort(arr, sortFunc)
    sortFunc = sortFunc or defaultSortFunc
    local tmp = {}
    local len = #arr
    _mergeSort(tmp, arr, 1, len,  sortFunc)
end

return mergeSort
