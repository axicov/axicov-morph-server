import { Hono } from "hono";
import { Env } from "../middleware";
import { createNewSnapshot, createNewInstance } from "../controllers";

const v1 = new Hono<Env>();

// for other users
v1.get("/snapshot/create", ...createNewSnapshot);
v1.post("/instance/start", ...createNewInstance);

// for scripts
// v1.post("/script/upload");

export default v1;
