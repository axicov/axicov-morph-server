import { createMiddleware } from "hono/factory";
import { MorphCloudClient } from "morphcloud";

export type Env = {
  Variables: {
    mc: MorphCloudClient;
  };
};

export const morphCloudMiddleware = createMiddleware<Env>(async (c, next) => {
  const mc = new MorphCloudClient({
    apiKey: process.env.MORPH_API_KEY,
  });
  c.set("mc", mc);
  await next();
});
