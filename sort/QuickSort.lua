-----------------------------------------------
-- [FILE] quickSort.lua
-- [DATE] 2016-07-04
-- [CODE] BY gaofeng
-- [MARK] NONE
-----------------------------------------------

local function _quickSort(tmp, arr, low, high, sortFunc)
    if low >= high then return end

    local value = arr[low];
    local j = low;
    for i = low + 1, high do
        if(sortFunc(arr[i], value))then
            -- print("---", arr[i], arr[j], j, value);
            j = j + 1
            swap(arr, i, j)
        end
    end

    local mid = j
    swap(arr, low, j)
    _quickSort(tmp, arr, low, mid - 1, sortFunc)
    _quickSort(tmp, arr, mid + 1, high, sortFunc)
end


local function quickSort(arr, sortFunc)
    sortFunc = sortFunc or defaultSortFunc
    local tmp = {}
    local len = #arr
    _quickSort(tmp, arr, 1, len,  sortFunc)
end

return quickSort
