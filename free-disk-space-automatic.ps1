# Automatic disk space cleanup (no prompts)
# Run with: powershell -ExecutionPolicy Bypass -File free-disk-space-automatic.ps1

Write-Host "=== Automatic Disk Space Cleanup ===" -ForegroundColor Cyan
Write-Host ""

$totalFreed = 0

# Clean npm cache
Write-Host "Cleaning npm cache..." -ForegroundColor Green
npm cache clean --force 2>&1 | Out-Null

# Remove Next.js build files
$foldersToRemove = @(".next", "out")
foreach ($folder in $foldersToRemove) {
    if (Test-Path ".\$folder") {
        $size = (Get-ChildItem ".\$folder" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
        Remove-Item ".\$folder" -Recurse -Force -ErrorAction SilentlyContinue
        $totalFreed += $size
        Write-Host "Removed $folder ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
    }
}

# Remove node_modules (will be reinstalled)
if (Test-Path ".\node_modules") {
    $size = (Get-ChildItem ".\node_modules" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Remove-Item ".\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    $totalFreed += $size
    Write-Host "Removed node_modules ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
}

# Remove build folder
if (Test-Path ".\build") {
    $size = (Get-ChildItem ".\build" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Remove-Item ".\build" -Recurse -Force -ErrorAction SilentlyContinue
    $totalFreed += $size
    Write-Host "Removed build folder ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Freed approximately: $([math]::Round($totalFreed, 2)) MB ($([math]::Round($totalFreed / 1024, 2)) GB)" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm install" -ForegroundColor Cyan

