@echo off
echo === Disk Space Cleanup ===
echo.

echo Cleaning npm cache...
call npm cache clean --force

echo.
echo Removing Next.js build folders...
if exist .next (
    rmdir /s /q .next
    echo Removed .next folder
)
if exist out (
    rmdir /s /q out
    echo Removed out folder
)

echo.
echo Removing build folder...
if exist build (
    rmdir /s /q build
    echo Removed build folder
)

echo.
echo Removing node_modules (will reinstall)...
if exist node_modules (
    rmdir /s /q node_modules
    echo Removed node_modules
)

echo.
echo Cleanup complete!
echo.
echo You can now run: npm install
pause

