@echo off
echo Sofrim Omer Images Generator
echo ============================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo Installing Sharp library...
npm install sharp

if %errorlevel% neq 0 (
    echo ERROR: Failed to install Sharp
    pause
    exit /b 1
)

echo.
echo Generating Omer images...
node generate-omer-images-sharp.js

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS: All Omer images generated!
    echo Check the 'generated-omer-images' folder
) else (
    echo.
    echo ERROR: Image generation failed
)

echo.
pause
