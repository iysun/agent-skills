# Agent Skills

个人维护的 **AI Agent Skills** 集合。每个子目录是一个独立 skill（`SKILL.md` + 可选参考文档），可在多种支持 Skill 规范的环境中使用，例如 **Cursor**、**Codex**、**Claude Code** 等。

## 目录结构

```
agent-skills/
├── README.md
└── <skill-name>/
    ├── SKILL.md          # 必需：技能主文件（含 YAML frontmatter）
    ├── reference.md      # 可选：参考文档
    └── examples.md       # 可选：示例
```

## 安装（推荐：链接脚本）

使用 **Node.js 18+** 跨平台脚本，将 skill 以**目录符号链接**安装到各 Agent（macOS / Linux / Windows）：

```bash
cd /path/to/agent-skills
node scripts/link-skills.mjs --force

# 或使用 npm script
npm run link:force
```

常用参数：

```bash
node scripts/link-skills.mjs --agents cursor --skills git-repo-contribute-guide --force
node scripts/link-skills.mjs --dry-run
node scripts/link-skills.mjs --agents cursor,codex,claude --force
```

| 环境 | 个人技能目录 |
|------|----------------|
| **Cursor** | `~/.cursor/skills/` |
| **Codex** | `~/.codex/skills/` |
| **Claude Code** | `~/.claude/skills/` |

脚本会扫描仓库内带 `SKILL.md` 的子目录；目标若为普通副本目录，需加 `--force` 才会删除后改为链接。详见 [scripts/link-skills.zh-CN.md](./scripts/link-skills.zh-CN.md)。

安装后重载 Cursor / 重启 Codex CLI；调用时使用各 `SKILL.md` 中的 `name` 字段。

## Skills 列表

| Skill | 说明 |
|-------|------|
| [git-repo-contribute-guide](./git-repo-contribute-guide/) | 解析 Git 仓库 URL，生成「如何贡献」指南 |
| [md-to-slides](./md-to-slides/) | 把 Markdown 大纲/文档转成单文件演示 HTML（多布局 + 主题切换 + 放映/PDF） |
| [bootstrap-agent-config](./bootstrap-agent-config/) | 为项目生成跨 Claude Code/Codex/Cursor 的 AI 配置（AGENTS.md + 各家适配 + 构建/运行循环） |

## 新增 Skill

1. 在本仓库新建 `<skill-name>/SKILL.md`（`name` + `description` frontmatter，正文写清工作流程）
2. 更新本 README 的 Skills 列表
3. `git commit` 并推送（如有远程）

各工具的 Skill 格式细节可能略有差异，以目标环境文档为准；本仓库以通用的 `SKILL.md` 目录结构为准。
