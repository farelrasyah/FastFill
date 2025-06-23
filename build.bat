@echo off
REM FastFill AI Extension - Build Script for Windows
REM Replaces placeholder API key with actual key for production build

echo 🔨 FastFill AI Extension Build Script
echo ======================================

REM Configuration
set API_KEY_PLACEHOLDER=REPLACE_WITH_ACTUAL_API_KEY
set ACTUAL_API_KEY=AIzaSyARIKwnlrUeIxpGvTS5VhRxuR2HhWQCxoY
set CONFIG_FILE=config.js

echo 📁 Checking config file...
if not exist "%CONFIG_FILE%" (
    echo ❌ Config file not found: %CONFIG_FILE%
    exit /b 1
)

echo 🔑 Replacing API key placeholder...
REM Create backup
copy "%CONFIG_FILE%" "%CONFIG_FILE%.backup" >nul

REM Replace placeholder with actual API key using PowerShell
powershell -Command "(Get-Content '%CONFIG_FILE%') -replace '%API_KEY_PLACEHOLDER%', '%ACTUAL_API_KEY%' | Set-Content '%CONFIG_FILE%'"

if %errorlevel% equ 0 (
    echo ✅ API key replaced successfully!
    echo 📦 Extension ready for distribution
    echo.
    echo ⚠️  IMPORTANT: Do not commit config.js after running this script!
    echo    Run 'build-clean.bat' to restore placeholder before committing
) else (
    echo ❌ Failed to replace API key
    exit /b 1
)
