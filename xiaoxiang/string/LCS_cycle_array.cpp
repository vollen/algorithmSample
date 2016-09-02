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


int LCSLen(const char* X, const char* Y){
    int len1 = (int)strlen(X);
    int len2 = (int)strlen(Y);

    vector<int> chess(len1 + 1);

    for (int i = 0; i <= len1; ++i)
        chess[i] = 0;

    for (int i = 0; i < len1; ++i)
    {
        for (int j = 0; j < len2; ++j)
        {
            if (X[i] == Y[j]){
                chess[i+1][j+1] = chess[i][j] + 1;
            } else{
                chess[i+1][j+1] = max(chess[i][j + 1], chess[i + 1][j]);
            }
        }
    }

    return chess[len1][len2];
}

int main(int argc, char const *argv[])
{
    const char* str1 = "TCGGATCGACTT";
    const char* str2 = "AGVVYACGTA";
    int len = LCS(str1, str2);
    cout<< len << endl;
    return 0;
}


