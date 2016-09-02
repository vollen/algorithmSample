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

void LCS(const char* X, const char* Y, string& str){
    int len1 = (int)strlen(X);
    int len2 = (int)strlen(Y);

    vector<vector<int> > chess(len1 + 1, std::vector<int>(len2 + 1));

    for (int i = 0; i <= len1; ++i)
        chess[0][i] = 0;
    for (int i = 0; i <= len2; ++i)
        chess[i][0] = 0;

    for (int i = 0; i < len1; ++i)
    {
        for (int j = 0; j < len2; ++j)
        {
            cout << i << j << endl;
            if (X[i] == Y[j]){
                chess[i+1][j+1] = chess[i][j] + 1;
            } else{
                chess[i+1][j+1] = max(chess[i][j + 1], chess[i + 1][j]);
            }
        }
    }

    int i = len1;
    int j = len2;
    while((i > 0) && (j > 0)){
        if (X[i - 1] == Y[j - 1]){
            str.push_back(X[i - 1]);
            i --;
            j --;
        } else if (chess[i-1][j]> chess[i][j -1]) {
            i --;
        } else
            j --;
    }
    std::reverse(str.begin(), str.end());
}

int main(int argc, char const *argv[])
{
    const char* str1 = "TCGGATCGACTT";
    const char* str2 = "AGVVYACGTA";
    string str;
    LCS(str1, str2, str);
    cout<< str.c_str()<< endl;
    return 0;
}


