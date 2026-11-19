/**
 * 计算历史 —— 记录每次计算的表达式与结果。
 *
 * 历史条目结构：
 *   {
 *     expression: "12 add 34",       // 人类可读的表达式
 *     operator: string,
 *     operands: [a, b],              // 一元运算时 b 为 null
 *     result: number | null,         // 失败的记录为 null
 *     success: boolean,
 *     at: Date
 *   }
 *
 * list()/last()/first() 返回的都是副本，修改返回值不会影响存储的历史。
 */

export class HistoryStore {
  #calculator;
  #entries = [];

  /** calculator 需要提供 Calculate 方法（注入，便于单独测试）。 */
  constructor(calculator) {
    if (!calculator || typeof calculator.Calculate !== "function") {
      throw new TypeError("calculator 必须提供 Calculate(a, operator, b) 方法");
    }
    this.#calculator = calculator;
  }

  /** 执行一次计算并记入历史；计算抛错时同样记录一条失败条目，并原样抛出错误。 */
  calculate(a, operator, b) {
    let result = null;
    try {
      result = this.#calculator.Calculate(a, operator, b);
    } catch (error) {
      throw error; // BUG（种子 bug 7）：失败的计算没有记录，直接把错误抛了出去
    }
    this.#entries.push({
      expression: `${a} ${operator} ${b}`,
      operator,
      operands: [a, b],
      result,
      success: true,
      at: new Date(),
    });
    return result;
  }

  /** 全部条目，按时间先后排序。每项都是副本。 */
  list() {
    return this.#entries.map((entry) => ({ ...entry, operands: [...entry.operands] }));
  }

  /** 最近 n 条，最新的在最前。 */
  last(n) {
    return this.list().slice(-n - 1); // BUG（种子 bug 6）：窗口取多了，而且没有把最新的排到最前
  }

  /** 最早 n 条，按时间先后排序。 */
  first(n) {
    return this.list().slice(0, n);
  }

  /** 失败计算的数量。 */
  failedCount() {
    return this.list().filter((entry) => !entry.success).length;
  }

  /** 清空历史。 */
  clear() {
    this.#entries = [];
  }
}

/**
 * FEATURE 3 —— 尚未实现。
 * 见 docs/features.md：按表达式子串过滤历史条目（不区分大小写），保持原有顺序。
 */
export function searchHistory(entries, query) {
  throw new Error("searchHistory 尚未实现（docs/features.md，feature 3）");
}
