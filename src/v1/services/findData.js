import createError from 'http-errors';

const findData = async (model, filter) => {
  // validate user
  const data = await model.find(filter);

  // validate user
  if (!data.length || !data) {
    throw createError(400, `couldn't find any ${model.modelName} data`);
  }
  return data;
};

export default findData;
