import createError from "http-errors";

const findUser = async (model, filter) => {
  // validate user
  const data = await model.find(filter);

  // validate user
  if (!data.length || !data) {
    throw createError(400, `couldn't find any user data.`);
  }
  return data;
};

export default findUser;
