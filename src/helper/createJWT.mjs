import createError from "http-errors";
import jwt from "jsonwebtoken";

const createJWT = async (payload, secretKey, expiresIn) => {
  try {
    // payload check
    if (typeof payload !== "object" || !payload) {
      throw createError(404, "Payload must be a non-empty object.");
    }

    // secret key check
    if (typeof secretKey !== "string" || !secretKey) {
      throw createError(404, "Secret key must be a non-empty string");
    }

    // create token and return
    return jwt.sign(payload, secretKey, {
      expiresIn,
    });
  } catch (error) {
    console.log(error);
    console.log("Failed to create JWT");
  }
};

// export token
export default createJWT;
