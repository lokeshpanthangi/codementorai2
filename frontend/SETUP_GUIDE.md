docker-compose up -d
docker-compose ps
docker-compose down
docker-compose logs judge0-server
docker-compose up -d    # Start compiler
docker-compose down    # Stop compiler
# 🚀 Using Judge0 Cloud Compiler (No Docker Needed)

## Step-by-Step Guide

### 1️⃣ Subscribe to Judge0 CE on RapidAPI (Free Tier)

1. Visit the [Judge0 CE RapidAPI page](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Sign in or create a RapidAPI account
3. Click **Subscribe** and choose the **Basic (Free)** plan
4. Copy your personal **X-RapidAPI-Key** from the Judge0 CE dashboard

### 2️⃣ Configure Your Environment

1. Open `frontend/.env`
2. Set the Judge0 values (replace with your own key):

```properties
VITE_JUDGE0_URL=https://judge0-ce.p.rapidapi.com
VITE_JUDGE0_API_KEY=your_rapidapi_key_here
```

> ⚠️ Treat this key like a password. Don’t commit `.env` to Git.

3. If you update `.env`, restart the Vite dev server.

### 3️⃣ Verify Judge0 Connectivity

Use this one-liner in PowerShell to confirm the API is reachable:

```powershell
curl.exe -H "X-RapidAPI-Key: $env:VITE_JUDGE0_API_KEY" -H "X-RapidAPI-Host: judge0-ce.p.rapidapi.com" https://judge0-ce.p.rapidapi.com/about
```

You should receive a JSON payload describing the Judge0 service. If you get a 401, double-check your key.

### 4️⃣ Start Your React App

```powershell
npm install
npm run dev
```

Your app will now execute code through the hosted Judge0 API.

## 📊 What You Get

✅ **Real code execution** for 60+ languages (Python, JavaScript, Java, C/C++, Go, Rust, etc.)

✅ **Built-in features**:
- Compile & run user code
- Public test case validation via **Run**
- Full test suite validation via **Submit**
- Execution time & memory usage from Judge0
- Compiler and runtime error output

## 🔧 Troubleshooting

| Symptom | Fix |
| --- | --- |
| 401 Unauthorized | Ensure the `VITE_JUDGE0_API_KEY` is correct and you subscribed to the Basic plan. |
| 429 Too Many Requests | The free tier allows 50 requests/day. Wait or upgrade the plan. |
| Network errors | Make sure your firewall allows outbound HTTPS requests to `judge0-ce.p.rapidapi.com`. |
| Nothing happens on Run/Submit | Check browser devtools for request errors and confirm `.env` values are loaded (restart dev server). |

## 📝 Daily Workflow

```powershell
npm run dev   # Start the frontend
# Write code, click Run for public cases or Submit for full validation
```

## 💡 Pro Tips

1. **Protect your key**: Use a separate key for development vs. production.
2. **Monitor usage**: RapidAPI shows daily request counts—handy for avoiding rate limits.
3. **Add retry logic**: If you expect high traffic, consider exponential backoff on 429 responses.
4. **Self-host later**: If you outgrow the free tier, you can still deploy Judge0 yourself and just update the `.env` URL.

## 🎯 Try It Now

1. Go to `http://localhost:5173/problem/<slug>`
2. Choose a language and write your solution
3. Click **Run** to execute against public (non-hidden) tests
4. Click **Submit** to execute against every test (public + hidden)

## 🌐 Deploy to Production

1. Set environment variables on your hosting provider (never hard-code keys).
2. Use a server-side proxy if you need to hide the RapidAPI key from the client.
3. Consider upgrading your RapidAPI plan or self-hosting Judge0 for higher limits.

