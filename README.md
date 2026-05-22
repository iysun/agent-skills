# Cursor Skills

个人维护的 [Cursor Agent Skills](https://cursor.com/docs/agent/skills) 集合，每个子目录为一个独立 skill。

## 目录结构

```
cursor-skills/
├── README.md
└── <skill-name>/
    ├── SKILL.md          # 必需：技能主文件
    ├── reference.md      # 可选：参考文档
    └── examples.md       # 可选：示例
```

## 安装到 Cursor

将某个 skill 链接或复制到 Cursor 个人技能目录：

**Windows（PowerShell，以管理员或开发者模式创建符号链接）：**

```powershell
# 安装单个 skill（示例）
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cursor\skills" | Out-Null
cmd /c mklink /D "$env:USERPROFILE\.cursor\skills\git-repo-contribute-guide" "D:\projects\cursor-skills\git-repo-contribute-guide"
```

或直接复制：

```powershell
Copy-Item -Recurse -Force "D:\projects\cursor-skills\git-repo-contribute-guide" "$env:USERPROFILE\.cursor\skills\"
```

安装后重载 Cursor 窗口，或在对话中通过 skill 名称调用。

## Skills 列表

| Skill | 说明 |
|-------|------|
| [git-repo-contribute-guide](./git-repo-contribute-guide/) | 解析 Git 仓库 URL，生成「如何贡献」指南 |

## 新增 Skill

1. 在本仓库根目录下新建 `<skill-name>/SKILL.md`（参考 [create-skill](https://cursor.com/docs/agent/skills) 规范）
2. 更新本 README 的 Skills 列表
3. 提交并推送到远程（如有）
