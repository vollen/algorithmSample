local function bisectorSearch( arr, key)
	table.sort(arr);
 	local len = #arr
 	local low, high = 1, len
 	while low <= high do
 		local mid = math.floor(low + (high - low) / 2)
 		local value = arr[mid]
		if (value > key) then
 			high = mid - 1
 		elseif value < key then
 			low = mid + 1
 		else 
 			return mid
 		end
 	end

 	return -1 
end

return bisectorSearch