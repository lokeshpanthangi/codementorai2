# ⚠️ IMPORTANT: Restart Dev Server After .env Changes

## Why?

Vite **only loads `.env` files when the dev server starts**. If you change `.env` while the server is running, the changes won't take effect until you restart.

## How to Restart

### Option 1: Stop and Start (Recommended)
1. In your terminal where `npm run dev` is running, press `Ctrl+C` to stop
2. Run `npm run dev` again

### Option 2: Kill and Restart (If Ctrl+C doesn't work)
```powershell
# Kill all node processes
taskkill /F /IM node.exe

# Start dev server again
cd c:\Users\DELL\Desktop\codementorai2\frontend
npm run dev
```

## Verify Environment Variables

After restarting, open the browser console and you should see:

```
🔧 Judge0 Configuration: {
  url: "https://judge0-ce.p.rapidapi.com",
  hasApiKey: true,
  apiKeyPrefix: "f0d95e5377..."
}
```

If you still see `http://localhost:2358`, the `.env` file is not being loaded properly.

## Troubleshooting

### Issue: Still showing localhost:2358
**Cause**: Dev server wasn't fully restarted or browser cache

**Solution**:
1. Kill the dev server completely
2. Clear browser cache (Ctrl+Shift+Delete)
3. Start dev server fresh
4. Hard reload browser (Ctrl+Shift+R)

### Issue: Environment variable showing as undefined
**Cause**: Variable name doesn't start with `VITE_`

**Solution**: All Vite env vars MUST start with `VITE_` prefix

### Issue: .env file is correct but not loading
**Cause**: Multiple .env files or wrong directory

**Solution**:
```powershell
# Verify .env location
cd c:\Users\DELL\Desktop\codementorai2\frontend
Get-Content .env
```

The `.env` file MUST be in the `frontend` folder (same level as `package.json`).
