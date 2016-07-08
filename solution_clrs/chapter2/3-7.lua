local function merge(tmp, arr, low, mid, high)
	for i=low,high do
		tmp[i] =  arr[i]
	end

	local left, right = low, mid + 1
	for i=low , high do
		if low > mid then
			arr[i] = tmp[right]
			right = right + 1
		elseif right > high then
			arr[i] = tmp[left]
			left = left + 1
		elseif tmp[left] < tmp[right] then
			arr[i] = tmp[left]
			left = left + 1
		else
			arr[i] = tmp[right]
			right = right + 1
		end
	end
end

local function _mergeSort(tmp, arr, low, high)
	if low >= high then
		return 
	end

	local mid = math.floor((low + high)/ 2)
	_mergeSort(tmp, arr, low, mid)
	_mergeSort(tmp, arr, mid + 1, high)
	merge(tmp, arr, low, mid, high)
end


local function mergeSort(arr)
	local tmp = {}
	_mergeSort(tmp, arr, 1, #arr)
end


local function find(arr, x)
	local low, high = 1, #arr
	while (low < high) do
		local sum = arr[low] + arr[high]
		if sum > x then
			high = high -1
		elseif sum < x then
			low = low + 1
		else
			return arr[low], arr[high]
		end
	end

	return nil, nil
end

local function printList( data )
	local str =""
	for i,v in ipairs(data) do
		str = str .. v .. "	"
	end
	print("nums: ", str)
end

local data = {}
local cnt = 10
math.randomseed(os.time())
for i=1,cnt do
	table.insert(data, math.random(100))
end

printList(data)

local sumList = {}
for i=1,cnt do
	for j=1,i - 1 do
		local sum = data[i] + data[i]
		sumList[sum] = true
	end
end

mergeSort(data)
printList(data)
local count = 0
for n,_ in pairs(sumList) do
	local a, b = find(data, n)
	print(n, a, b)
	if not a then
		count = count + 1
	end
end


print("faild---: ", count)