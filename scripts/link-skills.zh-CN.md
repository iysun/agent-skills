# link-skills 安装脚本

将 `agent-skills` 仓库中的 skill 目录以**符号链接**安装到各 Agent 的个人 skills 路径。使用 **Node.js**，支持 **macOS / Linux / Windows**。

## 要求

- Node.js **18+**（使用内置 `parseArgs`）

## 用法

```bash
cd /path/to/agent-skills

# 链接到 Cursor + Codex（全部 skill）
node scripts/link-skills.mjs --force

# 仅 Cursor、仅指定 skill
node scripts/link-skills.mjs --agents cursor --skills git-repo-contribute-guide --force

# 预览，不写入
node scripts/link-skills.mjs --dry-run

# 含 Claude Code
node scripts/link-skills.mjs --agents cursor,codex,claude --force
```

| 参数 | 说明 |
|------|------|
| `-a, --agents` | `cursor`、`codex`、`claude`，逗号分隔，默认 `cursor,codex` |
| `-s, --skills` | 只链接指定目录名，逗号分隔 |
| `-f, --force` | 删除已有普通目录或错误链接后重建 |
| `--dry-run` | 仅打印将执行的操作 |
| `-h, --help` | 帮助 |

## 目标路径

| Agent | macOS / Linux | Windows |
|-------|---------------|---------|
| Cursor | `~/.cursor/skills/` | `%USERPROFILE%\.cursor\skills\` |
| Codex | `~/.codex/skills/` | `%USERPROFILE%\.codex\skills\` |
| Claude | `~/.claude/skills/` | `%USERPROFILE%\.claude\skills\` |

## 平台说明

| 系统 | 说明 |
|------|------|
| **macOS / Linux** | 一般可直接创建目录符号链接 |
| **Windows** | 目录符号链接可能需要**开发人员模式**或管理员权限；脚本在失败时会尝试 `junction` |

## 行为说明

- 自动扫描仓库根目录下含 `SKILL.md` 的子目录（排除 `scripts`、`.git`）。
- 若目标已是正确链接，跳过；若是普通副本目录，需 `--force` 才会删除并改为链接。
