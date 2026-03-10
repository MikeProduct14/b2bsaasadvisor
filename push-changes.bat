@echo off
echo Adding changes...
git add .

echo Committing...
git commit -m "Update CNAME to www.productmike.ru"

echo Pushing to GitHub...
git push

echo.
echo Done! Wait 1-2 minutes and check:
echo https://www.productmike.ru/admin/leads
echo.
pause
