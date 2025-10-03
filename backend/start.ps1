# CodeMentor AI - Backend Quick Start Script
# Run this script to start the backend server

Write-Host "🚀 CodeMentor AI Backend - Quick Start" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment exists
if (!(Test-Path "venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✅ Virtual environment created!" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install/update dependencies
Write-Host "📚 Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "⚠️  .env file not found! Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ .env file created! Please update with your settings." -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Pre-flight Checklist:" -ForegroundColor Cyan
Write-Host "   1. MongoDB running? (mongod or Atlas)" -ForegroundColor White
Write-Host "   2. Judge0 running? (docker-compose up -d)" -ForegroundColor White
Write-Host "   3. Database seeded? (python seed_database.py)" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Starting FastAPI server..." -ForegroundColor Green
Write-Host "   Server: http://localhost:8000" -ForegroundColor White
Write-Host "   Docs:   http://localhost:8000/docs" -ForegroundColor White
Write-Host ""

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
