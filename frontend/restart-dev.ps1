# Stop any running dev servers
Write-Host "🛑 Stopping any running Node.js processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

# Navigate to frontend directory
Set-Location "c:\Users\DELL\Desktop\codementorai2\frontend"

# Verify .env file
Write-Host "`n📋 Current .env configuration:" -ForegroundColor Cyan
Get-Content .env

Write-Host "`n✅ Environment file verified!" -ForegroundColor Green

# Clear any build cache
Write-Host "`n🧹 Clearing build cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✓ Vite cache cleared" -ForegroundColor Green
}

# Start dev server
Write-Host "`n🚀 Starting dev server with fresh environment..." -ForegroundColor Cyan
Write-Host "⚠️  After server starts, open browser and check console for:" -ForegroundColor Yellow
Write-Host "   🔧 Judge0 Configuration: { url: 'https://judge0-ce.p.rapidapi.com', ... }" -ForegroundColor Yellow
Write-Host "`n" -ForegroundColor White

npm run dev
