# 🚀 Setting Up Your Own Compiler

## Step-by-Step Guide

### 1️⃣ Install Docker Desktop

Download and install Docker Desktop:
- **Windows**: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
- After installation, **restart your computer**
- Open Docker Desktop and wait for it to start

### 2️⃣ Start Judge0 Compiler

Open PowerShell in your project folder and run:

```powershell
docker-compose up -d
```

This will:
- Download Judge0 images (first time only, ~2GB)
- Start the compiler services
- Make it available at `http://localhost:2358`

### 3️⃣ Verify It's Running

Check if containers are running:
```powershell
docker-compose ps
```

You should see 4 containers:
- ✅ judge0-server
- ✅ judge0-workers
- ✅ judge0-db
- ✅ judge0-redis

Test the API:
```powershell
curl http://localhost:2358/about
```

### 4️⃣ Start Your React App

```powershell
npm run dev
```

Now your app will use the local compiler!

## 📊 What You Get

✅ **Real code execution** for:
- Python 3
- JavaScript (Node.js)
- Java
- C++
- C
- 60+ more languages

✅ **Features**:
- Compile and run code
- Test case validation
- Execution time tracking
- Memory usage tracking
- Error messages
- Standard input/output

## 🛑 Stop the Compiler

When you're done:
```powershell
docker-compose down
```

## 🔧 Troubleshooting

### Issue: "docker-compose: command not found"
**Solution**: Make sure Docker Desktop is running

### Issue: "Port 2358 is already in use"
**Solution**: Change the port in docker-compose.yml:
```yaml
ports:
  - "3358:2358"  # Use port 3358 instead
```
Then update `JUDGE0_API_URL` in `src/services/judge0Service.ts`

### Issue: Containers keep restarting
**Solution**: Check logs:
```powershell
docker-compose logs judge0-server
```

### Issue: Out of memory
**Solution**: Give Docker more RAM:
- Open Docker Desktop
- Settings → Resources
- Increase Memory to 4GB

## 📝 Daily Workflow

**Start coding:**
```powershell
docker-compose up -d    # Start compiler
npm run dev            # Start React app
```

**Done for the day:**
```powershell
docker-compose down    # Stop compiler
```

## 💡 Pro Tips

1. **Auto-start**: Add to Windows startup
   - Docker Desktop can start automatically
   - Add this script to startup folder

2. **View Logs**: See what's happening
   ```powershell
   docker-compose logs -f judge0-server
   ```

3. **Restart Services**: If something's stuck
   ```powershell
   docker-compose restart
   ```

4. **Clean Up**: Remove all data
   ```powershell
   docker-compose down -v
   ```

## 🎯 Next Steps

Your Problem page is now ready to use real compilation!

Try it:
1. Go to http://localhost:5173/problem/1
2. Write some Python code
3. Click "Run" - it will execute on your local Judge0!

## 🌐 Deploy to Production

When ready to deploy:
1. Host Judge0 on a cloud server (AWS, DigitalOcean, etc.)
2. Update `JUDGE0_API_URL` to your server URL
3. Add authentication
4. Use HTTPS

