# PowerShell script to free up disk space
# Run as Administrator for best results

Write-Host "=== Disk Space Cleanup Script ===" -ForegroundColor Cyan
Write-Host ""

# Check available space before
$before = Get-PSDrive C | Select-Object Used, Free
Write-Host "Disk space BEFORE cleanup:" -ForegroundColor Yellow
Write-Host "  Used: $([math]::Round($before.Used / 1GB, 2)) GB" -ForegroundColor Yellow
Write-Host "  Free: $([math]::Round($before.Free / 1GB, 2)) GB" -ForegroundColor Yellow
Write-Host ""

$totalFreed = 0

# 1. Clean npm cache
Write-Host "1. Cleaning npm cache..." -ForegroundColor Green
try {
    $npmCache = npm cache verify 2>&1
    npm cache clean --force 2>&1 | Out-Null
    Write-Host "   ✓ npm cache cleaned" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Could not clean npm cache" -ForegroundColor Yellow
}

# 2. Remove node_modules from root (if exists)
Write-Host "2. Checking for node_modules..." -ForegroundColor Green
if (Test-Path ".\node_modules") {
    $size = (Get-ChildItem ".\node_modules" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Found node_modules: $([math]::Round($size, 2)) MB" -ForegroundColor Yellow
    $response = Read-Host "   Remove node_modules? (Y/N)"
    if ($response -eq "Y" -or $response -eq "y") {
        Remove-Item ".\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        $totalFreed += $size
        Write-Host "   ✓ node_modules removed" -ForegroundColor Green
    }
} else {
    Write-Host "   ✓ No node_modules found" -ForegroundColor Green
}

# 3. Remove .next build folder (Next.js - no longer needed)
Write-Host "3. Removing Next.js build files..." -ForegroundColor Green
$foldersToRemove = @(".next", "out", ".vercel")
foreach ($folder in $foldersToRemove) {
    if (Test-Path ".\$folder") {
        $size = (Get-ChildItem ".\$folder" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
        Remove-Item ".\$folder" -Recurse -Force -ErrorAction SilentlyContinue
        $totalFreed += $size
        Write-Host "   ✓ Removed $folder ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
    }
}

# 4. Clean Windows Temp files
Write-Host "4. Cleaning Windows Temp files..." -ForegroundColor Green
$tempPaths = @(
    "$env:TEMP\*",
    "$env:LOCALAPPDATA\Temp\*",
    "C:\Windows\Temp\*"
)
foreach ($tempPath in $tempPaths) {
    try {
        $files = Get-ChildItem $tempPath -Recurse -ErrorAction SilentlyContinue -Force
        $size = ($files | Measure-Object -Property Length -Sum).Sum / 1MB
        Remove-Item $tempPath -Recurse -Force -ErrorAction SilentlyContinue
        $totalFreed += $size
        Write-Host "   ✓ Cleaned $tempPath ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠ Could not clean $tempPath" -ForegroundColor Yellow
    }
}

# 5. Clean npm cache (more thorough)
Write-Host "5. Cleaning npm cache thoroughly..." -ForegroundColor Green
try {
    $npmCachePath = "$env:APPDATA\npm-cache"
    if (Test-Path $npmCachePath) {
        $size = (Get-ChildItem $npmCachePath -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
        Remove-Item "$npmCachePath\*" -Recurse -Force -ErrorAction SilentlyContinue
        $totalFreed += $size
        Write-Host "   ✓ Cleaned npm cache ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠ Could not clean npm cache" -ForegroundColor Yellow
}

# 6. Clean package-lock files in parent directories (if any)
Write-Host "6. Checking for unnecessary package-lock files..." -ForegroundColor Green
$parentPath = Split-Path -Parent $PWD
$lockFile = Join-Path $parentPath "package-lock.json"
if (Test-Path $lockFile) {
    Write-Host "   Found package-lock.json in parent directory" -ForegroundColor Yellow
    $response = Read-Host "   Remove it? (Y/N)"
    if ($response -eq "Y" -or $response -eq "y") {
        Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
        Write-Host "   ✓ Removed parent package-lock.json" -ForegroundColor Green
    }
}

# 7. Remove old build folders
Write-Host "7. Checking for old build folders..." -ForegroundColor Green
if (Test-Path ".\build") {
    $size = (Get-ChildItem ".\build" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Found build folder: $([math]::Round($size, 2)) MB" -ForegroundColor Yellow
    $response = Read-Host "   Remove build folder? (Y/N)"
    if ($response -eq "Y" -or $response -eq "y") {
        Remove-Item ".\build" -Recurse -Force -ErrorAction SilentlyContinue
        $totalFreed += $size
        Write-Host "   ✓ build folder removed" -ForegroundColor Green
    }
}

# 8. Clean Recycle Bin
Write-Host "8. Cleaning Recycle Bin..." -ForegroundColor Green
try {
    Clear-RecycleBin -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ Recycle Bin cleared" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Could not clear Recycle Bin (may need admin rights)" -ForegroundColor Yellow
}

# Final summary
Write-Host ""
Write-Host "=== Cleanup Complete ===" -ForegroundColor Cyan
Write-Host "Estimated space freed: $([math]::Round($totalFreed, 2)) MB ($([math]::Round($totalFreed / 1024, 2)) GB)" -ForegroundColor Green

$after = Get-PSDrive C | Select-Object Used, Free
Write-Host ""
Write-Host "Disk space AFTER cleanup:" -ForegroundColor Yellow
Write-Host "  Used: $([math]::Round($after.Used / 1GB, 2)) GB" -ForegroundColor Yellow
Write-Host "  Free: $([math]::Round($after.Free / 1GB, 2)) GB" -ForegroundColor Yellow

$freed = ($before.Used - $after.Used) / 1GB
if ($freed -gt 0) {
    Write-Host ""
    Write-Host "Actual space freed: $([math]::Round($freed, 2)) GB" -ForegroundColor Green
}

Write-Host ""
Write-Host "You can now run: npm install" -ForegroundColor Cyan

