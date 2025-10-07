# Judge0 Compiler Setup

## Quick Start

### 1. Start Judge0 Compiler
```bash
docker-compose up -d
```

### 2. Check if it's running
```bash
docker-compose ps
```

### 3. Test the API
Open browser: http://localhost:2358/about

### 4. Stop the compiler
```bash
docker-compose down
```

## What This Does

- **judge0-server**: Main API server (runs on port 2358)
- **judge0-workers**: Background workers that execute code
- **judge0-db**: PostgreSQL database for submissions
- **judge0-redis**: Redis for job queue

## Supported Languages

- Python (71)
- JavaScript (63)
- Java (62)
- C++ (54)
- C (50)
- And 60+ more languages!

## Language IDs for API

```javascript
const LANGUAGE_IDS = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
  c: 50
};
```

## API Usage

### Submit Code
```bash
POST http://localhost:2358/submissions?base64_encoded=false&wait=true

{
  "source_code": "print('Hello World')",
  "language_id": 71,
  "stdin": "",
  "expected_output": "Hello World\n"
}
```

### Get Submission
```bash
GET http://localhost:2358/submissions/{token}
```

## Requirements

- Docker Desktop installed
- At least 2GB RAM available
- Port 2358 available

## Troubleshooting

If containers fail to start:
```bash
docker-compose logs judge0-server
```

To rebuild:
```bash
docker-compose down
docker-compose up -d --build
```

## Security Note

For production:
- Change the POSTGRES_PASSWORD in docker-compose.yml
- Add authentication to the API
- Use HTTPS
- Set up rate limiting
