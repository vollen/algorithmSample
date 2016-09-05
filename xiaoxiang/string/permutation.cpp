#include <iostream>
#include <string.h>
#include <utility>

using namespace std;
void permutation(char * str, int len, int n){
	if ( n == len -1 ) {
		cout<< str << endl;
		return;
	}

	for (int i = n; i < len; ++i)
	{
		swap(str[i], str[n]);
		permutation(str, len, n + 1);
		swap(str[i], str[n]);
	}
}

void reverse(int * start, int * end){
	while(start < end){
		int tmp = * start;
		*start ++ = *end;
		*end -- = tmp;
	}
}

bool next_permutation(int * a, int size){	
	int i = size -2;
	while((i >= 0) && (a[i] > a[i + 1])) i --;
	if (i < 0) 
		return false;

	int j = size -1 ;
	while(a[j] < a[i]) j --;

	swap(a[i], a[j]);
	reverse(a + i + 1, a + size - 1);
	return true;
}

void permutation_unrecursion(){
	int a[] = {1, 2, 3, 4};
	while(next_permutation(a, 4)){
		for (int i = 0; i < 4; ++i)
		{
			cout << a[i];
		}
		cout << endl;
	}
}


 int main(int argc, char const *argv[])
{	
	// char str[] = "abcd";
	// permutation(str, strlen(str), 0);
	permutation_unrecursion();
	return 0;
}