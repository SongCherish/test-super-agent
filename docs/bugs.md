# 种子 Bug 列表

以下每一条都写成用户报告的形式。对应的失败验收测试在 `test/bugs.test.js`，
测试名以 bug 编号开头。请在 `src/` 中修复代码，直到 `npm run test:bugs` 全部
通过，且不破坏 `npm run test:baseline`。

## Bug 1 —— 减法结果符号相反

**用户报告**："3 减 5 显示结果是 2，明明应该是 -2；10 减 4 倒是对的。"

- 位置：`src/calculator.js`，`apply` 的 `subtract` 分支。
- 预期：`subtract` 返回真实的差值 `a - b`，可以是负数。
- 测试：`bug-1: subtract 返回真实的差值（可以是负数）`。

## Bug 2 —— 除法的两个操作数被颠倒

**用户报告**："10 ÷ 2 显示 0.2，1 ÷ 3 直接报错说运算符不存在。"

- 位置：`src/calculator.js`，`apply` 的 `divide` 分支。
- 预期：`divide` 计算 `a ÷ b`（`apply(operator, a, b)` 中 `a` 是被除数），
  除以 0 得到 `Infinity` 或 `-Infinity` 也不报错。
- 测试：`bug-2: divide 计算 a ÷ b`。

## Bug 3 —— round 的精度位数为指定值 + 1

**用户报告**："让计算器保留 2 位小数，它却保留了 3 位。"

- 位置：`src/calculator.js`，`round`。
- 预期：`round(value, digits)` 用移位放大取整再缩小的实现时，放大倍数是
  `10 ** digits`；`round(2.345, 2)` 应约等于 `2.35`。
- 测试：`bug-3: round 保留指定的小数位数`。

## Bug 4 —— 百分比忘了除以 100

**用户报告**："输入 50 求百分比，返回的是 50 而不是 0.5。"

- 位置：`src/calculator.js`，`Calculate` 的 `percent` 分支。
- 预期：`Calculate(n, "percent")` 返回 `n / 100`。
- 测试：`bug-4: percent 返回 n / 100`。

## Bug 5 —— 计算结果没有存入寄存器

**用户报告**："算了好几题，寄存器里始终是空的。"

- 位置：`src/calculator.js`，`Calculate`（二元运算路径）。
- 预期：每次成功计算后（包括 `percent`），结果都存入寄存器，
  `registerValue()` 返回最后一次的结果；从未计算过时为 `null`。
- 测试：`bug-5: 成功计算后寄存器保存该结果`。

## Bug 6 —— last(n) 的条数与顺序都不对

**用户记录**：取「最近 n 条」时，返回的条数比 n 多，而且最新的一条不在最前面。

- 位置：`src/history.js`，`HistoryStore.last`。
- 预期：`last(n)` 返回恰好 `n` 条（不足 `n` 条时返回全部），最新的在最前，
  其余按时间倒序排列。
- 测试：`bug-6: last(n) 返回恰好 n 条且最新在最前`。

## Bug 7 —— 失败的计算没有记录到历史

**用户报告**："计算失败（比如输入了不存在的运算符）之后，历史里查不到任何痕迹，
也不知道失败了多少次。"

- 位置：`src/history.js`，`HistoryStore.calculate`。
- 预期：计算抛错时，先记录一条失败条目（`success: false`、`result: null`、
  `expression` 照常拼接），再把错误原样抛出；`failedCount()` 统计失败条数。
- 测试：`bug-7: 失败的计算也记录为失败条目`。
