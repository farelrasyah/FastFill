@echo off
REM FastFill AI Extension - Clean Build Script for Windows
REM Restores placeholder API key before committing to Git

echo 🧹 FastFill AI Extension Clean Script
echo ====================================

set API_KEY_PLACEHOLDER=REPLACE_WITH_ACTUAL_API_KEY
set ACTUAL_API_KEY=AIzaSyARIKwnlrUeIxpGvTS5VhRxuR2HhWQCxoY
set CONFIG_FILE=config.js

echo 🔄 Restoring API key placeholder...

REM Replace actual API key back with placeholder
powershell -Command "(Get-Content '%CONFIG_FILE%') -replace '%ACTUAL_API_KEY%', '%API_KEY_PLACEHOLDER%' | Set-Content '%CONFIG_FILE%'"

if %errorlevel% equ 0 (
    echo ✅ Placeholder restored successfully!
    echo 📁 Safe to commit to Git
) else (
    echo ❌ Failed to restore placeholder
    exit /b 1
)
