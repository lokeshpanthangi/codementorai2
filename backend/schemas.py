from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class Boilerplate(BaseModel):
    language_id: int = Field(..., description="Judge0 language_id (e.g. 71 for Python 3)")
    language_name: str = Field(..., description="e.g. 'python3'")
    code: str = Field(..., description="default starter code")


class Example(BaseModel):
    input: str
    output: str
    explanation: str


class QuestionCreate(BaseModel):
    slug: str = Field(..., min_length=3, max_length=200, description="e.g. 'two-sum'")
    title: str = Field(..., min_length=3, max_length=200, description="e.g. 'Two Sum'")
    description: str = Field(..., description="Markdown or HTML problem statement")
    difficulty: str = Field(..., pattern="^(Easy|Medium|Hard)$")
    tags: List[str] = Field(default_factory=list, description="e.g. ['array', 'hash-table']")
    boilerplates: List[Boilerplate] = Field(default_factory=list, description="one per supported language")
    input_format: str
    output_format: str
    constraints: str
    examples: List[Example] = Field(default_factory=list)
    run_template: str = Field(..., description="Template code to run user's solution with inputs")
    time_limit_ms: int = Field(default=1000, description="e.g. 1000")
    memory_limit_kb: int = Field(default=65536, description="e.g. 65536")


class QuestionResponse(BaseModel):
    id: str = Field(alias="_id")
    slug: str
    title: str
    description: str
    difficulty: str
    tags: List[str]
    boilerplates: List[Boilerplate]
    input_format: str
    output_format: str
    constraints: str
    examples: List[Example]
    run_template: str
    time_limit_ms: int
    memory_limit_kb: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class QuestionUpdate(BaseModel):
    slug: Optional[str] = Field(None, min_length=3, max_length=200)
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = None
    difficulty: Optional[str] = Field(None, pattern="^(Easy|Medium|Hard)$")
    tags: Optional[List[str]] = None
    boilerplates: Optional[List[Boilerplate]] = None
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    constraints: Optional[str] = None
    examples: Optional[List[Example]] = None
    run_template: Optional[str] = None
    time_limit_ms: Optional[int] = None
    memory_limit_kb: Optional[int] = None


# Test Case schemas
class TestCaseCreate(BaseModel):
    question_id: str = Field(..., description="Reference to questions._id")
    stdin: str = Field(default="", description="Input to feed into Judge0")
    expected_stdout: str = Field(default="", description="Output to compare against")
    is_hidden: bool = Field(default=False, description="false for sample test cases shown to user")
    is_public: bool = Field(default=True, description="true if displayed in UI (like examples)")
    weight: Optional[float] = Field(default=None, description="optional, used for scoring partial credit")


class TestCaseResponse(BaseModel):
    id: str = Field(alias="_id")
    question_id: str
    stdin: str
    expected_stdout: str
    is_hidden: bool
    is_public: bool
    weight: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class TestCaseUpdate(BaseModel):
    stdin: Optional[str] = None
    expected_stdout: Optional[str] = None
    is_hidden: Optional[bool] = None
    is_public: Optional[bool] = None
    weight: Optional[float] = None


# Legacy schemas for backward compatibility (can be removed later)
class ProblemExample(BaseModel):
    input: str
    output: str
    explanation: Optional[str] = None


class ProblemCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    slug: str = Field(..., min_length=3, max_length=200)
    difficulty: str = Field(..., pattern="^(Easy|Medium|Hard)$")
    description: str
    input_format: str
    output_format: str
    constraints: str
    topics: List[str] = Field(default_factory=list)
    companies: List[str] = Field(default_factory=list)
    examples: List[ProblemExample] = Field(default_factory=list)
    boilerplates: Dict[str, str] = Field(default_factory=dict)
    wrapper_code: Dict[str, str] = Field(default_factory=dict)
    function_name: str = Field(default="solution")
    function_signature: Dict[str, str] = Field(default_factory=dict)
    input_parsing: Dict[str, str] = Field(default_factory=dict)
    output_formatting: Dict[str, str] = Field(default_factory=dict)


class ProblemResponse(BaseModel):
    id: str
    title: str
    slug: str
    difficulty: str
    description: str
    input_format: str
    output_format: str
    constraints: str
    topics: List[str]
    companies: List[str]
    examples: List[ProblemExample]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    boilerplates: Dict[str, str]
    wrapper_code: Dict[str, str]
    function_name: str
    function_signature: Dict[str, str]
    input_parsing: Dict[str, str]
    output_formatting: Dict[str, str]