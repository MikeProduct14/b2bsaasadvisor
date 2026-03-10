@echo off
echo Adding new files...
git add .

echo Creating commit...
git commit -m "Add custom domain productmike.ru"

echo Pushing to GitHub...
git push

echo.
echo Done! Now configure DNS:
echo.
echo 1. Go to GitHub Settings - Pages
echo 2. Add custom domain: productmike.ru
echo 3. Wait for DNS check
echo.
echo Then update DNS on Beget:
echo Type: A
echo Name: productmike.ru (or @)
echo Value: 185.199.108.153
echo.
echo Type: A
echo Name: productmike.ru (or @)
echo Value: 185.199.109.153
echo.
echo Type: A
echo Name: productmike.ru (or @)
echo Value: 185.199.110.153
echo.
echo Type: A
echo Name: productmike.ru (or @)
echo Value: 185.199.111.153
echo.
pause
