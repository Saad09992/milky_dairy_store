import { Router } from "express";
import { getCount } from "../controller/CountController.js";

const countRouter = Router();

countRouter.get("/api/count", getCount);

export default countRouter;
