export const Time = {
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
};
