@echo off
REM IPC Finder Server Startup Script
echo.
echo ==========================================
echo   IPC FINDER - Starting Server
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB connection string is set
echo Checking configuration...
echo.

REM Kill any existing node processes
echo Stopping any existing server...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Starting IPC Finder Server...
echo.
echo Server will run on: http://localhost:5000
echo.
echo ==========================================
echo   SERVER RUNNING - DO NOT CLOSE!
echo ==========================================
echo.
echo Open your browser and go to:
echo http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
node server.js

pause
