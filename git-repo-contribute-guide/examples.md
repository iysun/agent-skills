# 输出示例：react-use

用户输入：`https://github.com/streamich/react-use`

以下为技能应产出的**结构示例**（数据会随仓库变化；执行时以实时拉取为准）。

---

# react-use — 贡献指南

## 仓库概览

- **地址**：https://github.com/streamich/react-use
- **描述**：Collection of essential React Hooks
- **协议**：Unlicense
- **技术栈**：TypeScript、React 17、Yarn 1、Jest、Storybook 6

## 快速开始

1. Fork 并 clone 你的 fork
2. `yarn install`
3. 配置 upstream（见 CONTRIBUTING）并基于最新 `master` 开分支：`git checkout -b pr/your-branch-name`

## 开发命令

| 用途 | 命令 |
|------|------|
| 安装 | `yarn install` |
| 测试 | `yarn test` / `yarn test:watch` |
| 覆盖率 | `yarn test:coverage` |
| Lint | `yarn lint` / `yarn lint:types` |
| 本地演示 | `yarn start`（Storybook，端口 6008） |
| 构建 | `yarn build` |

## 如何贡献

### 官方要求

- 新 Hook：`src/` + `stories/` + `tests/` + `docs/` + `src/index.ts` + README
- 改现有 Hook：Storybook 开发 + 更新测试与 `docs/`
- Commit：Conventional Commits（`fix:` / `feat:`）— 项目用 semantic-release
- pre-push：lint + build + test

### 可参与的 Issue（示例标签）

| # | 标题 | 标签 |
|---|------|------|
| 956 | createGlobalState 应使用 useIsomorphicLayoutEffect | good first issue |
| 755 | Remove warnings from useDeepCompareEffect | good first issue |
| 1249 | Feature request: useScript | good first issue, new hook |

（实际列表以 `gh issue list` 为准。）

### 提交与 PR

- 一个 Issue 一个 PR，先在 Issue 下认领
- 推送前本地跑通 `yarn lint && yarn test`
- 避免与已有 open PR 重复（如 useScrolling 清理已有 PR）

## 推荐第一次贡献

- [ ] 选一个 `good first issue`
- [ ] Issue 下留言认领
- [ ] 实现 + `tests/` + 必要时 `docs/`
- [ ] `fix:` 或 `feat:` 前缀提交
- [ ] 向 **你的 fork** 推送并开 PR 到 `streamich/react-use`

## 参考链接

- CONTRIBUTING：https://github.com/streamich/react-use/blob/master/CONTRIBUTING.md
- Issues：https://github.com/streamich/react-use/issues
