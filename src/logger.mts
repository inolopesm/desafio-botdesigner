import type { Writable } from "stream";

export class Logger {
  constructor(private readonly stdout: Writable) {}

  logAsyncFn<T extends unknown[], U>(fn: (...args: T) => Promise<U>) {
    const { stdout } = this;

    return async function asyncFn(...args: T) {
      const startMs = Date.now();
      const result = await fn(...args);
      const endMs = Date.now();
      stdout.write(`fn: ${fn.name}\n`);
      stdout.write(`- args: ${args}\n`);
      stdout.write(`- result: ${result}\n`);
      stdout.write(`- time: ${endMs - startMs}ms\n`);
      return result;
    };
  }
}
