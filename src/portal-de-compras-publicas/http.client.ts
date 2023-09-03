import * as u from "undici";
import { Time } from "./time.util";

export const HttpClient = {
  async request(url: string) {
    for (let tries = 0; tries < 3; tries += 1) {
      if (tries > 0) {
        await Time.sleep(500);
      }

      try {
        const response = await u.request(url);
        const contentType = response.headers["content-type"];

        if (contentType === undefined) continue;
        if (typeof contentType !== "string") continue;
        if (!contentType.includes("json")) continue;

        const data: any = await response.body.json();

        if (data.status !== undefined) continue;

        return { data };
      } catch (error) {
        if (error.code instanceof u.errors.ConnectTimeoutError) continue;
        throw error;
      }
    }

    throw new Error("max tries reached");
  },
};
