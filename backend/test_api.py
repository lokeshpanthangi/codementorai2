import asyncio
import requests
import json

async def test_problems_api():
    # First, let's create a test user and login
    base_url = "http://127.0.0.1:8000"
    
    # Test user credentials
    test_user = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    try:
        # Try to signup (might fail if user exists, that's ok)
        signup_response = requests.post(f"{base_url}/users/signup", json=test_user)
        print(f"Signup response: {signup_response.status_code}")
    except Exception as e:
        print(f"Signup failed (might already exist): {e}")
    
    # Login to get token
    login_data = {
        "username": test_user["email"],  # OAuth2 expects email in username field
        "password": test_user["password"]
    }
    
    login_response = requests.post(
        f"{base_url}/users/login", 
        data=login_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    
    if login_response.status_code == 200:
        token_data = login_response.json()
        access_token = token_data["access_token"]
        print(f"Login successful, got token: {access_token[:20]}...")
        
        # Now test the problems endpoint
        headers = {"Authorization": f"Bearer {access_token}"}
        problems_response = requests.get(f"{base_url}/problems/", headers=headers)
        
        print(f"Problems API response status: {problems_response.status_code}")
        if problems_response.status_code == 200:
            problems = problems_response.json()
            print(f"Successfully fetched {len(problems)} problems")
            for i, problem in enumerate(problems[:2]):  # Show first 2
                print(f"Problem {i+1}: {problem.get('title', 'N/A')}")
                print(f"  Created at: {problem.get('created_at', 'N/A')}")
                print(f"  Updated at: {problem.get('updated_at', 'N/A')}")
        else:
            print(f"Problems API failed: {problems_response.text}")
    else:
        print(f"Login failed: {login_response.status_code} - {login_response.text}")

if __name__ == "__main__":
    asyncio.run(test_problems_api())