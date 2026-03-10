@echo off
echo Initializing Git repository...
git init

echo Adding files...
git add .

echo Creating commit...
git commit -m "Initial commit"

echo Setting main branch...
git branch -M main

echo Adding remote...
git remote add origin https://github.com/MikeProduct14/b2bsaasadvisor.git

echo Pushing to GitHub...
git push -u origin main

echo.
echo Done! Check GitHub Actions at:
echo https://github.com/MikeProduct14/b2bsaasadvisor/actions
echo.
pause
