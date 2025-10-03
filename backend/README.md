# 🚀 FastAPI Backend Setup Guide

## Prerequisites

- Python 3.9+ installed
- MongoDB installed and running
- Judge0 Docker containers running
- Git (optional)

## 📦 Installation Steps

### 1. Install MongoDB

**Windows:**
```powershell
# Download from https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb

# Start MongoDB
mongod --dbpath C:\data\db
```

**Alternative: Use MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string and update `.env`

### 2. Set Up Python Environment

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate  # Windows PowerShell

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```powershell
# Copy example env file
copy .env.example .env

# Edit .env file and update:
# - MONGODB_URL (if using Atlas or different port)
# - SECRET_KEY (generate with: openssl rand -hex 32)
```

### 4. Seed the Database

```powershell
# Make sure MongoDB is running
python seed_database.py
```

Expected output:
```
🌱 Starting database seeding...
✅ Cleared existing data
✅ Created Problem 1: Two Sum (ID: ...)
✅ Created 8 test cases for Two Sum
✅ Created Problem 2: Add Two Numbers (ID: ...)
✅ Created Problem 3: Longest Substring (ID: ...)
🎉 Database seeding completed successfully!
```

### 5. Start FastAPI Server

```powershell
# Make sure you're in backend directory with venv activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will start at: **http://localhost:8000**

### 6. Verify Installation

Open browser and visit:
- **API Documentation:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health
- **Root:** http://localhost:8000/

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings and environment config
│   ├── database.py          # MongoDB connection
│   ├── models.py            # Pydantic models
│   ├── auth.py              # JWT authentication
│   └── routes/
│       ├── __init__.py
│       ├── auth_routes.py      # /auth/* endpoints
│       ├── problem_routes.py   # /problems/* endpoints
│       ├── testcase_routes.py  # /testcases/* endpoints
│       └── submission_routes.py # /submissions/* endpoints
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Example environment config
├── requirements.txt         # Python dependencies
└── seed_database.py         # Database seeding script
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info (requires auth)

### Problems
- `GET /problems` - Get all problems (with filters)
- `GET /problems/{id}` - Get specific problem
- `GET /problems/{id}/stats` - Get problem statistics

### Test Cases
- `GET /testcases/{problem_id}/visible` - Get visible test cases
- `GET /testcases/{problem_id}/hidden` - Get hidden test cases
- `GET /testcases/{problem_id}/all` - Get all test cases

### Submissions
- `POST /submissions/run` - Run code against visible test cases
- `POST /submissions/submit` - Submit code against hidden test cases
- `GET /submissions/user/{user_id}` - Get user's submissions

## 🧪 Testing the API

### 1. Create a User

```bash
curl -X POST "http://localhost:8000/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### 2. Login

```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=password123"
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### 3. Get Problems

```bash
curl "http://localhost:8000/problems"
```

### 4. Run Code

```bash
curl -X POST "http://localhost:8000/submissions/run?problem_id=<PROBLEM_ID>&language=python" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "source_code": "def twoSum(nums, target):\n    return [0, 1]"
  }'
```

## 🗄️ MongoDB Collections

### `users`
Stores user accounts with hashed passwords

### `problems`
Contains all coding problems with descriptions, examples, constraints

### `testcases`
Stores test cases (both visible and hidden) for each problem

### `submissions`
Records every code submission with results

### `user_progress`
Tracks user progress on each problem

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: Could not connect to MongoDB
```
**Solution:** Ensure MongoDB is running:
```powershell
mongod --dbpath C:\data\db
```

### Judge0 Not Available
```
Error: Judge0 error: Connection refused
```
**Solution:** Start Judge0 containers:
```powershell
docker-compose up -d
```

### Import Errors
```
ModuleNotFoundError: No module named 'fastapi'
```
**Solution:** Activate venv and install dependencies:
```powershell
.\venv\Scripts\activate
pip install -r requirements.txt
```

### Port Already in Use
```
Error: Address already in use
```
**Solution:** Change port in `.env` or kill process using port 8000

## 📚 Next Steps

1. ✅ Backend is running on port 8000
2. ✅ MongoDB has sample problems
3. ✅ Judge0 is running on port 2358
4. 🔜 Update frontend to use backend API
5. 🔜 Add more problems to database
6. 🔜 Implement user leaderboard
7. 🔜 Add problem difficulty ratings

## 🔐 Security Notes

**For Production:**
- Change `SECRET_KEY` in `.env` (use strong random key)
- Use MongoDB Atlas with authentication
- Enable HTTPS
- Add rate limiting
- Implement refresh tokens
- Add input validation middleware
- Use environment-specific configs

## 📖 Additional Resources

- FastAPI Documentation: https://fastapi.tiangolo.com/
- MongoDB Motor: https://motor.readthedocs.io/
- Pydantic: https://docs.pydantic.dev/
- JWT: https://jwt.io/
