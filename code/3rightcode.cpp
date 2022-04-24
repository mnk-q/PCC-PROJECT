#include <iostream>
#include <vector>
#include <string>
#include <stack>
using namespace std;

// } Driver Code Ends

class Solution
{
public:
    void helper(string &S, int index, string &ans)
    {
        /*
        if(index==S.size()-1){
            if(S[index]==S[index-1]){
                ans.push_back(S[index]);
            }
            return;
        }*/
        if (index == S.size() - 1)
        {
            ans.push_back(S[index]);
            return;
        }
        if (S[index] == S[index + 1])
        {
            helper(S, index + 1, ans);
        }
        else
        {
            ans.push_back(S[index]);
            helper(S, index + 1, ans);
            return;
        }
    }
    string removeConsecutiveCharacter(string S)
    {
        string ans;
        helper(S, 0, ans);
        return ans;
    }
};

// { Driver Code Starts.
int main()
{
    string s;
    cin >> s;
    Solution ob;
    cout << ob.removeConsecutiveCharacter(s) << endl;
}