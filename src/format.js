/**
 * 展示辅助函数：把结果与历史条目格式化为人类可读的字符串。
 */

/** 把计算结果显示为字符串；非有限值（NaN/Infinity）原样输出。 */
export function formatResult(value) {
  if (!Number.isFinite(value)) return String(value);
  return String(Math.round(value * 1e10) / 1e10);
}

/** 把一条历史条目格式化为一行，例如 "12 add 34 = 46"；失败条目以 "= 错误" 结尾。 */
export function formatEntry(entry) {
  const result = entry.success ? formatResult(entry.result) : "错误";
  return `${entry.expression} = ${result}`;
}

/**
 * FEATURE 4 —— 尚未实现。
 * 见 docs/features.md：把历史条目格式化为多行字符串，最新的在最前，
 * 并可以用 options.limit 限制最多输出的条数。
 */
export function formatExpressionHistory(entries, options = {}) {
  throw new Error("formatExpressionHistory 尚未实现（docs/features.md，feature 4）");
}
