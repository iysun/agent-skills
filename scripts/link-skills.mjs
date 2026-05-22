#!/usr/bin/env node
/**
 * Link skill directories from this repo into agent skill folders (symlinks).
 * Cross-platform: macOS, Linux, Windows (Node.js 18+).
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const AGENT_TARGETS = {
  cursor: path.join(os.homedir(), '.cursor', 'skills'),
  codex: path.join(os.homedir(), '.codex', 'skills'),
  claude: path.join(os.homedir(), '.claude', 'skills'),
};

const SKIP_DIRS = new Set(['scripts', '.git', 'node_modules']);

const { values, positionals } = parseArgs({
  options: {
    agents: { type: 'string', short: 'a', default: 'cursor,codex' },
    skills: { type: 'string', short: 's' },
    force: { type: 'boolean', short: 'f', default: false },
    'dry-run': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`Usage: node scripts/link-skills.mjs [options]

Options:
  -a, --agents <list>   cursor,codex,claude (default: cursor,codex)
  -s, --skills <list>   comma-separated skill folder names (default: all)
  -f, --force           replace existing dirs or wrong symlinks
      --dry-run         print actions only
  -h, --help            show this help

Examples:
  node scripts/link-skills.mjs --force
  node scripts/link-skills.mjs -a cursor -s git-repo-contribute-guide -f
`);
  process.exit(0);
}

const agents = values.agents.split(',').map((s) => s.trim()).filter(Boolean);
const skillFilter = values.skills
  ? values.skills.split(',').map((s) => s.trim()).filter(Boolean)
  : null;
const force = values.force;
const dryRun = values['dry-run'];

function listRepoSkills() {
  return fs.readdirSync(REPO_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP_DIRS.has(d.name))
    .filter((d) => fs.existsSync(path.join(REPO_ROOT, d.name, 'SKILL.md')))
    .map((d) => d.name);
}

function resolveExistingTarget(linkPath) {
  try {
    const target = fs.readlinkSync(linkPath);
    return path.isAbsolute(target)
      ? path.normalize(target)
      : path.normalize(path.resolve(path.dirname(linkPath), target));
  } catch {
    return null;
  }
}

function isSymlink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

function removePath(p) {
  if (dryRun) {
    console.log(`[dry-run] remove ${p}`);
    return;
  }
  fs.rmSync(p, { recursive: true, force: true });
}

function createDirSymlink(target, linkPath) {
  const absTarget = path.resolve(target);
  if (dryRun) {
    console.log(`[dry-run] symlink ${linkPath} -> ${absTarget}`);
    return;
  }
  fs.mkdirSync(path.dirname(linkPath), { recursive: true });
  if (process.platform === 'win32') {
    try {
      fs.symlinkSync(absTarget, linkPath, 'dir');
    } catch {
      fs.symlinkSync(absTarget, linkPath, 'junction');
    }
  } else {
    fs.symlinkSync(absTarget, linkPath, 'dir');
  }
}

function installSkillLink(agentName, skillsDir, skillName, sourcePath) {
  const linkPath = path.join(skillsDir, skillName);
  const sourceNorm = path.resolve(sourcePath);
  const label = `${agentName}/${skillName}`;

  if (fs.existsSync(linkPath)) {
    if (isSymlink(linkPath)) {
      const existing = resolveExistingTarget(linkPath);
      if (existing && path.normalize(existing) === sourceNorm) {
        console.log(`[ok] ${label} already linked`);
        return;
      }
      if (!force) {
        console.warn(`[skip] ${label}: symlink -> ${existing ?? '?'}. Use --force`);
        return;
      }
      removePath(linkPath);
    } else {
      if (!force) {
        console.warn(`[skip] ${label}: not a symlink (${linkPath}). Use --force`);
        return;
      }
      removePath(linkPath);
    }
  }

  createDirSymlink(sourceNorm, linkPath);
  if (!dryRun) {
    console.log(`[linked] ${linkPath} -> ${sourceNorm}`);
  }
}

function main() {
  console.log(`Repo: ${REPO_ROOT}`);

  for (const agent of agents) {
    if (!AGENT_TARGETS[agent]) {
      console.error(`Unknown agent: ${agent}. Valid: ${Object.keys(AGENT_TARGETS).join(', ')}`);
      process.exit(1);
    }
  }

  const skillNames = skillFilter ?? listRepoSkills();
  if (skillNames.length === 0) {
    console.error('No skills found (expected subdirs with SKILL.md).');
    process.exit(1);
  }

  console.log(`Skills: ${skillNames.join(', ')}`);
  console.log(`Agents: ${agents.join(', ')}`);

  for (const agent of agents) {
    const skillsDir = AGENT_TARGETS[agent];
    if (!fs.existsSync(skillsDir) && !dryRun) {
      fs.mkdirSync(skillsDir, { recursive: true });
    } else if (!fs.existsSync(skillsDir) && dryRun) {
      console.log(`[dry-run] mkdir ${skillsDir}`);
    }

    for (const skillName of skillNames) {
      const source = path.join(REPO_ROOT, skillName);
      if (!fs.existsSync(path.join(source, 'SKILL.md'))) {
        console.error(`Invalid skill (missing SKILL.md): ${source}`);
        process.exit(1);
      }
      installSkillLink(agent, skillsDir, skillName, source);
    }
  }

  console.log('\nDone. Reload Cursor / restart Codex CLI to pick up skills.');
}

main();
