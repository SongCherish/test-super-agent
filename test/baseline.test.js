/**
 * 基线套件 —— 现有行为的回归测试。
 *
 * 预期状态：新 checkout 时全部通过。
 * 如果改动之后这里有测试失败，说明你改坏了东西。
 *
 * （刻意不覆盖：减法、除法、round 的精度、percent、寄存器写入、last(n) 的
 * 顺序与条数、失败计算的记录 —— 这些一开始就是坏的，由 test/bugs.test.js 覆盖。）
 */
import test from "node:test";
import assert from "node:assert/strict";

import { apply, round, Calculator } from "../src/calculator.js";
import { HistoryStore } from "../src/history.js";
import { formatResult, formatEntry } from "../src/format.js";

test("apply 支持加法和乘法", () => {
  assert.equal(apply("add", 12, 34), 46);
  assert.equal(apply("multiply", 7, 6), 42);
});

test("apply 对未知运算符抛 TypeError", () => {
  assert.throws(() => apply("power", 2, 3), TypeError);
  assert.throws(() => apply("", 2, 3), TypeError);
});

test("Calculate 校验操作数必须是有限数字", () => {
  const calculator = new Calculator();
  assert.throws(() => calculator.Calculate("12", "add", 34), TypeError);
  assert.throws(() => calculator.Calculate(12, "add", "34"), TypeError);
  assert.throws(() => calculator.Calculate(NaN, "add", 34), TypeError);
  assert.throws(() => calculator.Calculate(12, "add", Infinity), TypeError);
});

test("percent 的操作数必须是有限数字", () => {
  const calculator = new Calculator();
  assert.throws(() => calculator.Calculate(NaN, "percent"), TypeError);
  assert.throws(() => calculator.Calculate("50", "percent"), TypeError);
});

test("round 对非有限值与整数原样返回", () => {
  assert.equal(round(NaN), NaN);
  assert.equal(round(Infinity), Infinity);
  assert.equal(round(5), 5);
});

test("新计算器的寄存器初始为 null", () => {
  assert.equal(new Calculator().registerValue(), null);
});

test("HistoryStore 要求注入带 Calculate 方法的计算器", () => {
  assert.throws(() => new HistoryStore(null), TypeError);
  assert.throws(() => new HistoryStore({}), TypeError);
  assert.doesNotThrow(() => new HistoryStore({ Calculate: () => 0 }));
});

test("calculate 成功时按时间顺序记录条目", () => {
  const history = new HistoryStore({ Calculate: (a, op, b) => a + b });
  history.calculate(12, "add", 34);
  history.calculate(7, "multiply", 6);

  const entries = history.list();
  assert.equal(entries.length, 2);
  assert.equal(entries[0].expression, "12 add 34");
  assert.equal(entries[0].result, 46);
  assert.equal(entries[0].success, true);
  assert.deepEqual(entries[0].operands, [12, 34]);
  assert.ok(entries[0].at instanceof Date);
  assert.equal(entries[1].expression, "7 multiply 6");
});

test("calculate 失败时原样抛出错误", () => {
  const history = new HistoryStore({
    Calculate: () => {
      throw new TypeError("boom");
    },
  });
  assert.throws(() => history.calculate(1, "add", 2), TypeError);
});

test("first(n) 返回最早的 n 条，时间正序", () => {
  const history = new HistoryStore({ Calculate: (a, op, b) => a + b });
  history.calculate(1, "add", 2);
  history.calculate(3, "add", 4);
  history.calculate(5, "add", 6);

  const firstTwo = history.first(2);
  assert.deepEqual(firstTwo.map((entry) => entry.expression), ["1 add 2", "3 add 4"]);
});

test("list 返回副本，修改不影响内部历史", () => {
  const history = new HistoryStore({ Calculate: (a, op, b) => a + b });
  history.calculate(1, "add", 2);

  const entries = history.list();
  entries[0].expression = "mutated";
  entries[0].operands.push(99);
  assert.equal(history.list()[0].expression, "1 add 2");
  assert.deepEqual(history.list()[0].operands, [1, 2]);
});

test("clear() 清空历史", () => {
  const history = new HistoryStore({ Calculate: (a, op, b) => a + b });
  history.calculate(1, "add", 2);
  history.clear();
  assert.equal(history.list().length, 0);
});

test("formatResult 修正浮点误差并原样输出非有限值", () => {
  assert.equal(formatResult(0.1 + 0.2), "0.3");
  assert.equal(formatResult(46), "46");
  assert.equal(formatResult(NaN), "NaN");
  assert.equal(formatResult(Infinity), "Infinity");
});

test("formatEntry 格式化成功与失败条目", () => {
  assert.equal(
    formatEntry({ expression: "12 add 34", success: true, result: 46 }),
    "12 add 34 = 46",
  );
  assert.equal(
    formatEntry({ expression: "5 power 2", success: false, result: null }),
    "5 power 2 = 错误",
  );
});
