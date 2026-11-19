/**
 * FEATURE 需求的验收测试。
 *
 * 预期状态：新 checkout 时这些测试全部失败 —— 这正是练习的意义。
 * 在 src/ 中实现各 feature，直到本套件全部通过，且不破坏
 * test/baseline.test.js 和 test/bugs.test.js。
 *
 * 运行：npm run test:features
 */
import test from "node:test";
import assert from "node:assert/strict";

import { Calculator } from "../src/calculator.js";
import { HistoryStore, searchHistory } from "../src/history.js";
import { formatEntry, formatExpressionHistory } from "../src/format.js";

// ─── Feature 1：平方根 ──────────────────────────────────────────────────────

test("feature-1: sqrt 返回平方根", () => {
  const calculator = new Calculator();
  assert.equal(calculator.sqrt(9), 3);
  assert.equal(calculator.sqrt(0), 0);
});

test("feature-1: sqrt 对负数返回 NaN，精度足够高", () => {
  const calculator = new Calculator();
  assert.ok(Number.isNaN(calculator.sqrt(-4)));
  const root2 = calculator.sqrt(2);
  assert.ok(Math.abs(root2 - Math.sqrt(2)) < 1e-12, `期望接近 ${Math.sqrt(2)}，得到 ${root2}`);
});

// ─── Feature 2：清空寄存器 ──────────────────────────────────────────────────

test("feature-2: clearRegister 把寄存器清回 null", () => {
  // 注意：完整验证依赖 bug-5 修复后的寄存器写入行为。
  const calculator = new Calculator();
  calculator.Calculate(2, "add", 3);
  assert.notEqual(calculator.registerValue(), null);

  calculator.clearRegister();
  assert.equal(calculator.registerValue(), null);

  const fresh = new Calculator();
  fresh.clearRegister();
  assert.equal(fresh.registerValue(), null);
});

// ─── Feature 3：搜索历史 ────────────────────────────────────────────────────

test("feature-3: searchHistory 按表达式子串过滤（不区分大小写）", () => {
  const history = new HistoryStore({ Calculate: (a, op, b) => a + b });
  history.calculate(12, "add", 34);
  history.calculate(7, "multiply", 6);
  history.calculate(12, "add", 5);
  const entries = history.list();

  assert.deepEqual(
    searchHistory(entries, "add").map((entry) => entry.expression),
    ["12 add 34", "12 add 5"],
  );
  assert.deepEqual(
    searchHistory(entries, "ADD").map((entry) => entry.expression),
    ["12 add 34", "12 add 5"],
  );
  assert.deepEqual(
    searchHistory(entries, "multiply").map((entry) => entry.expression),
    ["7 multiply 6"],
  );
  assert.deepEqual(searchHistory(entries, "no-such-thing"), []);
});

test("feature-3: searchHistory 不修改输入", () => {
  const history = new HistoryStore({ Calculate: (a, op, b) => a + b });
  history.calculate(12, "add", 34);
  history.calculate(7, "multiply", 6);
  const entries = history.list();

  searchHistory(entries, "add");
  assert.deepEqual(
    entries.map((entry) => entry.expression),
    ["12 add 34", "7 multiply 6"],
  );
});

// ─── Feature 4：历史多行格式化 ──────────────────────────────────────────────

test("feature-4: formatExpressionHistory 最新在前，支持 limit", () => {
  const history = new HistoryStore({ Calculate: (a, op, b) => a + b });
  history.calculate(1, "add", 2);
  history.calculate(3, "add", 4);
  history.calculate(5, "add", 6);
  const entries = history.list();

  const text = formatExpressionHistory(entries);
  const lines = text.split("\n");
  assert.equal(lines.length, 3);
  assert.equal(lines[0], formatEntry(entries[2]), "最新的条目应该在第一行");
  assert.equal(lines[2], formatEntry(entries[0]), "最早的条目应该在最后一行");

  const limited = formatExpressionHistory(entries, { limit: 2 }).split("\n");
  assert.equal(limited.length, 2);
  assert.equal(limited[0], formatEntry(entries[2]));

  assert.deepEqual(
    entries.map((entry) => entry.expression),
    ["1 add 2", "3 add 4", "5 add 6"],
  );
});

test("feature-4: 空历史格式化为空字符串", () => {
  assert.equal(formatExpressionHistory([]), "");
});
