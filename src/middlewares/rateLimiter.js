import { rateLimit } from "express-rate-limit";
import { errorResponse } from "../v1/services/responseHandler.mjs";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  limit: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: async (req, res) => {
    return errorResponse(res, {
      statusCode: 429,
      message: "Too many requests, please try again later.",
    });
  },
});

export default limiter;
