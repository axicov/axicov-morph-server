import { Hono } from "hono";
import { Env, morphCloudMiddleware } from "./middleware";
import v1 from "./routes/v1";

const app = new Hono<Env>();

// middlewares
app.use("*", morphCloudMiddleware);

// v1 routes
app.route("/v1", v1);

export default {
  port: 8080,
  fetch: app.fetch,
  idleTimeout: 60,
};
