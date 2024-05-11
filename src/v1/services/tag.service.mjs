import createError from "http-errors";
import tagModel from "../../models/tag.model.mjs";

// get all tag service
export const getAllTagService = async () => {
  const result = await tagModel.find().lean();

  // if result is empty
  if (!result.length) throw createError(404, "Couldn't find any tag data.");

  return result;
};

// create tag service
export const createTagService = async (name, slug) => {
  // name validation
  const beforeData = await tagModel.findOne({ name }).lean();

  if (beforeData) {
    throw createError(400, "Tag name already exists.");
  }

  // create new tag
  const result = await tagModel.create({
    name,
    slug: slug
      ? slug.toLowerCase().split(" ").join("-")
      : name.toLowerCase().split(" ").join("-"),
  });

  return result;
};

// get tag by slug service

export const getTagBySlugService = async (slug) => {
  // data validation
  const result = await tagModel.findOne({ slug }).lean();
  if (!result) throw createError(404, "Couldn't find ant tag ");

  return result;
};

// delete tag service
export const deleteTagServiceById = async (id) => {
  // find by id and delete
  const result = await tagModel.findByIdAndDelete(id);
  if (!result) throw createError(404, "Couldn't find any tag data.");

  return result;
};

// update tag service by id
export const updateTagServiceById = async (id, options) => {
  const result = await Tag.findByIdAndUpdate(id, options, {
    new: true,
    runValidators: true,
    context: "query",
  });
  if (!result) throw createError(404, "Couldn't find ant tag ");

  return result;
};
