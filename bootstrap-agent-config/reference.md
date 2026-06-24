# Reference — 模板与三家格式差异

所有模板均为**起点**，按目标项目实际命令/结构填充。占位符用 `<...>` 标注。

---

## 1. 跨三家落点速查

| 配置 | Claude Code | Codex | Cursor |
|------|-------------|-------|--------|
| 指令/规范单一事实源 | `AGENTS.md`（经 `CLAUDE.md` 桥接） | `AGENTS.md`（原生，root→cwd 级联） | `AGENTS.md`（原生） |
| 可复用技能 | `.claude/skills/<n>/SKILL.md`，命令名=**目录名** | `.codex/skills/<n>/SKILL.md`，`$name` 调用 | `.cursor/skills/<n>/SKILL.md` |
| 自定义命令 | `.claude/commands/*.md` → `/name` | （并入 skills/prompts） | （并入 skills） |
| 条件规则 | —（靠 AGENTS.md） | — | `.cursor/rules/*.mdc`（按 `globs` 自动挂载） |
| 权限 / env / hooks | `.claude/settings.json` | `~/.codex/config.toml` | —（编辑器设置） |

**可移植铁律**：任何要跨三家复用的 `SKILL.md`，frontmatter 只用 `name` + `description`。

---

## 2. `AGENTS.md` 模板（单一事实源）

```markdown
# <项目名> — AI Agent 指引

<一句话简介：做什么、技术栈、平台>。

## AI 工具（harness 入口）

本仓库已配好项目级工具，优先用它们而非临场拼命令：

| 入口 | 用途 |
|------|------|
| `/build` | 构建-修复循环：配置 → 编译 → 读错误修复 → 重编，直到通过 |
| `/run`   | 运行-验证循环：启动并按清单核对核心行为 |
| `<add-x>` 技能 | 组件开发流水线：生成骨架 → 注册 → 构建验证 → 文档判断 |

> 机器相关路径（如 `<SDK_DIR>`）由 `.claude/settings.local.json` 注入，不入库，各自配置。

## 维护约定（判断式）

- 改动涉及**新踩坑 / 限制 / 架构决策** → 判断是否值得沉淀 → 记入 `docs/notes/`
- 改动**改变了功能边界** → 更新 `docs/features.md`
- **是否更新文档由你按改动性质自行判断**：纯重构 / 小修 / 不影响行为的改动无需更新；文档与代码可同次提交

## 构建 / 运行 / 开发

### 构建
（填入项目真实构建命令；Windows/*nix 分支见下方踩坑表）

### 运行
（填入启动命令与验证要点）

### 添加 <组件>
（填入项目扩展某能力的标准步骤）
```

---

## 3. `CLAUDE.md` 桥接模板

```markdown
# Claude Code 指引

参见 [AGENTS.md](./AGENTS.md)。
```

---

## 4. `.claude/settings.json`（permissions，无 hooks）

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(<构建命令>:*)",
      "Bash(git submodule update:*)",
      "PowerShell(<构建命令>:*)"
    ]
  }
}
```
> 刻意不含 `hooks` 字段——默认靠命令/约定引导。确需强制时再加。

## 5. `.claude/settings.local.json`（仅当需机器相关路径，gitignored）

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "env": {
    "<SDK_DIR>": "<本机路径>"
  }
}
```
`.gitignore` 追加：
```
.claude/settings.local.json
```

---

## 6. `.claude/commands/build.md`（构建-修复循环）

```markdown
---
description: 构建 <项目>（构建-修复循环：配置 → 编译 → 读错误修复 → 重编，直到通过）
allowed-tools: Bash, PowerShell, Read, Edit, Grep, Glob
---

# /build — 构建-修复 Loop

## 前置：环境注入（如有机器相关路径）
先校验 `$env:<SDK_DIR>` 非空且 `Test-Path` 为真；为空则停下，提示去 `.claude/settings.local.json` 配置，不要硬猜。
> env 在会话启动时注入；刚改过需重启会话才生效。

## 构建步骤
（填入真实命令）

## 修复循环（核心）
1. 完整读取编译/链接错误。
2. 比对已知坑（`docs/notes/` 链接）；命中就照做。
3. 普通源码错误 → 定位修复。
4. 回到编译步重跑，直到通过。
5. 判定为环境问题时停止空转，给出人工处置指引。
```

`run.md` 同构：启动应用 → 给可核对的验证清单（GUI/服务行为无法纯程序断言时尤其重要）。

---

## 7. `.cursor/rules/*.mdc` 最小模板

`alwaysApply` 全局规则（如 `.cursor/rules/00-project.mdc`）：
```markdown
---
description: 项目核心规范与构建/运行入口
alwaysApply: true
---

本项目规范以 AGENTS.md 为准，关键点：
- 构建用 `/build` 流程；运行用 `/run` 流程。
- 文档维护判断式：纯重构/小修无需更新文档。
- <项目特有强约束 1-3 条>
```

按文件类型挂载的条件规则（`globs`）：
```markdown
---
description: 编辑 <某类文件> 时的注意事项
globs: "src/**/*.<ext>"
alwaysApply: false
---

<碰这类文件时要注意的点>
```

字段：`description`（何时相关）、`globs`（命中哪些文件自动挂载）、`alwaysApply`（是否始终注入）。

---

## 8. Codex 适配

- 主要靠 `AGENTS.md`：Codex 从 `~/.codex/AGENTS.md` → 项目根向下到 cwd 级联拼接，**默认 ≤32KiB**，保持精炼。
- 可选 `~/.codex/config.toml`：
  ```toml
  project_doc_fallback_filenames = ["CLAUDE.md"]
  project_doc_max_bytes = 65536
  ```
- 组件开发类 skill 可镜像到项目 `.codex/skills/<name>/SKILL.md`（`$name` 调用）。

---

## 9. docs references 结构模板

索引文件（`docs/notes.md`）：
```markdown
# 注意事项（索引）

每条独立成文，本文件只是索引——按需点开。

- [<标题>](notes/<slug>.md) — <一行现象/适用场景，供判断要不要读>
```
细粒度文件（`docs/notes/<slug>.md`）：现象 → 原因 → 正确做法。

---

## 10. 生成命令时要内建的坑

| 坑 | 处置 |
|----|------|
| **PowerShell 下 cmake `-D键=值`** | 不整体加引号时含小数的值会被截断（`3.5`→`3`，报 `Invalid ... value "3"`）。写成 `"-DKEY=值"` 整体加引号，或数组传参 `cmake @args`。 |
| **settings.local.json 的 env** | 会话启动时注入；中途新建/修改当前会话读不到，需重启会话。命令前置校验里要提示这一点。 |
| **Claude 命令名来源** | 取自**文件名/目录名**，不是 frontmatter（Claude 的 SKILL.md `name` 可选）。 |
| **Claude 不原生读 AGENTS.md** | 必须有 `CLAUDE.md` 桥接（一行引用）。 |
| **Cursor 跨读别家 skills** | 2.4+ 兼容读 `.claude/.codex` skills 但为单源、需自测；稳妥仍各自放一份。 |
| **可移植 frontmatter** | 跨三家的 SKILL.md 只用 `name`+`description`，产品特有字段放各自副本。 |
