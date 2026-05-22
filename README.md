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

## 安装

将本仓库中某个 skill **目录** 复制或符号链接到对应工具的技能路径。

| 环境 | 个人技能目录（Windows） |
|------|-------------------------|
| **Cursor** | `%USERPROFILE%\.cursor\skills\` |
| **Codex** | `%USERPROFILE%\.codex\skills\` |
| **Claude Code** | 见官方文档中的 skills 配置路径 |

**符号链接示例（以 `git-repo-contribute-guide` 为例）：**

```powershell
$repo = "D:\projects\agent-skills\git-repo-contribute-guide"

# Cursor
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cursor\skills" | Out-Null
cmd /c mklink /D "$env:USERPROFILE\.cursor\skills\git-repo-contribute-guide" $repo

# Codex
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.codex\skills" | Out-Null
cmd /c mklink /D "$env:USERPROFILE\.codex\skills\git-repo-contribute-guide" $repo
```

**复制安装（通用）：**

```powershell
$repo = "D:\projects\agent-skills\git-repo-contribute-guide"
Copy-Item -Recurse -Force $repo "$env:USERPROFILE\.cursor\skills\"
Copy-Item -Recurse -Force $repo "$env:USERPROFILE\.codex\skills\"
```

安装后按各工具要求重载窗口或重启 CLI；调用时使用 skill 的 `name` 字段（见各 `SKILL.md` frontmatter）。

## Skills 列表

| Skill | 说明 |
|-------|------|
| [git-repo-contribute-guide](./git-repo-contribute-guide/) | 解析 Git 仓库 URL，生成「如何贡献」指南 |

## 新增 Skill

1. 在本仓库新建 `<skill-name>/SKILL.md`（`name` + `description` frontmatter，正文写清工作流程）
2. 更新本 README 的 Skills 列表
3. `git commit` 并推送（如有远程）

各工具的 Skill 格式细节可能略有差异，以目标环境文档为准；本仓库以通用的 `SKILL.md` 目录结构为准。
