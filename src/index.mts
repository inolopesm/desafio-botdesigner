import fs from "node:fs/promises";
import { Repository } from "./repository.mjs";
import { Logger } from "./logger.mjs";

async function fetcher(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

const logger = new Logger(process.stdout);
const repository = new Repository(logger.logAsyncFn(fetcher));

await fs.writeFile(
  `result-${Date.now()}.json`,
  JSON.stringify(
    await repository.findProcessosByDataBetween(
      new Date(2023, 8 - 1, 30),
      new Date(2023, 9 - 1, 2)
    ),
    undefined,
    2
  )
);
