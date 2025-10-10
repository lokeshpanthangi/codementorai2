# Environment Configuration

## Setup Instructions

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the values in `.env` according to your environment:**

### Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |
| `VITE_JUDGE0_URL` | Judge0 code execution service URL | `http://localhost:2358` |
| `VITE_JUDGE0_API_KEY` | Judge0 API key (for hosted APIs) | `(empty)` |

### Judge0 Configuration Options

**Option 1: RapidAPI (Recommended for free tier)**
```env
VITE_JUDGE0_URL=https://judge0-ce.p.rapidapi.com
VITE_JUDGE0_API_KEY=your_rapidapi_key_here
```
- Free tier: 50 requests/day
- Sign up at: https://rapidapi.com/judge0-official/api/judge0-ce

**Option 2: Sulu Solutions Hosted API**
```env
VITE_JUDGE0_URL=https://ce.judge0.com
VITE_JUDGE0_API_KEY=your_sulu_api_key_here
```
- Sign up at: https://ce.judge0.com/

**Option 3: Local Docker**
```env
VITE_JUDGE0_URL=http://localhost:2358
VITE_JUDGE0_API_KEY=
```

### Development Environment

For local development, the default values in `.env.example` should work if you're running:
- Backend on `http://localhost:8000`
- Judge0 on `http://localhost:2358`

### Production Environment

For production deployment, update the `.env` file with your production URLs:

```env
VITE_API_BASE_URL=https://api.yourproductiondomain.com
VITE_JUDGE0_URL=https://judge0.yourproductiondomain.com
```

## Important Notes

- ⚠️ **Never commit `.env` file to version control** - it's already in `.gitignore`
- ✅ Always commit `.env.example` as a template for other developers
- 🔄 Restart the Vite dev server after changing `.env` values
- 🏗️ Vite requires environment variables to be prefixed with `VITE_`

## Troubleshooting

### Changes not taking effect?

1. Make sure you restart the Vite dev server after changing `.env`
2. Clear browser cache and hard reload (Ctrl+Shift+R)
3. Verify the variable name starts with `VITE_`

### API calls failing?

1. Check that `VITE_API_BASE_URL` matches your running backend server
2. Ensure backend CORS settings allow requests from your frontend URL
3. Verify backend server is running and accessible

### Judge0 not working?

1. **For hosted APIs:**
   - Verify your API key is correct
   - Check rate limits (RapidAPI free tier: 50 requests/day)
   - Ensure `VITE_JUDGE0_URL` and `VITE_JUDGE0_API_KEY` are set correctly

2. **For local Docker:**
   - Verify `VITE_JUDGE0_URL` points to running Judge0 instance
   - Run `docker-compose up -d` to start Judge0 services
   - Test Judge0 availability: `curl http://localhost:2358/about`

3. **API Key issues:**
   - RapidAPI: Make sure you've subscribed to the Basic (free) plan
   - Sulu Solutions: Verify your account is active
   - Check that your API key is properly set in `.env`
