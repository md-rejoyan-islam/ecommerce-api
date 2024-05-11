import brandModel from "../../models/brand.model.mjs";
import deleteImage from "../../helper/deleteImage.mjs";
import createError from "http-errors";

// get all brand service
export const getAllBrandService = async () => {
  const result = await brandModel.find().lean();

  // if result is empty
  if (!result.length) throw createError(404, "Couldn't find any brand data.");

  return result;
};

// create brand service
export const createBrandService = async (req) => {
  const { file } = req;

  const { name, description, slug } = req.body;

  // name validation
  const beforeData = await brandModel.findOne({ name });

  if (beforeData) {
    deleteImage(`/public/images/brands/${file.filename}`);
    throw createError(400, "Brand name already exists.");
  }

  // create new brand
  const result = await brandModel.create({
    name,
    description,
    slug,
    image: req?.file?.filename,
  });

  return result;
};

// get single brand service
export const getBrandServiceBySlug = async (slug) => {
  const result = await brandModel.findOne({ slug });
  if (!result) throw createError(404, "Couldn't find any brand data.");
  return result;
};

// delete brand service by id
export const deleteBrandServiceById = async (id) => {
  // brand delete
  const result = await brandModel.findByIdAndDelete(id);

  // if brand data not found
  if (!result) throw createError(404, "Couldn't find any brand data.");

  // delete image
  deleteImage(`/public/images/brands/${result?.brand_photo}`);

  return result;
};

// update brand service by id

export const updateBrandServiceById = async (file, id, options) => {
  const result = await brandModel.findByIdAndUpdate(id, options, {
    new: true,
    runValidators: true,
  });

  // if brand data not found
  if (!result) throw createError(404, "Couldn't find any brand data.");

  // before image delete
  file && deleteImage(`/public/images/brands/${result?.image}`);

  return result;
};
