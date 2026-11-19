# calculator-learning 的 Agent 指南

本仓库是一个刻意设计的学习/验证项目：内置了种子 bug 和未完成的 feature，
用于评估 AI agent 在真实代码上修复 bug、实现 feature 的能力。

## 练习内容

- `docs/bugs.md` —— 7 个用户报告的 bug。验收测试：`test/bugs.test.js`
  （测试名以 `bug-N` 开头）。新 checkout 时全部失败，这是设计使然。
- `docs/features.md` —— 4 个 feature 需求。验收测试：
  `test/features.test.js`（测试名以 `feature-N` 开头）。新 checkout 时全部
  失败，这是设计使然。
- `test/baseline.test.js` —— 现有行为的回归测试，必须始终保持通过。

## 工作规则

1. 只在 `src/` 中修 bug、实现 feature；保持导出的 API 不变。
2. 不要通过修改 `test/` 下的文件或 `demo.js` 来让测试通过。
3. 不新增运行时依赖；项目只使用 Node.js 标准库。
4. 完成标准：`npm test` 全部通过（baseline + bugs + features），且
   `npm run demo` 正常运行。

## 风格说明

- ES modules（`import`/`export`）、纯 JavaScript、无构建步骤。
- 导出函数与类方法的 JSDoc 注释用中文，遵循现有风格。
- 历史条目等公开返回值都是副本，不要泄漏内部可变对象。
- 测试运行器为 `node:test` + `node:assert/strict` —— 新增测试时保持风格一致。
