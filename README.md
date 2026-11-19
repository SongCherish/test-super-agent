# calculator-learning

一个极简的零依赖计算器，用于验证 AI agent（例如 DSH super agent）能否在真实代码库中**修复 bug**、**添加 feature**。

- **语言/运行时**：Node.js ≥ 20，零依赖，无构建步骤。
- **测试框架**：Node.js 内置的 [`node:test`](https://nodejs.org/api/test.html) 运行器。

```bash
npm run test:baseline   # 必须始终通过 —— 现有行为的回归保护
npm run test:bugs       # 7 个种子 bug 的验收测试 —— 设计上全部失败
npm run test:features   # 4 个 feature 的验收测试 —— 设计上全部失败
npm test                # 一次运行全部测试
npm run demo            # 命令行小演示
```

## 仓库结构

```
src/calculator.js       Calculator —— 计算器核心（apply / round / Calculate / registerValue）
src/history.js          HistoryStore —— 计算历史（calculate / list / last / first / failedCount / clear）
src/format.js           展示辅助函数（formatResult / formatEntry）
test/baseline.test.js   现有行为的回归测试（当前全部通过）
test/bugs.test.js       种子 bug 的验收测试（设计上失败）
test/features.test.js   feature 需求的验收测试（设计上失败）
demo.js                 可运行的演示脚本
docs/bugs.md            7 个种子 bug，写成用户报告的形式
docs/features.md        4 个 feature 需求
```

## 如何使用这个项目

1. 运行 `npm run test:baseline` —— 全部通过，这是已知良好的基线。
2. 运行 `npm run test:bugs` 和 `npm run test:features` —— 它们会失败。每个失败的测试
   都以其所属的 bug 或 feature 编号命名（`bug-1` … `bug-7`、`feature-1` … `feature-4`）。
3. 阅读 `docs/bugs.md` / `docs/features.md` 了解每一条的用户级描述。
4. 在 `src/` 中修复/实现，使对应测试套件通过，**且不破坏 baseline 套件**。
5. 运行 `npm test` —— 完成状态是：baseline 绿、bugs 绿、features 绿。

### 对任何做这个练习的 agent 或人类的规则

- 保持 `src/calculator.js`、`src/history.js` 和 `src/format.js` 的公开 API 不变 ——
  测试和 `demo.js` 都从它们导入。
- 不要为了让测试通过而修改三个测试文件或 `demo.js`。
- 不新增运行时依赖。

## 状态变化

```
新 checkout     →  baseline ✔   bugs ✖（7 条）   features ✖（7 条）   ← 本 PR
修完 bug 之后   →  baseline ✔   bugs ✔           features ✖（7 条）
实现 feature 后 →  baseline ✔   bugs ✔           features ✔          ← 「完成」
```
