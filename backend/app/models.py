from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Any
from datetime import datetime
from bson import ObjectId
from pydantic_core import core_schema

# Custom ObjectId type for Pydantic v2
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler):
        return core_schema.union_schema(
            [
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema(
                    [
                        core_schema.str_schema(),
                        core_schema.no_info_plain_validator_function(cls.validate),
                    ]
                ),
            ],
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

# ============= USER MODELS =============
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    solved_problems: List[str] = []  # Problem IDs
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserResponse(UserBase):
    id: str
    created_at: datetime
    solved_problems: List[str]
    
    class Config:
        from_attributes = True

# ============= PROBLEM MODELS =============
class ProblemBase(BaseModel):
    title: str
    slug: str  # URL-friendly: "two-sum"
    difficulty: str  # "Easy", "Medium", "Hard"
    description: str
    examples: List[dict]  # [{"input": "...", "output": "...", "explanation": "..."}]
    constraints: List[str]
    topics: List[str]  # ["Array", "Hash Table"]
    companies: List[str]  # ["Amazon", "Google"]
    hints: Optional[List[str]] = []
    solution_template: dict  # {"python": "def twoSum...", "javascript": "function..."}

class ProblemCreate(ProblemBase):
    pass

class ProblemInDB(ProblemBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    problem_number: int  # 1, 2, 3...
    acceptance_rate: float = 0.0
    total_submissions: int = 0
    total_accepted: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ProblemResponse(ProblemBase):
    id: str
    problem_number: int
    acceptance_rate: float
    total_submissions: int
    total_accepted: int
    
    class Config:
        from_attributes = True

# ============= TEST CASE MODELS =============
class TestCaseBase(BaseModel):
    problem_id: str
    is_hidden: bool  # False = visible, True = hidden for submission
    input_data: str  # JSON string or formatted input
    expected_output: str
    explanation: Optional[str] = None

class TestCaseCreate(TestCaseBase):
    pass

class TestCaseInDB(TestCaseBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    order: int  # Display order (1, 2, 3 for visible cases)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class TestCaseResponse(TestCaseBase):
    id: str
    order: int
    
    class Config:
        from_attributes = True

# ============= SUBMISSION MODELS =============
class SubmissionBase(BaseModel):
    user_id: str
    problem_id: str
    language: str
    source_code: str

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionInDB(SubmissionBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    status: str  # "Accepted", "Wrong Answer", "Runtime Error", etc.
    passed_test_cases: int = 0
    total_test_cases: int = 0
    execution_time: Optional[float] = None  # Average time
    memory_used: Optional[float] = None  # Average memory
    error_message: Optional[str] = None
    test_results: List[dict] = []  # Detailed results for each test
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class SubmissionResponse(SubmissionBase):
    id: str
    status: str
    passed_test_cases: int
    total_test_cases: int
    execution_time: Optional[float]
    memory_used: Optional[float]
    error_message: Optional[str]
    submitted_at: datetime
    
    class Config:
        from_attributes = True

# ============= USER PROGRESS MODELS =============
class UserProgressBase(BaseModel):
    user_id: str
    problem_id: str
    status: str  # "Solved", "Attempted", "Not Started"
    best_submission_id: Optional[str] = None
    attempts: int = 0
    
class UserProgressInDB(UserProgressBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    first_solved_at: Optional[datetime] = None
    last_attempted_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# ============= AUTH MODELS =============
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
