"""
Seed script to populate MongoDB with sample LeetCode-style problems and test cases
Run this script once to initialize your database with data
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings

async def seed_database():
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    print("🌱 Starting database seeding...")
    
    # Clear existing data (optional - comment out if you want to keep existing data)
    await db.problems.delete_many({})
    await db.testcases.delete_many({})
    print("✅ Cleared existing data")
    
    # ========== Problem 1: Two Sum ==========
    problem_1 = {
        "problem_number": 1,
        "title": "Two Sum",
        "slug": "two-sum",
        "difficulty": "Easy",
        "description": """Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.""",
        "examples": [
            {
                "input": "nums = [2,7,11,15], target = 9",
                "output": "[0,1]",
                "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                "input": "nums = [3,2,4], target = 6",
                "output": "[1,2]",
                "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]."
            },
            {
                "input": "nums = [3,3], target = 6",
                "output": "[0,1]",
                "explanation": "Because nums[0] + nums[1] == 6, we return [0, 1]."
            }
        ],
        "constraints": [
            "2 <= nums.length <= 10⁴",
            "-10⁹ <= nums[i] <= 10⁹",
            "-10⁹ <= target <= 10⁹",
            "Only one valid answer exists."
        ],
        "topics": ["Array", "Hash Table"],
        "companies": ["Amazon", "Microsoft", "Google", "Facebook", "Apple"],
        "hints": [
            "Try using a hash map to store the values you've seen so far",
            "For each number, check if target - number exists in your hash map"
        ],
        "solution_template": {
            "python": """def twoSum(nums, target):
    # Write your solution here
    pass""",
            "javascript": """function twoSum(nums, target) {
    // Write your solution here
}""",
            "java": """class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}""",
            "cpp": """class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};"""
        },
        "acceptance_rate": 0.0,
        "total_submissions": 0,
        "total_accepted": 0,
        "created_at": datetime.utcnow()
    }
    
    result = await db.problems.insert_one(problem_1)
    problem_1_id = str(result.inserted_id)
    print(f"✅ Created Problem 1: Two Sum (ID: {problem_1_id})")
    
    # Test cases for Two Sum
    two_sum_testcases = [
        # Visible test cases
        {
            "problem_id": problem_1_id,
            "is_hidden": False,
            "order": 1,
            "input_data": "[2,7,11,15]\n9",
            "expected_output": "[0,1]",
            "explanation": "nums[0] + nums[1] = 2 + 7 = 9"
        },
        {
            "problem_id": problem_1_id,
            "is_hidden": False,
            "order": 2,
            "input_data": "[3,2,4]\n6",
            "expected_output": "[1,2]",
            "explanation": "nums[1] + nums[2] = 2 + 4 = 6"
        },
        {
            "problem_id": problem_1_id,
            "is_hidden": False,
            "order": 3,
            "input_data": "[3,3]\n6",
            "expected_output": "[0,1]",
            "explanation": "nums[0] + nums[1] = 3 + 3 = 6"
        },
        # Hidden test cases
        {
            "problem_id": problem_1_id,
            "is_hidden": True,
            "order": 1,
            "input_data": "[1,2,3,4,5]\n9",
            "expected_output": "[3,4]",
            "explanation": None
        },
        {
            "problem_id": problem_1_id,
            "is_hidden": True,
            "order": 2,
            "input_data": "[0,4,3,0]\n0",
            "expected_output": "[0,3]",
            "explanation": None
        },
        {
            "problem_id": problem_1_id,
            "is_hidden": True,
            "order": 3,
            "input_data": "[2,5,5,11]\n10",
            "expected_output": "[1,2]",
            "explanation": None
        },
        {
            "problem_id": problem_1_id,
            "is_hidden": True,
            "order": 4,
            "input_data": "[-1,-2,-3,-4,-5]\n-8",
            "expected_output": "[2,4]",
            "explanation": None
        },
        {
            "problem_id": problem_1_id,
            "is_hidden": True,
            "order": 5,
            "input_data": "[1,1,1,1,1,1]\n2",
            "expected_output": "[0,1]",
            "explanation": None
        }
    ]
    
    await db.testcases.insert_many(two_sum_testcases)
    print(f"✅ Created {len(two_sum_testcases)} test cases for Two Sum")
    
    # ========== Problem 2: Add Two Numbers ==========
    problem_2 = {
        "problem_number": 2,
        "title": "Add Two Numbers",
        "slug": "add-two-numbers",
        "difficulty": "Medium",
        "description": """You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.""",
        "examples": [
            {
                "input": "l1 = [2,4,3], l2 = [5,6,4]",
                "output": "[7,0,8]",
                "explanation": "342 + 465 = 807"
            },
            {
                "input": "l1 = [0], l2 = [0]",
                "output": "[0]",
                "explanation": "0 + 0 = 0"
            },
            {
                "input": "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
                "output": "[8,9,9,9,0,0,0,1]",
                "explanation": "9999999 + 9999 = 10009998"
            }
        ],
        "constraints": [
            "The number of nodes in each linked list is in the range [1, 100].",
            "0 <= Node.val <= 9",
            "It is guaranteed that the list represents a number that does not have leading zeros."
        ],
        "topics": ["Linked List", "Math", "Recursion"],
        "companies": ["Amazon", "Microsoft", "Adobe", "Bloomberg"],
        "hints": [
            "Keep track of the carry using a variable",
            "Don't forget to handle the carry after the loop ends"
        ],
        "solution_template": {
            "python": """def addTwoNumbers(l1, l2):
    # Write your solution here
    pass""",
            "javascript": """function addTwoNumbers(l1, l2) {
    // Write your solution here
}""",
            "java": """class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Write your solution here
        return null;
    }
}""",
            "cpp": """class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // Write your solution here
        return nullptr;
    }
};"""
        },
        "acceptance_rate": 0.0,
        "total_submissions": 0,
        "total_accepted": 0,
        "created_at": datetime.utcnow()
    }
    
    result = await db.problems.insert_one(problem_2)
    problem_2_id = str(result.inserted_id)
    print(f"✅ Created Problem 2: Add Two Numbers (ID: {problem_2_id})")
    
    # ========== Problem 3: Longest Substring Without Repeating Characters ==========
    problem_3 = {
        "problem_number": 3,
        "title": "Longest Substring Without Repeating Characters",
        "slug": "longest-substring-without-repeating-characters",
        "difficulty": "Medium",
        "description": """Given a string s, find the length of the longest substring without repeating characters.""",
        "examples": [
            {
                "input": 's = "abcabcbb"',
                "output": "3",
                "explanation": 'The answer is "abc", with the length of 3.'
            },
            {
                "input": 's = "bbbbb"',
                "output": "1",
                "explanation": 'The answer is "b", with the length of 1.'
            },
            {
                "input": 's = "pwwkew"',
                "output": "3",
                "explanation": 'The answer is "wke", with the length of 3.'
            }
        ],
        "constraints": [
            "0 <= s.length <= 5 * 10⁴",
            "s consists of English letters, digits, symbols and spaces."
        ],
        "topics": ["String", "Hash Table", "Sliding Window"],
        "companies": ["Amazon", "Google", "Microsoft", "Facebook"],
        "hints": [
            "Use a sliding window approach with two pointers",
            "Keep track of characters you've seen in a hash set"
        ],
        "solution_template": {
            "python": """def lengthOfLongestSubstring(s):
    # Write your solution here
    pass""",
            "javascript": """function lengthOfLongestSubstring(s) {
    // Write your solution here
}""",
            "java": """class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution here
        return 0;
    }
}""",
            "cpp": """class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your solution here
        return 0;
    }
};"""
        },
        "acceptance_rate": 0.0,
        "total_submissions": 0,
        "total_accepted": 0,
        "created_at": datetime.utcnow()
    }
    
    result = await db.problems.insert_one(problem_3)
    problem_3_id = str(result.inserted_id)
    print(f"✅ Created Problem 3: Longest Substring (ID: {problem_3_id})")
    
    print("\n🎉 Database seeding completed successfully!")
    print(f"\n📊 Summary:")
    print(f"   - Problems created: 3")
    print(f"   - Test cases created: {len(two_sum_testcases)}")
    print(f"\n🔗 Next steps:")
    print(f"   1. Start FastAPI: cd backend && uvicorn app.main:app --reload")
    print(f"   2. Visit API docs: http://localhost:8000/docs")
    print(f"   3. Make sure Judge0 is running: docker-compose up -d")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
