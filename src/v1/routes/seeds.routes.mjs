import express from "express";
import { authorization } from "../../middlewares/authorization.mjs";
import { isLoggedIn } from "../../middlewares/verify.mjs";
import {
  seedsBrands,
  seedsCategories,
  seedsProducts,
  seedsTags,
  seedsUsers,
} from "../controllers/seeds.controllers.mjs";

const seedRouter = express.Router();

seedRouter.route("/users").get(isLoggedIn, authorization("admin"), seedsUsers);
seedRouter.route("/tags").get(isLoggedIn, authorization("admin"), seedsTags);
seedRouter
  .route("/categories")
  .get(isLoggedIn, authorization("admin"), seedsCategories);
seedRouter
  .route("/brands")
  .get(isLoggedIn, authorization("admin"), seedsBrands);
seedRouter
  .route("/products")
  .get(isLoggedIn, authorization("admin"), seedsProducts);

export default seedRouter;
