/**
 * Calculator —— 计算器核心（内存版，无副作用）。
 *
 * Calculate 执行一次二元运算并返回结果，同时把最后一次成功计算的结果
 * 存入寄存器；registerValue() 读取寄存器，clearRegister() 清空它
 * （见 docs/features.md）。
 *
 * 支持的运算符：
 *   add / subtract / multiply / divide（二元），percent（一元）
 */

const OPERATORS = ["add", "subtract", "multiply", "divide"];

/** 对单个二元运算求值；未知运算符抛 TypeError。 */
export function apply(operator, a, b) {
  switch (operator) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      return apply(b, "divide", a); // BUG（种子 bug 2）：参数顺序传反了
    default:
      throw new TypeError(`未知运算符: ${JSON.stringify(operator)}`);
  }
}

/**
 * 保留 digits 位小数（用移位放大取整再缩小的经典实现）。
 * Infinity / NaN 等非有限值原样返回。
 */
export function round(value, digits = 10) {
  if (!Number.isFinite(value)) return value;
  const shift = 10 ** (digits + 1); // BUG（种子 bug 3）：放大倍数多了一位
  return Math.round(value * shift) / shift;
}

export class Calculator {
  #register = null;

  /**
   * 执行一次运算，返回结果。
   * - 二元运算：Calculate(a, operator, b)
   * - 一元运算：Calculate(n, "percent")，返回 n / 100
   * 每次成功计算后，结果都会存入寄存器。
   */
  Calculate(a, operator, b) {
    if (operator === "percent") {
      if (!Number.isFinite(a)) {
        throw new TypeError(`percent 的操作数必须是有限数字, got: ${JSON.stringify(a)}`);
      }
      return a; // BUG（种子 bug 4）：忘了除以 100
    }
    if (typeof a !== "number" || !Number.isFinite(a)) {
      throw new TypeError(`操作数 a 必须是有限数字, got: ${JSON.stringify(a)}`);
    }
    if (typeof b !== "number" || !Number.isFinite(b)) {
      throw new TypeError(`操作数 b 必须是有限数字, got: ${JSON.stringify(b)}`);
    }
    const raw = apply(operator, a, b);
    const result = round(raw, 10);
    return result; // BUG（种子 bug 5）：文档承诺把结果存入寄存器，这里遗漏了
  }

  /** 读取寄存器中最后一次成功计算的结果；从未计算过时为 null。 */
  registerValue() {
    return this.#register;
  }

  /**
   * FEATURE 2 —— 尚未实现。
   * 见 docs/features.md：清空寄存器，使其回到 null。
   */
  clearRegister() {
    throw new Error("clearRegister 尚未实现（docs/features.md，feature 2）");
  }

  /**
   * FEATURE 1 —— 尚未实现。
   * 见 docs/features.md：返回平方根；负数输入返回 NaN。
   */
  sqrt(n) {
    throw new Error("sqrt 尚未实现（docs/features.md，feature 1）");
  }
}
