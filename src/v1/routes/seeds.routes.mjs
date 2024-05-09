import express from "express";
import { seedsUser } from "../controllers/seeds.controllers.mjs";

const seedRouter = express.Router();

seedRouter.route("/users").get(seedsUser);

export default seedRouter;
