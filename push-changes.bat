@echo off
echo Adding changes...
git add .

echo Committing...
git commit -m "Add 404.html for SPA routing support"

echo Pushing to GitHub...
git push

echo.
echo Done! Wait 1-2 minutes and check:
echo https://www.productmike.ru/admin/leads
echo.
echo Clear browser cache (Ctrl+Shift+R) if needed
echo.
pause
