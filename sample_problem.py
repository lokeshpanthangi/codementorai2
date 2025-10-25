#!/usr/bin/env python3
"""
Sample script to create a Two Sum problem with proper boilerplate, wrapper code, and test cases
This demonstrates the LeetCode-style implementation we've built
"""

import requests
import json

# API Configuration
BASE_URL = "http://localhost:8000"
AUTH_TOKEN = "your_auth_token_here"  # Replace with actual token

def create_two_sum_problem():
    """Create a Two Sum problem with proper boilerplate and wrapper code"""
    
    # Problem data with LeetCode-style configuration
    problem_data = {
        "title": "Two Sum",
        "description": """Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

**Example 2:**
```
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

**Example 3:**
```
Input: nums = [3,3], target = 6
Output: [0,1]
```

**Constraints:**
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.""",
        
        "difficulty": "Easy",
        "tags": ["Array", "Hash Table"],
        "function_name": "twoSum",
        
        # Boilerplate code for different languages
        "boilerplates": {
            "python": """class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here
        pass""",
            
            "java": """class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}""",
            
            "cpp": """class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
    }
}"""
        },
        
        # Function signatures for proper calling
        "function_signature": {
            "python": "twoSum(self, nums: List[int], target: int) -> List[int]",
            "java": "twoSum(int[] nums, int target)",
            "cpp": "twoSum(vector<int>& nums, int target)"
        },
        
        # Input parsing logic for each language
        "input_parsing": {
            "python": """lines = input_data.strip().split('\\n')
nums = json.loads(lines[0])
target = int(lines[1])""",
            
            "java": """String[] lines = input.split("\\n");
int[] nums = Arrays.stream(lines[0].replaceAll("[\\[\\]]", "").split(","))
                  .mapToInt(s -> Integer.parseInt(s.trim())).toArray();
int target = Integer.parseInt(lines[1]);""",
            
            "cpp": """istringstream iss(input);
string line;
getline(iss, line);
// Parse nums array from JSON-like format
vector<int> nums;
// Parse target
getline(iss, line);
int target = stoi(line);"""
        },
        
        # Output formatting logic
        "output_formatting": {
            "python": "formatted_result = json.dumps(result)",
            "java": "String formattedResult = Arrays.toString(result);",
            "cpp": """string formatted_result = "[";
for(int i = 0; i < result.size(); i++) {
    if(i > 0) formatted_result += ",";
    formatted_result += to_string(result[i]);
}
formatted_result += "]";"""
        },
        
        # Wrapper code templates
        "wrapper_code": {
            "python": """import sys
import json
from typing import List

{{USER_CODE}}

if __name__ == "__main__":
    input_data = sys.stdin.read().strip()
    
    {{INPUT_PARSING}}
    
    solution = Solution()
    result = solution.twoSum(nums, target)
    
    {{OUTPUT_FORMATTING}}
    
    print(formatted_result)""",
            
            "java": """import java.util.*;
import java.io.*;

{{USER_CODE}}

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String input = br.readLine() + "\\n" + br.readLine();
        
        {{INPUT_PARSING}}
        
        Solution sol = new Solution();
        int[] result = sol.twoSum(nums, target);
        
        {{OUTPUT_FORMATTING}}
        
        System.out.println(formattedResult);
        br.close();
    }
}""",
            
            "cpp": """#include <iostream>
#include <vector>
#include <sstream>
#include <string>
using namespace std;

{{USER_CODE}}

int main() {
    string input;
    getline(cin, input);
    input += "\\n";
    string line;
    getline(cin, line);
    input += line;
    
    {{INPUT_PARSING}}
    
    Solution sol;
    vector<int> result = sol.twoSum(nums, target);
    
    {{OUTPUT_FORMATTING}}
    
    cout << formatted_result << endl;
    return 0;
}"""
        }
    }
    
    return problem_data

def create_test_cases(problem_id):
    """Create test cases for the Two Sum problem"""
    
    test_cases = [
        {
            "problem_id": problem_id,
            "input": "[2,7,11,15]\n9",
            "expected_output": "[0,1]",
            "is_hidden": False
        },
        {
            "problem_id": problem_id,
            "input": "[3,2,4]\n6",
            "expected_output": "[1,2]",
            "is_hidden": False
        },
        {
            "problem_id": problem_id,
            "input": "[3,3]\n6",
            "expected_output": "[0,1]",
            "is_hidden": False
        },
        {
            "problem_id": problem_id,
            "input": "[1,2,3,4,5]\n8",
            "expected_output": "[2,4]",
            "is_hidden": True
        },
        {
            "problem_id": problem_id,
            "input": "[-1,-2,-3,-4,-5]\n-8",
            "expected_output": "[2,4]",
            "is_hidden": True
        }
    ]
    
    return test_cases

if __name__ == "__main__":
    print("Creating Two Sum problem with LeetCode-style configuration...")
    
    # Create the problem
    problem_data = create_two_sum_problem()
    
    print("Problem data created:")
    print(f"- Title: {problem_data['title']}")
    print(f"- Function name: {problem_data['function_name']}")
    print(f"- Languages supported: {list(problem_data['boilerplates'].keys())}")
    print(f"- Has wrapper code: {len(problem_data['wrapper_code'])} languages")
    print(f"- Has function signatures: {len(problem_data['function_signature'])} languages")
    
    print("\nTo create this problem via API:")
    print(f"POST {BASE_URL}/problems/")
    print("Headers: Authorization: Bearer <your_token>")
    print("Body:", json.dumps(problem_data, indent=2))
    
    print("\nSample test cases would be:")
    sample_test_cases = create_test_cases("PROBLEM_ID_HERE")
    for i, tc in enumerate(sample_test_cases):
        print(f"Test Case {i+1} ({'Hidden' if tc['is_hidden'] else 'Public'}):")
        print(f"  Input: {tc['input']}")
        print(f"  Expected: {tc['expected_output']}")