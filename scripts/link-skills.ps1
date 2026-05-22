#Requires -Version 5.1
<#
.SYNOPSIS
  Link skills from this repo into agent skill directories (symlinks).

.PARAMETER Agents
  Target agents: cursor, codex, claude. Default: cursor, codex.

.PARAMETER Skills
  Skill folder names to link. Default: all skills in repo root.

.PARAMETER Force
  Replace existing directories or wrong symlinks.

.EXAMPLE
  .\scripts\link-skills.ps1 -Force

.EXAMPLE
  .\scripts\link-skills.ps1 -Agents cursor -Skills git-repo-contribute-guide -Force
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [ValidateSet('cursor', 'codex', 'claude')]
    [string[]] $Agents = @('cursor', 'codex'),

    [string[]] $Skills,

    [switch] $Force
)

$ErrorActionPreference = 'Stop'

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

$AgentTargets = @{
    cursor = Join-Path $env:USERPROFILE '.cursor\skills'
    codex  = Join-Path $env:USERPROFILE '.codex\skills'
    claude = Join-Path $env:USERPROFILE '.claude\skills'
}

function Test-PathIsSymlink([string] $Path) {
    if (-not (Test-Path -LiteralPath $Path)) { return $false }
    $item = Get-Item -LiteralPath $Path -Force
    return ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0
}

function Get-LinkTarget([string] $Path) {
    if (-not (Test-PathIsSymlink $Path)) { return $null }
    return (Get-Item -LiteralPath $Path -Force).Target
}

function Resolve-SkillSource([string] $SkillName) {
    $source = Join-Path $RepoRoot $SkillName
    $skillFile = Join-Path $source 'SKILL.md'
    if (-not (Test-Path -LiteralPath $skillFile)) {
        throw "Invalid skill (missing SKILL.md): $source"
    }
    return (Resolve-Path -LiteralPath $source).Path
}

function Get-RepoSkills() {
    Get-ChildItem -LiteralPath $RepoRoot -Directory |
        Where-Object {
            $_.Name -notin @('scripts', '.git') -and
            (Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md'))
        } |
        ForEach-Object { $_.Name }
}

function Install-SkillLink {
    param(
        [string] $AgentName,
        [string] $SkillsDir,
        [string] $SkillName,
        [string] $SourcePath
    )

    $linkPath = Join-Path $SkillsDir $SkillName
    $sourceNorm = [IO.Path]::GetFullPath($SourcePath)
    $existingTarget = Get-LinkTarget $linkPath
    $label = "${AgentName}\${SkillName}"

    if ((Test-Path -LiteralPath $linkPath) -and -not $existingTarget) {
        if (-not $Force) {
            Write-Warning "Skip ${label}: target is a regular directory. Use -Force: $linkPath"
            return
        }
        if ($PSCmdlet.ShouldProcess($linkPath, 'Remove existing directory')) {
            Remove-Item -LiteralPath $linkPath -Recurse -Force
        }
    }
    elseif ($existingTarget) {
        $targetNorm = [IO.Path]::GetFullPath($existingTarget)
        if ($targetNorm -ieq $sourceNorm) {
            Write-Host "[ok] ${label} already linked" -ForegroundColor DarkGray
            return
        }
        if (-not $Force) {
            Write-Warning "Skip ${label}: symlink points to $existingTarget. Use -Force to relink."
            return
        }
        if ($PSCmdlet.ShouldProcess($linkPath, 'Remove existing symlink')) {
            Remove-Item -LiteralPath $linkPath -Force
        }
    }

    if ($PSCmdlet.ShouldProcess($linkPath, "SymbolicLink -> $sourceNorm")) {
        New-Item -ItemType SymbolicLink -Path $linkPath -Target $sourceNorm -Force | Out-Null
        Write-Host "[linked] $linkPath -> $sourceNorm" -ForegroundColor Green
    }
}

Write-Host "Repo: $RepoRoot" -ForegroundColor Cyan

$skillNames = if ($Skills) { @($Skills) } else { @(Get-RepoSkills) }
if ($skillNames.Count -eq 0) {
    throw 'No skills found (expected subdirs with SKILL.md).'
}

Write-Host "Skills: $($skillNames -join ', ')" -ForegroundColor Cyan
Write-Host "Agents: $($Agents -join ', ')" -ForegroundColor Cyan

foreach ($agent in $Agents) {
    if (-not $AgentTargets.ContainsKey($agent)) {
        throw "Unknown agent: $agent"
    }

    $skillsDir = $AgentTargets[$agent]
    if (-not (Test-Path -LiteralPath $skillsDir)) {
        if ($PSCmdlet.ShouldProcess($skillsDir, 'Create directory')) {
            New-Item -ItemType Directory -Path $skillsDir -Force | Out-Null
        }
    }

    foreach ($skillName in $skillNames) {
        $source = Resolve-SkillSource $skillName
        Install-SkillLink -AgentName $agent -SkillsDir $skillsDir -SkillName $skillName -SourcePath $source
    }
}

Write-Host ""
Write-Host "Done. Reload Cursor / restart Codex CLI to pick up skills." -ForegroundColor Cyan
