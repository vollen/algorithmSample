#include <iostream>
using namespace std;

void getNext(const char * s, int next[]){
	int k = -1;
	int j = 0;
	next[0] = -1;
	int l = strlen(s);
	while(j < l - 1){
		if(k == -1 || s[j] == s[k]){
			++j;
			++k;
			next[j] = k;
		} else{
			k = next[k];
		}
	}
}

int kmp(const char * x,const char* y, int next[] ){
	int len1 = strlen(x);
	int len2 = strlen(y);

	int ans = -1;
	int i = 0;
	int j = 0;
	while ( i < len1){
		if ( j == -1 || x[i] == y[j]){
			++i; ++j;
		} else{
			j = next[j];
		}

		if (j == len2){
			ans = i - j;
			break;
		}
	}

	return ans;
}

int main(int argc, char const *argv[])
{
	const char * x = "fdskhfhjkdhgfiufhwieurjgheruytgefiufhwieureruytfiuaierfiufhwieurjgheruytgekutgrkdgfdfldksfiewmjdshiufhwkjbdmshfiuwmnbcjhsdgfrwibfu";
	const char * y = "fiufhwieureruytfiua";

	int a[strlen(y)];
	getNext(y, a);
	for (int i = 0; i < strlen(y); ++i)
	{
		cout<< a[i] ;
	}
	cout << endl;
	int i = kmp(x, y, a);
	cout << i << endl;
	return 0;
}