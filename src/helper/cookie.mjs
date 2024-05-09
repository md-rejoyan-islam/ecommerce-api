import { node_env } from "../app/secret.js";

// clear cookie
export const clearCookie = (res, cookieName) => {
  res.clearCookie("accessToken", {
    secure: node_env == "development" ? false : true,
    sameSite: "strict",
    httpOnly: true,
  });
};

// set cookie
export const setCookie = ({ res, cookieName, cookieValue, maxAge }) => {
  res.cookie(cookieName, cookieValue, {
    httpOnly: true,
    maxAge, // 7 days
    secure: node_env === "development" ? false : true, // only https
    sameSite: "none", // when use cross site
  });
};
