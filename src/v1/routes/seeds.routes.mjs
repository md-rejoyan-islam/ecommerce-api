import express from "express";
import {
  seedsBrands,
  seedsCategories,
  seedsProducts,
  seedsTags,
  seedsUsers,
} from "../controllers/seeds.controllers.mjs";

const seedRouter = express.Router();

seedRouter.route("/users").get(seedsUsers);
seedRouter.route("/tags").get(seedsTags);
seedRouter.route("/categories").get(seedsCategories);
seedRouter.route("/brands").get(seedsBrands);
seedRouter.route("/products").get(seedsProducts);

export default seedRouter;
