import { createFactory } from "hono/factory";
import type { Env } from "../middleware";

export const factory = createFactory<Env>();

export const createHandlers = factory.createHandlers;
export const createMiddleware = factory.createMiddleware;
export const createApp = factory.createApp;
