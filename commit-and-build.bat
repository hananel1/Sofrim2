@echo off
echo Preparing Sofrim for GitHub Actions Build
echo =========================================
echo.

echo Step 1: Adding all files to git...
git add .

echo Step 2: Committing changes...
git commit -m "Fix GitHub Actions build - add package-lock.json and updated workflow"

echo Step 3: Creating version tag...
set /p version="Enter version number (e.g., 1.8.3): "
git tag v%version%

echo Step 4: Pushing to GitHub...
git push origin main
git push origin v%version%

echo.
echo ============================================
echo SUCCESS! GitHub Actions should now build your APK
echo ============================================
echo.
echo Next steps:
echo 1. Go to your GitHub repository
echo 2. Click on "Actions" tab
echo 3. Watch the build progress
echo 4. Download APK from "Releases" when complete
echo.
echo Build URL: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
echo.
pause
