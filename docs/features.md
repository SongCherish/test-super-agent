# Feature 需求

以下每一条都写成需求的形式。对应的失败验收测试在 `test/features.test.js`，
测试名以 feature 编号开头。请在 `src/` 中实现这些 feature，直到
`npm run test:features` 全部通过，且不破坏 `npm run test:baseline` 和
`npm run test:bugs`。

## Feature 1 —— 平方根

**需求**："我想在计算器里直接对一个数开平方。"

- 位置：`src/calculator.js`，`Calculator` 新增方法 `sqrt(n)`。
- 行为：返回 `n` 的平方根；负数输入返回 `NaN`；精度要求与其它结果一致
  （`sqrt(2)` 与 `Math.sqrt(2)` 的误差小于 `1e-12`）。
- 测试：`feature-1: sqrt 返回平方根`、
  `feature-1: sqrt 对负数返回 NaN，精度足够高`。

## Feature 2 —— 清空寄存器

**需求**："我想一键把寄存器里的值清掉。"

- 位置：`src/calculator.js`，`Calculator` 新增方法 `clearRegister()`。
- 行为：调用后 `registerValue()` 返回 `null`；对从未计算过的计算器调用也安全。
- 测试：`feature-2: clearRegister 把寄存器清回 null`。
  （注意：完整验证依赖 bug-5 修复后的寄存器写入行为。）

## Feature 3 —— 搜索历史

**需求**："我想在历史里按表达式的一部分查找，比如搜 `add` 找出所有加法。"

- 位置：`src/history.js`，新增导出函数 `searchHistory(entries, query)`。
- 行为：返回 `expression` 中包含 `query` 的条目（不区分大小写），保持原有顺序，
  不修改输入；没有匹配时返回空列表。
- 测试：`feature-3: searchHistory 按表达式子串过滤（不区分大小写）`、
  `feature-3: searchHistory 不修改输入`。

## Feature 4 —— 历史多行格式化

**需求**："我想把历史打印成一段文本，最新的在最前面，还能限制行数。"

- 位置：`src/format.js`，新增导出函数 `formatExpressionHistory(entries, options)`。
- 行为：把条目逐行格式化（每行用现有的 `formatEntry`），**最新的在最前**；
  `options.limit` 限制最多输出的条数；空历史返回空字符串；不修改输入。
- 测试：`feature-4: formatExpressionHistory 最新在前，支持 limit`、
  `feature-4: 空历史格式化为空字符串`。
