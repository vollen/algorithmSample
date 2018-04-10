#include <iostream>

using namespace std;

template <T>
void swap(array<T> arr, int i, int j){
    T tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

template <T>
void qsort(array<T> arr, int start, int end){
    T val = arr[start];
    for(int i = start + 1; i < end; i++){
        
    }
}

int main(){
    cout << "Hello World" << endl;
    return 0;
}