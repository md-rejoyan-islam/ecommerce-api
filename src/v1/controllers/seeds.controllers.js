import User from "../../models/user.model.js";
import seedsUsers from "../../../data/seeds.users.js";

export const seedsUser = async (req, res, next) => {
  try {
    console.log("seeds user");
    // delete all users
    await User.deleteMany({});

    // add new data
    const users = await User.create(seedsUsers);

    // response
    res.status(200).json({
      status: true,
      message: "Added seeds data",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
