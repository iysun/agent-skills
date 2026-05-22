# link-skills.ps1 说明

将 `agent-skills` 仓库中的 skill 目录以**符号链接**安装到各 Agent 的个人 skills 路径。

## 用法

```powershell
cd D:\projects\agent-skills
.\scripts\link-skills.ps1 -Force
```

| 参数 | 说明 |
|------|------|
| `-Agents` | `cursor`、`codex`、`claude`，默认 `cursor,codex` |
| `-Skills` | 只链接指定目录名，如 `git-repo-contribute-guide` |
| `-Force` | 删除已有普通目录或错误链接后重建 |
| `-WhatIf` | 仅预览（由 `SupportsShouldProcess` 提供） |

## 目标路径

| Agent | 目录 |
|-------|------|
| Cursor | `%USERPROFILE%\.cursor\skills\` |
| Codex | `%USERPROFILE%\.codex\skills\` |
| Claude | `%USERPROFILE%\.claude\skills\` |

## 注意

- Windows 需开启**开发人员模式**，或以管理员运行，否则创建符号链接会失败。
- 会把 Cursor 里原有的 `git-repo-contribute-guide` **副本目录**替换为指向本仓库的链接（需 `-Force`）。
