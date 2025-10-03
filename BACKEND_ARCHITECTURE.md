# 🎯 CodeMentor AI - Complete Backend Architecture

## 📊 **Database Schema Design (MongoDB)**

### **Collections Overview**

#### 1. **users** Collection
```javascript
{
  _id: ObjectId,
  username: string (unique, 3-50 chars),
  email: string (unique, valid email),
  hashed_password: string (bcrypt hashed),
  full_name: string (optional),
  created_at: datetime,
  is_active: boolean,
  solved_problems: [string] // Array of problem IDs
}
```

**Indexes:**
- `username` (unique)
- `email` (unique)

#### 2. **problems** Collection
```javascript
{
  _id: ObjectId,
  problem_number: int (1, 2, 3...),
  title: string,
  slug: string (URL-friendly: "two-sum"),
  difficulty: string ("Easy", "Medium", "Hard"),
  description: string (Markdown formatted),
  examples: [
    {
      input: string,
      output: string,
      explanation: string
    }
  ],
  constraints: [string],
  topics: [string], // ["Array", "Hash Table"]
  companies: [string], // ["Amazon", "Google"]
  hints: [string],
  solution_template: {
    python: string,
    javascript: string,
    java: string,
    cpp: string,
    // ... more languages
  },
  acceptance_rate: float (0-100),
  total_submissions: int,
  total_accepted: int,
  created_at: datetime
}
```

**Indexes:**
- `slug` (unique)
- `problem_number` (unique)
- `difficulty` (for filtering)
- `topics` (for filtering)

#### 3. **testcases** Collection
```javascript
{
  _id: ObjectId,
  problem_id: string (references problems._id),
  is_hidden: boolean, // false = visible, true = hidden
  order: int, // Display order (1, 2, 3...)
  input_data: string, // JSON or formatted input
  expected_output: string,
  explanation: string (optional, for visible cases)
}
```

**Indexes:**
- `problem_id` (compound with is_hidden)
- `problem_id + order`

**Usage:**
- **Visible test cases** (`is_hidden: false`): Shown to user, used for "Run" button (3 cases)
- **Hidden test cases** (`is_hidden: true`): Used for "Submit" button (5-10 cases)

#### 4. **submissions** Collection
```javascript
{
  _id: ObjectId,
  user_id: string (references users._id),
  problem_id: string (references problems._id),
  language: string ("python", "javascript", etc.),
  source_code: string (full code submitted),
  status: string, // "Accepted", "Wrong Answer", "Runtime Error", etc.
  passed_test_cases: int,
  total_test_cases: int,
  execution_time: float (average in seconds),
  memory_used: float (average in KB),
  error_message: string (optional),
  test_results: [
    {
      testCase: int,
      passed: boolean,
      stdout: string,
      stderr: string,
      compile_output: string,
      time: float,
      memory: int,
      status: string
    }
  ],
  submitted_at: datetime
}
```

**Indexes:**
- `user_id + submitted_at` (for user history)
- `problem_id + status` (for problem stats)

#### 5. **user_progress** Collection
```javascript
{
  _id: ObjectId,
  user_id: string (references users._id),
  problem_id: string (references problems._id),
  status: string, // "Solved", "Attempted", "Not Started"
  best_submission_id: string (references submissions._id),
  attempts: int,
  first_solved_at: datetime (optional),
  last_attempted_at: datetime
}
```

**Indexes:**
- `user_id + problem_id` (unique compound)
- `user_id + status`

## 🔧 **Backend Architecture**

### **Technology Stack**
- **Framework:** FastAPI (Python 3.9+)
- **Database:** MongoDB with Motor (async driver)
- **Authentication:** JWT tokens with bcrypt password hashing
- **Code Execution:** Judge0 API integration
- **Validation:** Pydantic models

### **API Endpoints**

#### **Authentication** (`/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new user | ❌ |
| POST | `/auth/login` | Login and get JWT token | ❌ |
| GET | `/auth/me` | Get current user info | ✅ |

#### **Problems** (`/problems`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/problems` | Get all problems (with filters) | ❌ |
| GET | `/problems/{id}` | Get specific problem | ❌ |
| GET | `/problems/{id}/stats` | Get problem statistics | ❌ |

**Query Parameters for GET /problems:**
- `difficulty` - Filter by Easy/Medium/Hard
- `topic` - Filter by topic (Array, String, etc.)
- `skip` - Pagination offset
- `limit` - Results per page (max 100)

#### **Test Cases** (`/testcases`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/testcases/{problem_id}/visible` | Get visible test cases | ❌ |
| GET | `/testcases/{problem_id}/hidden` | Get hidden test cases | ✅ |
| GET | `/testcases/{problem_id}/all` | Get all test cases | ✅ |

#### **Submissions** (`/submissions`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/submissions/run` | Run code (visible tests) | ✅ |
| POST | `/submissions/submit` | Submit code (hidden tests) | ✅ |
| GET | `/submissions/user/{user_id}` | Get user submissions | ✅ |

### **Code Execution Flow**

#### **Run Button Flow:**
1. User clicks "Run" with code
2. Frontend sends POST to `/submissions/run`
3. Backend fetches **visible test cases** (3 cases)
4. For each test case:
   - Send code to Judge0 API
   - Get execution result (stdout, stderr, time, memory)
   - Compare output with expected
5. Return results to frontend
6. **Does NOT save to database** (just returns results)

#### **Submit Button Flow:**
1. User clicks "Submit" with code
2. Frontend sends POST to `/submissions/submit`
3. Backend fetches **hidden test cases** (5-10 cases)
4. For each test case:
   - Send code to Judge0 API
   - Get execution result
   - Compare output with expected
5. Calculate final status (Accepted/Wrong Answer/Error)
6. **Save submission to database**
7. Update problem statistics (acceptance rate)
8. Update user progress
9. Return detailed results to frontend

## 🔐 **Security Features**

1. **Password Security**
   - Bcrypt hashing (never store plain passwords)
   - Configurable rounds (default: 12)

2. **JWT Tokens**
   - 30-minute expiration (configurable)
   - HS256 algorithm
   - Secret key from environment

3. **CORS Protection**
   - Whitelist allowed origins
   - Credentials support

4. **Input Validation**
   - Pydantic models validate all inputs
   - SQL injection protection (NoSQL)

## 📦 **Project Structure**

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Settings (env vars)
│   ├── database.py          # MongoDB connection
│   ├── models.py            # Pydantic models (all schemas)
│   ├── auth.py              # JWT & password functions
│   └── routes/
│       ├── __init__.py
│       ├── auth_routes.py      # User registration/login
│       ├── problem_routes.py   # Problem CRUD
│       ├── testcase_routes.py  # Test case retrieval
│       └── submission_routes.py # Code execution & submission
├── .env                     # Environment variables
├── .env.example             # Template for .env
├── .gitignore               # Git ignore rules
├── requirements.txt         # Python dependencies
├── seed_database.py         # Database seeding script
└── README.md                # Setup documentation
```

## 🚀 **Installation & Setup**

### **Step 1: Install Dependencies**

```powershell
# Create virtual environment
cd backend
python -m venv venv
.\venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

### **Step 2: Install & Start MongoDB**

**Option A: Local MongoDB**
```powershell
# Download from https://www.mongodb.com/try/download/community
# Start MongoDB
mongod --dbpath C:\data\db
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Update `MONGODB_URL` in `.env`

### **Step 3: Configure Environment**

`.env` file is already created with defaults. Update if needed:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=codementor_db
SECRET_KEY=<your-secret-key>
JUDGE0_API_URL=http://localhost:2358
```

### **Step 4: Seed Database**

```powershell
python seed_database.py
```

This creates:
- 3 sample problems (Two Sum, Add Two Numbers, Longest Substring)
- Test cases for each problem (visible + hidden)

### **Step 5: Start FastAPI Server**

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server runs at: **http://localhost:8000**

### **Step 6: Verify Setup**

Visit:
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## 🧪 **Testing with Swagger UI**

1. Go to http://localhost:8000/docs
2. Try endpoints in this order:

**Create User:**
```json
POST /auth/signup
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Login:**
```
POST /auth/login
username: john
password: password123
```

Copy the `access_token` from response.

**Authorize:**
Click "Authorize" button at top, paste token.

**Get Problems:**
```
GET /problems
```

**Run Code:**
```json
POST /submissions/run?problem_id=<PROBLEM_ID>&language=python
{
  "source_code": "def twoSum(nums, target):\n    return [0, 1]"
}
```

## 🔄 **Next Steps (Frontend Integration)**

1. Install Axios in frontend:
   ```bash
   npm install axios
   ```

2. Create API service in frontend:
   ```typescript
   // src/services/api.ts
   import axios from 'axios';
   
   const api = axios.create({
     baseURL: 'http://localhost:8000',
     headers: {
       'Content-Type': 'application/json'
     }
   });
   
   // Add token to requests
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   
   export default api;
   ```

3. Replace mock data:
   - `Problems.tsx`: Fetch from `/problems`
   - `Problem.tsx`: Fetch from `/problems/{id}`
   - Run/Submit: Use `/submissions/run` and `/submissions/submit`

## 📚 **Additional Features to Implement**

### **Phase 2:**
- [ ] User profile page
- [ ] Submission history
- [ ] Problem filtering by company
- [ ] Leaderboard

### **Phase 3:**
- [ ] Discussion forum
- [ ] Official solutions
- [ ] Code hints system
- [ ] Real-time code collaboration

### **Phase 4:**
- [ ] Contest mode
- [ ] Daily challenges
- [ ] Achievement badges
- [ ] Email notifications

## 🎓 **Learning Resources**

- FastAPI: https://fastapi.tiangolo.com/
- MongoDB: https://www.mongodb.com/docs/
- Motor: https://motor.readthedocs.io/
- Pydantic: https://docs.pydantic.dev/
- JWT: https://jwt.io/introduction
- Judge0: https://ce.judge0.com/

---

**✅ Backend is fully configured and ready to use!**
**🔜 Next: Update frontend to connect to backend API**
