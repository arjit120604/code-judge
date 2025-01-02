#include <bits/stdc++.h>
using namespace std;

##user_code

int main() {
    int n;
cin >> n;
vector<int> arr(n);
for(int i = 0; i < n; i++) {
    cin >> arr[i];
}
int n;
cin >> n;
vector<int> brr(n);
for(int i = 0; i < n; i++) {
    cin >> brr[i];
}
    int result = maxElement(arr, brr);
    cout << result << endl;
    return 0;
}