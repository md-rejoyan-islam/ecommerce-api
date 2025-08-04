import asyncHandler from "express-async-handler";

import seedBrandsData from "../../../data/seeds.brand.mjs";
import seedCategoriesData from "../../../data/seeds.category.mjs";
import productBrandsData from "../../../data/seeds.product.mjs";
import seedTagsData from "../../../data/seeds.tags.mjs";
import seedsUsersData from "../../../data/seeds.users.js";
import { successResponse } from "../../helper/responseHandler.mjs";
import brandModel from "../../models/brand.model.mjs";
import categoryModel from "../../models/category.model.mjs";
import productModel from "../../models/product.model.mjs";
import tagModel from "../../models/tag.model.mjs";
import userModel from "../../models/user.model.mjs";

export const seedsUsers = asyncHandler(async (req, res, next) => {
  // delete all existing users
  await userModel.deleteMany({});

  // insert seeds data
  const users = await userModel.create(seedsUsersData).then((data) => {
    return data.map((user) => {
      delete user._doc.password;
      delete user._doc.__v;
      delete user._doc.createdAt;
      delete user._doc.updatedAt;
      return user._doc;
    });
  });

  // response with success message
  successResponse(res, {
    statusCode: 200,
    message: "Seeds data added successfully.",
    payload: {
      totalUsers: users.length,
      data: users,
    },
  });
});

// seed tags
export const seedsTags = asyncHandler(async (req, res, next) => {
  // delete all existing tags
  await tagModel.deleteMany({});

  // insert seeds data
  const tags = await tagModel.create(seedTagsData);

  // response with success message
  successResponse(res, {
    statusCode: 200,
    message: "Seeds data added successfully.",
    payload: {
      totalTags: tags.length,
      data: tags,
    },
  });
});

// seed categories
export const seedsCategories = asyncHandler(async (req, res, next) => {
  // delete all existing categories
  await categoryModel.deleteMany({});

  await Promise.all(
    seedCategoriesData.map(async (cat) => {
      const result = await categoryModel.create(cat);

      // childrens data insert
      if (cat?.children?.length > 0) {
        cat.children.forEach(async (child) => {
          await categoryModel.create({
            ...child,
            parent: result._id,
          });
        });
      }
    })
  );

  const result = await categoryModel
    .find({})
    .populate({
      path: "parent",
      select: "name",
      populate: {
        path: "parent",
        select: "name",
      },
    })
    .lean();

  // // response with success message
  successResponse(res, {
    statusCode: 200,
    message: "Seeds data added successfully.",
    payload: {
      totalCategories: result.length,
      data: result,
    },
  });
});

// seed brands
export const seedsBrands = asyncHandler(async (req, res, next) => {
  // delete all existing brands
  await brandModel.deleteMany({});

  // insert seeds data
  const brands = await brandModel.create(seedBrandsData);

  // response with success message
  successResponse(res, {
    statusCode: 200,
    message: "Seeds data added successfully.",
    payload: {
      totalBrands: brands.length,
      data: brands,
    },
  });
});

// seed products
export const seedsProducts = asyncHandler(async (req, res, next) => {
  // delete all existing products
  await productModel.deleteMany({});

  // insert seeds data
  const products = await productModel.create(productBrandsData);

  // response with success message
  successResponse(res, {
    statusCode: 200,
    message: "Seeds data added successfully.",
    payload: {
      totalProducts: products.length,
      data: products,
    },
  });
});
