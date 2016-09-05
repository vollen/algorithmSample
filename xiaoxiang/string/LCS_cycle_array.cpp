/*
    对于Ｘ,Y　两个字符串，　会有

    LCS(Xm, Yn) = |  LCS(X(m-1), Y(n - 1)) if (Xm == Yn)
                  |  max(LCS(X(m-1), Yn), LCS(Xm, Y(n - 1)))  if (Xm ~= Yn)
*/

#include <iostream>
#include <vector>
#include <algorithm>
#include <string.h>

using namespace std;

/*
使用循环数组求两个字符串的最大LCS长度。
当计算 chess[i][j] 的时候， 只可能需要 chess[i-1][j-1], chess[i-1][j], chess[i][j-1]三个值， 
所以不需要维护一个m*n的数组， 只需要一个长度为n 的数组循环覆盖即可， 另外, chess[i-1][j-1]会被覆盖， 所以需要另外存起来。 
*/

int LCSLen(const char* X, const char* Y){
    int len1 = (int)strlen(X);
    int len2 = (int)strlen(Y);

    vector<int> chess(len1 + 1);

    for (int i = 0; i <= len2; ++i)
        chess[i] = 0;

    for (int i = 0; i < len1; ++i)
    {
        int lt =0;
        for (int j = 0; j < len2; ++j)
        {
            int tmp = lt;
            lt = chess[j+ 1];
            if (X[i] == Y[j]){
                chess[j+1] = tmp + 1;
            } else{
                chess[j+1] = max(chess[j], chess[j + 1]);
            }
        }
    }

    return chess[len2];
}

int main(int argc, char const *argv[])
{
    const char* str1 = "TCGGATCGACTT";
    const char* str2 = "AGVVYACGTA";
    int len = LCSLen(str1, str2);
    cout<< len << endl;
    return 0;
}


