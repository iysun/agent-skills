# 仓库 URL 解析与数据源参考

## URL 规范化

输入示例 → 解析结果：

| 输入 | owner | repo | branch/path |
|------|-------|------|-------------|
| `https://github.com/streamich/react-use` | streamich | react-use | — |
| `https://github.com/o/r/tree/main/pkg` | o | r | 忽略 tree |
| `git@github.com:o/r.git` | o | r | — |
| `https://gitlab.com/group/subgroup/proj` | group/subgroup | proj 或全路径 | 见 GitLab API |

规则：
- 去掉 `.git` 后缀
- 去掉 `/pull/`、`/issues/`、`/tree/`、`/blob/` 之后的路径（用于定位文件时另说）
- SSH：`git@host:owner/repo.git` → `owner/repo`

## GitHub

**API / CLI：**

```bash
gh repo view OWNER/REPO
gh api repos/OWNER/REPO
gh issue list -R OWNER/REPO --state open --limit 20
```

**Raw 文件：**

```
https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{file}
```

**常见贡献相关路径（按序尝试）：**

1. `CONTRIBUTING.md`
2. `.github/CONTRIBUTING.md`
3. `docs/CONTRIBUTING.md`
4. `README.md`
5. `.github/PULL_REQUEST_TEMPLATE.md`
6. `package.json` / `pyproject.toml` / `Cargo.toml`

**Issue 标签搜索：**

```bash
gh issue list -R OWNER/REPO --label "good first issue" --state open
gh issue list -R OWNER/REPO --label "help wanted" --state open
```

## GitLab

**Raw：**

```
https://{host}/{namespace}/{project}/-/raw/{branch}/{path}
```

**API（可选）：**

```
https://gitlab.com/api/v4/projects/{url-encoded-path}
```

`url-encoded-path`：`group%2Fproject`

## Gitee

**Raw：**

```
https://gitee.com/{owner}/{repo}/raw/{branch}/{path}
```

Issue 列表通常需 WebFetch 仓库 issues 页或 API（需 token 时说明）。

## Bitbucket

**Raw（Cloud）：**

```
https://bitbucket.org/{workspace}/{repo}/raw/{branch}/{path}
```

## Codeberg

**Raw：**

```
https://codeberg.org/{owner}/{repo}/raw/branch/{branch}/{path}
```

## 默认分支检测

1. `gh repo view --json defaultBranchRef`（GitHub）
2. 依次 WebFetch：`master`、`main` 上的 `README.md`
3. 仍失败则在输出中写「默认分支未确认，请将 main/master 替换为实际分支」

## 从 package.json 提取的字段

- `scripts`: test, lint, build, start, prepare
- `engines` / `volta`
- `packageManager`（npm/pnpm/yarn 字段）
- `husky` / `lint-staged`（提交钩子）
- `license`
- `repository.url`

## 从 CONTRIBUTING 提取的字段

- Fork / upstream 配置命令
- 分支命名约定
- 新功能/新 hook/新模块的文件清单
- Commit message 规范（Conventional Commits、DCO）
- 是否要求 Issue 先行讨论
- Code of conduct 链接

## 维护活跃度（可选一笔带过）

- `pushedAt` 超过 1 年：提醒可能维护缓慢
- open PR 很多、近期无合并：建议先小 PR 或评论认领 issue
