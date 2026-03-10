@echo off
echo Adding new files...
git add .

echo Creating commit...
git commit -m "Fix router basename for GitHub Pages"

echo Pushing to GitHub...
git push

echo.
echo Done! Wait 1-2 minutes and check:
echo https://mikeproduct14.github.io/b2bsaasadvisor/
echo.
echo Also check GitHub Actions:
echo https://github.com/MikeProduct14/b2bsaasadvisor/actions
echo.
pause
