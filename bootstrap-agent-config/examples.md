# Examples — launcher（Qt6 + C++/MinGW）实战样例

一份完整跑下来的样例，展示"流程跑完长什么样"。目标项目是一个 Qt6 桌面启动器，Windows 下用 MinGW 构建。

> ⚠️ **这只是其中一种实例化，不是模板。** 下面的 CMake / MinGW / PowerShell / `windeployqt` 等都是**这个项目**的特化细节，**不要照搬到别的项目**。skill 的实际行为由 [SKILL.md](SKILL.md) 决定，它与语言无关——永远先探测目标项目的真实命令。Go / Python / JS-web 等其它栈的对应形态见文末「其他技术栈速查」。

## 阶段 1 — 探测结论

- 语言/框架：C++17 + Qt6 Widgets，CMake 构建。
- 构建命令复杂：依赖**机器相关**的 Qt / MinGW 路径，且必须带 `-DCMAKE_POLICY_VERSION_MINIMUM=3.5`。
- 运行：`build/launcher.exe`，全局热键 `Alt+Space` 唤起。
- 已有 `AGENTS.md`（构建指南 + 维护约定）、`docs/notes.md`、`docs/features.md`（均为单体文件）。
- 已知坑：编译器须与 Qt ABI 配套、用 `qt_add_executable`、Alt+Space 系统保留键等。

## 阶段 2 — 范围选择

- hooks：**否**（用户明确反对强制式）。
- loop：构建-修复 + 运行-验证 + 新插件开发。
- docs：改成 references 结构。
- 机器相关路径：**是** → 用 `settings.local.json` 注入 `QT_DIR` / `MINGW`。

## 阶段 3-4 — 生成的 Claude 适配（节选）

`AGENTS.md` 顶部新增「AI 工具」表（`/build`、`/runapp`、`add-plugin`）+ 判断式维护约定。

`.claude/settings.local.json`（gitignored）：
```json
{
  "env": {
    "QT_DIR": "D:\\Qt\\6.8.3\\mingw_64",
    "MINGW": "D:\\Qt\\Tools\\mingw1310_64\\bin"
  }
}
```

`.claude/commands/build.md` 的构建-修复循环（关键：PowerShell 下每个 `-D` 整体加引号）：
```powershell
cmake -S . -B build -G "MinGW Makefiles" `
    "-DCMAKE_PREFIX_PATH=$env:QT_DIR" `
    "-DCMAKE_CXX_COMPILER=$env:MINGW\g++.exe" `
    "-DCMAKE_MAKE_PROGRAM=$env:MINGW\mingw32-make.exe" `
    "-DCMAKE_BUILD_TYPE=Release" `
    "-DCMAKE_POLICY_VERSION_MINIMUM=3.5"
& "$env:MINGW\mingw32-make.exe" -C build -j8
```
> 这里就是踩坑表里那条：早期未加引号导致 `3.5` 被吞成 `3`、配置失败；修法是整体加引号。

## 阶段 7 — docs 索引化前后对比

**前**（单体）：
```
docs/notes.md      # 4 条踩坑堆在一个文件
docs/features.md   # 已完成表 + 5 个待实现
```

**后**（references 渐进式）：
```
docs/notes.md              # 索引：每条一行带描述
docs/notes/
  ├── mingw-abi-mismatch.md
  ├── qt-add-executable.md
  ├── cmake-policy-version.md
  ├── powershell-cmake-quoting.md
  └── altspace-reserved-key.md
docs/features.md           # 索引：已完成表 + 待实现一行带描述
docs/features/
  ├── calc-plugin.md
  ├── file-plugin.md
  └── ...
```
索引行示例：
```markdown
- [PowerShell 下 cmake 的 -D 参数必须整体加引号](notes/powershell-cmake-quoting.md) — 报 Invalid value "3"（3.5 被吞成 3）时看这篇
```

## 端到端验证结果

`/build` 首次实跑即暴露并修复了 PowerShell 引号坑，最终产出 `launcher.exe`；该坑被沉淀进 `docs/notes/` 并补进索引——印证了"loop 内嵌修复 + 判断式文档"的价值。

## 给三家的最终落点

- `AGENTS.md` + `CLAUDE.md`（一行桥接）：三家共享。
- `.claude/`：settings.json（权限）+ settings.local.json（env）+ commands（循环）+ skills（add-plugin）。
- `.cursor/rules/`：一条 alwaysApply 指向 AGENTS.md 规范。
- Codex：直接吃 AGENTS.md。

---

## 其他技术栈速查

同一套流程套到不同栈上，变化的只是「构建/运行的真实命令」「运行-验证循环的形态」「典型坑」「要不要 env 注入」。上面 C++ 的特化项一概**不适用**这些栈。

| 维度 | Go | Python | JS / Web（前端） |
|------|----|--------|-----------------|
| `/build` 内容 | `go build ./...`；修复循环读 `go vet` / 编译错误 | 通常无编译；改为 `pip install -e .` / `uv sync` + `mypy` / `ruff` | `npm ci` + `npm run build`（或 vite/tsc）；读类型/打包错误 |
| `/run` 验证形态 | 跑二进制或 `go run`，按子命令/接口核对 | `python -m <app>` / `pytest`，按用例核对 | **启 dev server**（`npm run dev`）+ 浏览器核对页面/接口；非"启动 exe" |
| 测试入口 | `go test ./...` | `pytest` | `npm test` / `vitest` / `playwright` |
| 典型坑（进 docs/notes） | CGO 交叉编译、`GOFLAGS`/代理、版本与 `go.mod` 不符 | 虚拟环境未激活、解释器版本、依赖锁文件不一致 | Node 版本（`.nvmrc`/`engines`）、包管理器锁文件混用、ESM/CJS、构建环境变量 |
| 需要 env 注入吗 | 多数不需要（除非私有模块代理/凭据） | 一般不需要（venv 路径靠探测） | 一般不需要；密钥用 `.env`（本就 gitignore） |
| Cursor 条件规则 `globs` | `**/*.go` | `**/*.py` | `src/**/*.{ts,tsx,vue}` |

**要点**：`/run` 在 web 项目里是"起服务 + 浏览器/接口验证"的循环，而非桌面应用的"启动可执行文件"；很多解释型/前端项目根本没有"配置→编译"这一步，`/build` 退化为"装依赖 + 类型检查 + 打包"。生成时按探测结果裁剪，不要套 C++ 的形状。
