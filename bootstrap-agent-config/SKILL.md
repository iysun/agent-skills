---
name: bootstrap-agent-config
description: >-
  为一个代码项目生成跨 Claude Code / Codex / Cursor 通用的 AI 配置：以 AGENTS.md 为
  单一事实源写清项目规范与构建/运行/开发流程，配套各 agent 的适配层（.claude 命令与权限、
  .cursor 规则、Codex AGENTS 桥接），并把易踩坑固化成构建-修复 / 运行-验证等迭代循环。
  适用于：在新项目里初始化 AI 配置、统一多 agent 的项目指令、复现 harness/loop 工程化实践时。
---

# Bootstrap Agent Config

为当前代码项目搭建一套**跨 Claude Code / Codex / Cursor 通用**的 AI 配置。核心思想：

- **Harness engineering**——把项目的工具、上下文、权限配好，让 agent 干活顺、少踩坑、少弹窗。
- **Loop engineering**——把"反复迭代直到通过"的流程（构建-修复、运行-验证、组件开发）固化成可复用入口。

产物以 `AGENTS.md` 为**单一事实源**，再为各 agent 生成最薄的适配层，避免重复内容。

## 触发与边界

**应触发：**
- "给这个项目配 AI / 初始化 AGENTS.md / 配 Cursor 规则"
- "让 Claude Code、Codex、Cursor 都能用同一套项目指令"
- "把构建/运行流程固化成命令"、"复现 harness/loop 那套配置"

**不触发：**
- 只问单条 git / shell 命令语法，与项目级配置无关
- 只改一个业务文件、做一次性代码任务
- 用户已有完整且满意的多 agent 配置，只想微调某一处——那就直接改，别整套重铺

## 核心原则（贯穿全程）

1. **AGENTS.md 是单一事实源**：规范与流程只写一处，其余文件**引用**它而非复制，防止多份漂移。
2. **默认不用 hooks**：行为靠提示 / 命令 / 约定引导 + agent 自判断。除非用户明确要强制拦截。
3. **判断式而非强制式约定**：如"文档是否更新"由改动性质判断（纯重构/小修不强制），不写死"每次必须"。
4. **可移植优先**：生成的任何 `SKILL.md` 只用 `name` + `description` 两个 frontmatter 字段；产品特有字段放各自副本。
5. **loop 内嵌进命令**：构建/运行命令里直接写清"失败怎么读错误、怎么修、何时停"，而非只贴一条命令。
6. **探测优先，不硬猜**：构建/运行命令必须来自项目实际文件或用户确认，识别不出就问，绝不编造路径。

所有可直接套用的模板见 [reference.md](reference.md)；一份完整实战样例见 [examples.md](examples.md)。

## 工作流程

### 阶段 1 — 探测目标项目

读项目以摸清事实（**并行**进行）：

- 语言 / 框架、构建系统（CMake / npm / cargo / go / maven / make …）与**精确构建命令**。
- 运行 / 启动方式、测试命令、lint 命令。
- 是否依赖**机器相关路径**（如某 SDK / 编译器 / Qt 安装目录）——决定后面要不要环境注入。
- 已有的 `AGENTS.md` / `CLAUDE.md` / `README` / `docs/`、`.cursor/`、`.claude/`、`.codex/`——有则增量改，不覆盖。
- 易踩坑：读 README / 现有 notes / CI 配置，收集"已知问题"。

把结论列给用户确认，再进入下一步。

### 阶段 2 — 交互确认范围

用 AskUserQuestion（或等价提问）确认，给出推荐默认值：

| 问题 | 选项 / 默认 |
|------|------------|
| 用 hooks 吗？ | **默认否**（推荐）；要强制才加 |
| 要哪些 loop？ | 构建-修复 / 运行-验证 / 组件开发（按项目可多选） |
| docs 改成 references 结构？ | 有较多文档时推荐；轻量项目可跳过 |
| 构建依赖机器相关路径？ | 是 → 生成 `settings.local.json` 环境注入并 gitignore |
| 适配哪些 agent？ | 默认三家全做 |

### 阶段 3 — 生成共享层（单一事实源）

- **`AGENTS.md`**：项目一句话简介 + 「AI 工具」节（列出将生成的命令/技能入口）+ **判断式**维护约定 + 构建 / 运行 / 开发流程（用阶段 1 的真实命令）。模板见 reference.md。
- **`CLAUDE.md`**：写一行引用 `AGENTS.md` 作桥接（Claude Code 目前不原生读 AGENTS.md）。若已有 CLAUDE.md，确保其指向 AGENTS.md。

### 阶段 4 — 生成 Claude Code 适配

- **`.claude/settings.json`**（入库）：`permissions.allow` 把高频构建/运行命令加白名单消除弹窗；**不放 hooks**。
- **`.claude/settings.local.json`**（仅当需机器相关路径）：`env` 注入路径；**加入 .gitignore**。提醒用户：env 在会话启动时加载，刚改需重启会话。
- **`.claude/commands/build.md`、`run.md`** 等：内嵌循环（见原则 5）。命令名 = 文件名。

### 阶段 5 — 生成 Cursor 适配

- **`.cursor/rules/*.mdc`**：至少一条 `alwaysApply: true` 的规则，正文指向 / 浓缩 AGENTS.md 的关键规范；按需再加一条带 `globs` 的条件规则（如"碰某类文件时注意 X"）。三字段格式见 reference.md。

### 阶段 6 — 生成 Codex 适配

- 主要靠 **`AGENTS.md`**（Codex 原生读，root→cwd 级联）。
- 可选：把组件开发类 skill 镜像到项目 `.codex/skills/`；提示 `~/.codex/config.toml` 可配 `project_doc_fallback_filenames` / `project_doc_max_bytes`。

### 阶段 7 — docs references 改造（若选）

把单体文档拆成「索引 + 按需读取的细粒度文件」（渐进式上下文）：

- `docs/notes.md` / `docs/features.md` 退化为**索引**：每条一行 `- [标题](notes/slug.md) — 一行描述`（描述是 agent 判断"要不要读"的路由信号）。
- 正文按条拆到 `docs/notes/*.md`、`docs/features/*.md`（英文 kebab-case 文件名，内容可中文）。
- 维护纪律：新增 = 加一篇 + 补一行索引。

### 阶段 8 — 收尾

- 更新 `.gitignore`（至少 `.claude/settings.local.json`）。
- 给出**验证清单**：先跑构建-修复循环确认能编译；再按需跑运行-验证。
- 列出已创建/修改的文件清单。

## 平台降级

| 情况 | 做法 |
|------|------|
| 识别不出构建/运行命令 | 让用户补充，不硬猜 |
| Windows | 命令用 PowerShell；注意 cmake `-D键=值` 整体加引号（见 reference.md 踩坑表） |
| *nix | 命令用 bash 分支；两套都生成时在命令里按平台分支 |
| 项目无 git | 跳过 .gitignore 步骤并提示 |
| 某 agent 用户不用 | 跳过对应适配层 |

## 附加资源

- 全部模板 + 三家格式差异 + 要内建的坑：[reference.md](reference.md)
- 实战样例（launcher，Qt6 + C++/MinGW）：[examples.md](examples.md)
