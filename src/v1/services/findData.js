import createError from "http-errors";

const findData = async ({ model, filter, options }) => {
  // validate user
  const data = await model.find(filter, options);

  // validate user
  if (!data.length || !data) {
    throw createError(
      400,
      `couldn't find any ${model.modelName.toLowerCase()} data.`
    );
  }
  return data;
};

export default findData;
