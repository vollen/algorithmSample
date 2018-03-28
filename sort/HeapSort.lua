local heap = {}

function heap:init(func)
    self.data = {};
    self.sortedFunc = func
end

function heap:update(index)
    local parent = math.floor(index / 2)
    while(parent > 0 and self.sortedFunc(self.data[index], self.data[parent])) do
        swap(self.data, index, parent);
        index = parent;
        parent = math.floor(index / 2);
    end
end

function heap:insert(value)
    table.insert(self.data, value)
    self:update(#self.data);
end

function heap:pop()
    local value = self.data[1]
    self.data[1] = table.remove(self.data, #self.data)

    local index = 1;
    local cnt = #self.data
    while(true) do
        local value = self.data[index]
        local newIndex = index;
        local left = index * 2
        if(left <= cnt) then
            if(self.sortedFunc(self.data[left], self.data[newIndex])) then
                newIndex = left
            end

            local right = left + 1
            if(right <= cnt and self.sortedFunc(self.data[right], self.data[newIndex])) then
                newIndex = right
            end
        end

        if(newIndex ~= index) then
            swap(self.data, newIndex, index)
            index = newIndex
        else
            break;
        end
    end
    return value
end

function sort(arr, func)
    heap:init(func)
    for i,v in ipairs(arr) do
        heap:insert(v)
    end

    for i=1, #arr do
        arr[i] = heap:pop();
    end
end

return sort