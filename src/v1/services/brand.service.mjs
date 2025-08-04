import brandModel from "../../models/brand.model.mjs";
import deleteImage from "../../helper/deleteImage.mjs";
import createError from "http-errors";
import filterQuery from "../../utils/filterQuery.mjs";
import pagination from "../../utils/pagination.mjs";

// get all brand service
export const getAllBrandService = async (req, searchFields) => {
  // query filter
  const {
    queries: { skip, limit, fields, sortBy },
    filters,
  } = filterQuery(req, searchFields);

  const result = await brandModel
    .find(filters)
    .skip(skip)
    .limit(limit)
    .select(fields)
    .sort(sortBy)
    .lean()
    .then((brands) => {
      return brands.map((brand) => {
        return {
          ...brand,
          links: {
            self: `/api/v1/brands/${brand.slug}`,
          },
        };
      });
    });

  // if result is empty
  if (!result.length) throw createError(404, "Couldn't find any brand data.");

  // pagination object
  const paginationObject = await pagination({
    limit,
    page: req.query.page,
    skip,
    model: brandModel,
    filters,
  });

  return {
    result,
    pagination: paginationObject,
  };
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
  result.image && deleteImage(`/public/images/brands/${result?.image}`);

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

// multiple brand delete service
export const bulkDeleteBrandService = async (ids) => {
  // check data is present or not
  await Promise.all(
    ids.map(async (id) => {
      const result = await brandModel.findById(id);
      if (!result)
        throw createError(404, `Couldn't find Brand Data with id = ${id}`);
    })
  );

  const result = await brandModel.deleteMany({ _id: { $in: req.body.ids } });

  // delete image
  result.forEach((brand) => {
    brand.image && deleteImage(`/public/images/brands/${brand?.image}`);
  });

  return result;
};
