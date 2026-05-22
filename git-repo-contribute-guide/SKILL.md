---
name: git-repo-contribute-guide
description: >-
  解析 GitHub/GitLab/Gitee/Bitbucket/Codeberg 等仓库地址，拉取 README、CONTRIBUTING、
  package 配置与 open issues，并输出结构化「如何贡献」指南。适用于用户粘贴仓库 URL、
  询问如何参与开源、想贡献某项目、或提到 fork/PR/good first issue 时。
---

# Git 仓库贡献指南

根据用户提供的 **Git 托管仓库 URL**，自动收集仓库信息，输出一份可执行的**贡献指南**（默认使用**简体中文**；用户要求英文时再切换）。

## 触发与边界

**应触发：**
- 用户粘贴 `https://github.com/...`、`gitlab.com`、`gitee.com` 等仓库链接
- 「如何贡献」「怎么参与」「good first issue」「想给这个项目提 PR」

**不触发：**
- 仅问 Git 命令语法、与具体仓库无关
- 用户要的是代码审查/实现功能，而非贡献流程调研
- 私有仓库且无 `gh` 认证导致无法访问——说明限制并给出用户需自行补充的项

## 工作流程

按顺序执行；**步骤 1–3 尽量并行**以节省时间。

### 1. 解析仓库 URL

从用户输入提取 `host`、`platform`、`owner`、`repo`。去掉 `.git`、末尾 `/`、tree/blob 路径（保留 owner/repo）。

| 平台 | 识别 host | owner/repo 示例 |
|------|-----------|-----------------|
| GitHub | `github.com` | `streamich/react-use` |
| GitLab | `gitlab.com` 或自建 | `group/project` |
| Gitee | `gitee.com` | `owner/repo` |
| Bitbucket | `bitbucket.org` | `workspace/repo` |
| Codeberg | `codeberg.org` | `owner/repo` |

无法解析时，请用户确认完整 clone URL。

详细 URL 规则与 raw/API 模板见 [reference.md](reference.md)。

### 2. 收集仓库信息（必做）

**GitHub（优先 `gh`，否则 WebFetch）：**

```bash
gh repo view OWNER/REPO --json name,description,url,defaultBranchRef,isFork,parent,hasIssuesEnabled,licenseInfo,primaryLanguage,stargazerCount,forkCount,openIssuesCount,pushedAt
gh issue list -R OWNER/REPO --label "good first issue" --limit 10 --state open
gh issue list -R OWNER/REPO --label "help wanted" --limit 10 --state open
gh pr list -R OWNER/REPO --limit 5 --state open
```

**通用文件（WebFetch raw，分支先试 `master`，404 再试 `main`）：**

- `CONTRIBUTING.md`（或 `CONTRIBUTING`、`docs/CONTRIBUTING.md`、`.github/CONTRIBUTING.md`）
- `README.md`（前 200 行即可，过长则截断摘要）
- 根目录依赖清单：`package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` / `pom.xml` / `Makefile`
- `docs/` 下是否有开发文档（扫一眼目录即可）

**GitHub raw 模板：**

`https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}`

**GitLab raw 模板：**

`https://{host}/{owner}/{repo}/-/raw/{branch}/{path}`

**Gitee raw 模板：**

`https://gitee.com/{owner}/{repo}/raw/{branch}/{path}`

`gh` 不可用或 API 失败时：用 WebFetch 抓仓库首页与上述 raw 文件，不要凭空编造 stars/issue 数量。

### 3. 推断技术栈与开发命令

从依赖文件提取（不要猜测未出现的工具）：

| 线索文件 | 常见命令 |
|----------|----------|
| `package.json` + `yarn.lock` | `yarn install`，scripts 里的 `test`/`lint`/`start` |
| `package.json` + `package-lock` | `npm ci` / `npm install` |
| `pnpm-lock.yaml` | `pnpm install` |
| `pyproject.toml` / `requirements.txt` | `pip install -e .` 或 README 中的 venv 说明 |
| `Cargo.toml` | `cargo test` / `cargo build` |
| `go.mod` | `go test ./...` |

记录：包管理器、测试/ lint / build 脚本、Node/Python 版本约束（`.nvmrc`、`engines`、`volta` 等）。

### 4. 归纳贡献路径

结合 `CONTRIBUTING.md` 与 README，整理为以下结构（官方文档优先；没有则标注「仓库未提供，以下为通用建议」）：

1. **项目概览**：用途、协议、star/语言（有数据才写）
2. **环境准备**：fork → clone → 安装依赖 → 配置 upstream
3. **日常开发**：启动 dev、跑测试、覆盖率、Storybook/docs 等（仅写仓库实际存在的）
4. **贡献类型**：修 bug / 新功能 / 文档 / 测试 / 回复 issue
5. **提交与 PR 规范**：Conventional Commits、DCO、签名提交、分支命名、是否 semantic-release
6. **推荐入手 Issue**：列出 3–8 条 `good first issue` / `help wanted`（附 issue 号与标题）；无标签则列 3 条近期 open bug/enhancement
7. **注意事项**：维护活跃度、重复 PR、大重构需先讨论、私有/企业 fork 流程等
8. **建议的第一次贡献路径**：用 3–5 步 checklist（认领 issue → 分支 → 实现+测试 → PR）

### 5. 输出格式

使用以下模板回复用户（链接用完整 URL）：

```markdown
# {repo} — 贡献指南

## 仓库概览
- **地址**：
- **描述**：
- **默认分支**：
- **协议**：
- **技术栈**：

## 快速开始
1. Fork 并 clone …
2. 安装依赖：`…`
3. 配置 upstream：`…`

## 开发命令
| 用途 | 命令 |
|------|------|
| 安装 | |
| 测试 | |
| Lint | |
| 本地运行 | |

## 如何贡献
### 官方要求（来自 CONTRIBUTING）
…

### 可参与的 Issue（建议优先）
| # | 标题 | 标签 |
|---|------|------|

### 提交与 PR
…

## 推荐第一次贡献
- [ ] …

## 参考链接
- CONTRIBUTING：
- Issues：
- 已有 PR（了解是否撞车）：
```

### 6. 质量要求

- **先调查再结论**：数字、命令、分支名必须来自仓库文件或 `gh`/API。
- **并行工具调用**：`gh`、`WebFetch`、读本地 clone（若用户已在该仓库工作区）可同时进行。
- **冲突处理**：同一 issue 已有 open PR 时提醒用户避免重复劳动。
- **简洁**：README _hook 列表过长时只总结分类与贡献相关章节，不逐条罗列所有 API。
- 用户未指定语言时，**全文使用简体中文**。

## 平台降级策略

| 情况 | 做法 |
|------|------|
| 仅 GitHub 且已装 `gh` | 完整 issue/PR 列表 |
| GitLab/Gitee 等 | WebFetch 页面 + raw 文件；open issues 用网页/API 能拿多少算多少 |
| 私有仓库 | 提示登录 `gh auth login` 或提供本地路径 |
| 无 CONTRIBUTING | 从 README「Contributing」章节提取，并补充通用开源流程 |

## 附加资源

- URL/API 与多平台 raw 路径：[reference.md](reference.md)
- 输出示例（react-use）：[examples.md](examples.md)
