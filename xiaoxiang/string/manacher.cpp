#include <iostream>
#include <string.h>
#include <algorithm>

using namespace std;

/*
manacher马拉车算法， 现在字符串的每个字符中间和前后插入特殊符号， 得到字符串S, 则可以过滤掉 奇偶判断.
使用P[i] 来计算 S 第i个位置的最长回文子串往左/右扩展的位数， 则原字符串在该位置的最长回文子串长度为P[i -1];	

当P[0] - p[i -1 ] 都计算出来的时候， 推导p[i] 过程。
设位置 令 f(x) = x+ p[x]； 找到 0 -i 中， 使f(x)最大的值 d。mx = f(d); 
	a: 可知 [2d -mx, mx] 范围内是关于d对称的。 

当 i 落在 mx 范围内的时候， 可以找到 i 关于d 的对称点 j. 
	根据 推论a.
		当 p[j] < mx - i 时，因为对称关系， p[i] = p[j]
		当 p[j] >= mx - i 时， 因为对称关系只在 mx范围内生效， 所以 p[i] >= mx -i， 以p[i] = mx-i为初始值，逐个比较;
当 i 落在 mx 范围外的时候， 无法找到规律， 只能从 1 开始往左右比较。
*/

void manacher(char * str, int * p){
	p[0] = 1;

	int d = 0;
	int mx = 0;
	int len = strlen(str);
	for (int i = 1; i < len; ++i)
	{
		if (mx > i ){
			int j = 2 * d - i;
			p[i] = min(p[j], mx -i);
		} else{
			p[i] = 1;
		}

		for (; str[i + p[i]]  == str[i -p[i]]; ) p[i] ++;

		if (i + p[i] > mx){
			mx = i + p[i];
			d = i;
		}
	}
}

int main(int argc, char const *argv[])
{
	const char * str = "afdsfgfsdrewlkjfdgfd";
	char tmp[2 * strlen(str) + 2];
	for (int i = 0; i < 2 * strlen(str) + 1; ++i)
	{
		if (i % 2){
			tmp[i] = str[i /2];
		} else
			tmp[i] = '#';
	}
	tmp[2 * strlen(str) + 1] = '\0';

	cout<< str << strlen(str)<< endl;
	cout<< tmp << strlen(tmp) << endl;

	int p[2* strlen(str) + 1];
	manacher(tmp, p);
	for (int i = 0; i < 2 * strlen(str) + 1; ++i)
	{
		cout << p[i] << "";
	}
	cout << endl;
	return 0;
}