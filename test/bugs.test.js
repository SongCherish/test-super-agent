/**
 * 种子 BUG 的验收测试。
 *
 * 预期状态：新 checkout 时这些测试全部失败 —— 这正是练习的意义。
 * 每个 describe 块对应 docs/bugs.md 中的一条 bug。在 src/ 中修复 bug，
 * 直到本套件全部通过，且不破坏 test/baseline.test.js。
 *
 * 运行：npm run test:bugs
 */
import test from "node:test";
import assert from "node:assert/strict";

import { round, Calculator } from "../src/calculator.js";
import { HistoryStore } from "../src/history.js";

// ─── Bug 1：减法结果的符号是反的 ────────────────────────────────────────────

test("bug-1: subtract 返回真实的差值（可以是负数）", () => {
  const calculator = new Calculator();
  assert.equal(calculator.Calculate(10, "subtract", 4), 6);
  assert.equal(calculator.Calculate(3, "subtract", 5), -2);
});

// ─── Bug 2：除法的两个操作数被颠倒 ──────────────────────────────────────────

test("bug-2: divide 计算 a ÷ b", () => {
  const calculator = new Calculator();
  assert.equal(calculator.Calculate(10, "divide", 2), 5);
  const result = calculator.Calculate(1, "divide", 3);
  assert.ok(Math.abs(result - 1 / 3) < 1e-9, `期望约 0.3333，得到 ${result}`);
});

// ─── Bug 3：round 的放大倍数多了一位 ────────────────────────────────────────

test("bug-3: round 保留指定的小数位数", () => {
  const a = round(1.234567890123, 10);
  assert.ok(Math.abs(a - 1.2345678901) < 1e-15, `期望 1.2345678901，得到 ${a}`);

  const b = round(2.345, 2);
  assert.ok(Math.abs(b - 2.35) < 1e-15, `期望 2.35，得到 ${b}`);
});

// ─── Bug 4：percent 忘了除以 100 ────────────────────────────────────────────

test("bug-4: percent 返回 n / 100", () => {
  const calculator = new Calculator();
  assert.equal(calculator.Calculate(50, "percent"), 0.5);
  assert.ok(Math.abs(calculator.Calculate(7.5, "percent") - 0.075) < 1e-15);
});

// ─── Bug 5：成功计算的结果没有存入寄存器 ────────────────────────────────────

test("bug-5: 成功计算后寄存器保存该结果", () => {
  const calculator = new Calculator();
  calculator.Calculate(2, "add", 3);
  assert.equal(calculator.registerValue(), 5);

  calculator.Calculate(7, "multiply", 6);
  assert.equal(calculator.registerValue(), 42);
});

// ─── Bug 6：last(n) 的条数与顺序都不对 ──────────────────────────────────────

test("bug-6: last(n) 返回恰好 n 条且最新在最前", () => {
  const history = new HistoryStore({ Calculate: (a, op, b) => a + b });
  history.calculate(1, "add", 2);
  history.calculate(3, "add", 4);
  history.calculate(5, "add", 6);

  const lastTwo = history.last(2);
  assert.equal(lastTwo.length, 2);
  assert.deepEqual(
    lastTwo.map((entry) => entry.expression),
    ["5 add 6", "3 add 4"],
  );
});

// ─── Bug 7：失败的计算没有记录到历史 ────────────────────────────────────────

test("bug-7: 失败的计算也记录为失败条目", () => {
  const history = new HistoryStore(new Calculator());

  assert.throws(() => history.calculate(5, "power", 2), TypeError);
  assert.equal(history.failedCount(), 1);

  const entries = history.list();
  assert.equal(entries.length, 1);
  assert.equal(entries[0].success, false);
  assert.equal(entries[0].result, null);
  assert.equal(entries[0].expression, "5 power 2");
});
