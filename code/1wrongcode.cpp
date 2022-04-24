#include <iostream>
#include <vector>
#include <string>
#include <stack>
using namespace std;

// } Driver Code Ends

class Solution
{
public:
    // Function to check if brackets are balanced or not.
    bool ispar(string x)
    {
        stack<int> s;
        // closing bracket ke liye 1 openning ke liye 0;
        int i = 0;
        while (i < x.size())
        {
            if (x[i] == '(' || x[i] == '{' || x[i] == '[')
            {
                if (x[i] == '(')
                {
                    s.push(-1);
                }
                if (x[i] == '[')
                {
                    s.push(0);
                }
                if (x[i] == '{')
                {
                    s.push(1);
                }
            }
            else
            {
                if (s.size() == 0)
                {
                    return false;
                }
                else
                {
                    if (x[i] == ')' && s.top() != -1)
                    {
                        return false;
                    }
                    if (x[i] == ']' && s.top() != 0)
                    {
                        return false;
                    }
                    if (x[i] == '}' && s.top() != 1)
                    {
                        return false;
                    }
                    s.pop();
                }
            }
            i++;
        }

        return true;
    }
};

// { Driver Code Starts.

int main()
{
    string a;
    cin >> a;
    Solution obj;
    if (obj.ispar(a))
        cout << "balanced" << endl;
    else
        cout << "not balanced" << endl;
} // } Driver Code Ends