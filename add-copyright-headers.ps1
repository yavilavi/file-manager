# PowerShell script to add copyright headers to TypeScript and JavaScript files
# File Manager - Copyright Header Addition Script
# 
# Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
# Project: File Manager
# License: Contribution-Only License (COL)
# 
# Created: 2024

param(
    [string]$ProjectPath = "C:\wsProjects\file-manager",
    [switch]$DryRun = $false
)

# Copyright header template
$copyrightHeader = @"
/**
 * File Manager - {0}
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

"@

# Function to determine file description based on filename and path
function Get-FileDescription {
    param([string]$FilePath)
    
    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)
    $directory = [System.IO.Path]::GetDirectoryName($FilePath)
    
    # Determine description based on file patterns
    switch -Regex ($FilePath) {
        "\.controller\.ts$" { return "$fileName Controller" }
        "\.service\.ts$" { return "$fileName Service" }
        "\.module\.ts$" { return "$fileName Module" }
        "\.guard\.ts$" { return "$fileName Guard" }
        "\.middleware\.ts$" { return "$fileName Middleware" }
        "\.decorator\.ts$" { return "$fileName Decorator" }
        "\.strategy\.ts$" { return "$fileName Strategy" }
        "\.dto\.ts$" { return "$fileName DTO" }
        "\.interface\.ts$" { return "$fileName Interface" }
        "\.mapper\.ts$" { return "$fileName Mapper" }
        "\.entity\.ts$" { return "$fileName Entity" }
        "\.repository\.ts$" { return "$fileName Repository" }
        "\.errors\.ts$" { return "$fileName Domain Errors" }
        "\.exception\.ts$" { return "$fileName Exception" }
        "\.config\.ts$" { return "$fileName Configuration" }
        "\.util\.ts$" { return "$fileName Utilities" }
        "\.helper\.ts$" { return "$fileName Helper" }
        "\.constant\.ts$" { return "$fileName Constants" }
        "\.type\.ts$" { return "$fileName Types" }
        "\.spec\.ts$" { return "$fileName Tests" }
        "\.test\.ts$" { return "$fileName Tests" }
        "main\.ts$" { return "Application Bootstrap" }
        "app\.module\.ts$" { return "Main Application Module" }
        "App\.tsx$" { return "Main React Application Component" }
        "main\.tsx$" { return "Client Application Entry Point" }
        "index\.ts$" { 
            if ($directory -match "interfaces") { return "Shared Interfaces Index" }
            elseif ($directory -match "exceptions") { return "Domain Exceptions Index" }
            elseif ($directory -match "mappers") { return "Mappers Index" }
            else { return "Module Index" }
        }
        default { 
            $cleanFileName = $fileName -replace "[-_]", " "
            return [System.Globalization.CultureInfo]::CurrentCulture.TextInfo.ToTitleCase($cleanFileName.ToLower())
        }
    }
}

# Function to check if file already has copyright header
function Has-CopyrightHeader {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath -Raw -ErrorAction SilentlyContinue
    return $content -match "Original Author: Yilmer Avila"
}

# Function to add copyright header to file
function Add-CopyrightHeader {
    param([string]$FilePath)
    
    try {
        $description = Get-FileDescription $FilePath
        $header = $copyrightHeader -f $description
        
        $content = Get-Content $FilePath -Raw -ErrorAction SilentlyContinue
        if (-not $content) {
            Write-Warning "Could not read file: $FilePath"
            return $false
        }
        
        $newContent = $header + $content
        
        if (-not $DryRun) {
            Set-Content -Path $FilePath -Value $newContent -NoNewline -Encoding UTF8
        }
        
        Write-Host "Added header to: $FilePath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Error "Failed to process file: $FilePath - $($_.Exception.Message)"
        return $false
    }
}

# Main execution
Write-Host "File Manager - Copyright Header Addition Script" -ForegroundColor Cyan
Write-Host "Project Path: $ProjectPath" -ForegroundColor Yellow
Write-Host "Dry Run: $DryRun" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path $ProjectPath)) {
    Write-Error "Project path does not exist: $ProjectPath"
    exit 1
}

# Find all TypeScript and JavaScript files
$filePatterns = @("*.ts", "*.tsx", "*.js", "*.jsx")
$excludePatterns = @("node_modules", ".git", "dist", "build", ".next", "coverage")

$allFiles = @()
foreach ($pattern in $filePatterns) {
    $files = Get-ChildItem -Path $ProjectPath -Filter $pattern -Recurse | Where-Object {
        $exclude = $false
        foreach ($excludePattern in $excludePatterns) {
            if ($_.FullName -match [regex]::Escape($excludePattern)) {
                $exclude = $true
                break
            }
        }
        -not $exclude
    }
    $allFiles += $files
}

Write-Host "Found $($allFiles.Count) files to process" -ForegroundColor Yellow
Write-Host ""

$processed = 0
$skipped = 0
$errors = 0

foreach ($file in $allFiles) {
    if (Has-CopyrightHeader $file.FullName) {
        Write-Host "Skipping (already has header): $($file.FullName)" -ForegroundColor Gray
        $skipped++
    }
    else {
        if (Add-CopyrightHeader $file.FullName) {
            $processed++
        }
        else {
            $errors++
        }
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Processed: $processed files" -ForegroundColor Green
Write-Host "  Skipped: $skipped files" -ForegroundColor Yellow
Write-Host "  Errors: $errors files" -ForegroundColor Red

if ($DryRun) {
    Write-Host ""
    Write-Host "This was a dry run. No files were modified." -ForegroundColor Magenta
    Write-Host "Run without -DryRun to apply changes." -ForegroundColor Magenta
} 