#include <stdio.h>

void reverse(char * str, int from, int to){
    while (from < to){
        char t = str[from];
        str[from ++] = str[to];
        str[to --] = t; 
    }
}

void leftRotate(char * str, int n, int k){
    reverse(str, 0, k - 1);
    reverse(str, k, n - 1);
    reverse(str, 0, n - 1);
}

int main(){
    char str[] = "abcdefghi";
    leftRotate(str, 9, 3);
    printf("%s\n", str);
}
