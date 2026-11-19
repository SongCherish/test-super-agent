#!/usr/bin/env node
/**
 * 计算器的小演示。运行：node demo.js（或 npm run demo）。
 *
 * 做几次计算（包含一次会失败的），打印历史与寄存器。只负责输出，没有断言；
 * 输出中可以直观看到当前实现的一些缺陷。
 */
import { Calculator } from "./src/calculator.js";
import { HistoryStore } from "./src/history.js";
import { formatEntry } from "./src/format.js";

const calculator = new Calculator();
const history = new HistoryStore(calculator);

/** 执行一次计算；失败时打印一行提示而不是让演示崩溃。 */
function tryCalc(label, a, operator, b) {
  try {
    return history.calculate(a, operator, b);
  } catch (error) {
    console.log(`（${label} 失败：${error.message}）`);
    return null;
  }
}

tryCalc("", 12, "add", 34);
tryCalc("", 7, "multiply", 6);
tryCalc("", 3, "subtract", 5);
tryCalc("1 divide 3", 1, "divide", 3);
tryCalc("5 power 2", 5, "power", 2);
console.log("");

console.log("计算历史（history.last(10) 的输出）：");
for (const entry of history.last(10)) {
  console.log(`  ${formatEntry(entry)}`);
}
console.log("");
console.log(`寄存器中的值：${calculator.registerValue()}`);
