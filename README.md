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

在仓库根目录执行，将**全部** skill 以**目录符号链接**安装到 Cursor、Codex：

```powershell
cd D:\projects\agent-skills
.\scripts\link-skills.ps1 -Force
```

常用参数：

```powershell
# 仅链接到 Cursor，且只处理指定 skill
.\scripts\link-skills.ps1 -Agents cursor -Skills git-repo-contribute-guide -Force

# 预览，不实际写入
.\scripts\link-skills.ps1 -WhatIf

# 包含 Claude Code（若已配置 ~/.claude/skills）
.\scripts\link-skills.ps1 -Agents cursor,codex,claude -Force
```

| 环境 | 个人技能目录（Windows） |
|------|-------------------------|
| **Cursor** | `%USERPROFILE%\.cursor\skills\` |
| **Codex** | `%USERPROFILE%\.codex\skills\` |
| **Claude Code** | `%USERPROFILE%\.claude\skills\` |

脚本会扫描仓库内带 `SKILL.md` 的子目录并创建链接；目标若为普通副本目录，需加 `-Force` 才会删除后改为链接。

> Windows 创建符号链接需开启**开发人员模式**，或以管理员运行 PowerShell。详见 [scripts/link-skills.zh-CN.md](./scripts/link-skills.zh-CN.md)。

安装后重载 Cursor / 重启 Codex CLI；调用时使用各 `SKILL.md` 中的 `name` 字段。

## Skills 列表

| Skill | 说明 |
|-------|------|
| [git-repo-contribute-guide](./git-repo-contribute-guide/) | 解析 Git 仓库 URL，生成「如何贡献」指南 |

## 新增 Skill

1. 在本仓库新建 `<skill-name>/SKILL.md`（`name` + `description` frontmatter，正文写清工作流程）
2. 更新本 README 的 Skills 列表
3. `git commit` 并推送（如有远程）

各工具的 Skill 格式细节可能略有差异，以目标环境文档为准；本仓库以通用的 `SKILL.md` 目录结构为准。
