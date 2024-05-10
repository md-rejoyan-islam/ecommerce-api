export const port = process.env.SERVER_PORT || 5050;

export const hostname = process.env.HOST_NAME || "127.0.0.1";

export const node_env = process.env.NODE_ENV || "development";

export const mongoURL = process.env.LIVE_MONGO_URL || process.env.MONGO_URL;

export const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH;

export const jwtVerifyKeySecret = process.env.JWT_VERIFY_KEY;
export const jwtVerifyKeyExpire = process.env.JWT_VERIFY_KEY_EXPIRE;

export const jwtRegisterSecretKey = process.env.JWT_REGISTER_KEY;
export const jwtRegisterKeyExpire = process.env.JWT_REGISTER_KEY_EXPIRE;

export const passwordResetKey = process.env.PASSWORD_RESET_KEY;
export const passwordResetKeyExpire = process.env.PASSWORD_RESET_KEY_EXPIRE;

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
export const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRE;

export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
export const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE;

export const smtpHost = process.env.SMTP_HOST;
export const smtpPort = process.env.SMTP_PORT;
export const emailUser = process.env.EMAIL_HOST_USER;
export const emailPass = process.env.EMAIL_HOST_PASSWORD;

export const clientURL = process.env.CLIENT_URL;

export const userImageUploadDir = process.env.USER_IMAGE_UPLOAD_DIR;
export const userMaxImageSize = process.env.USER_MAX_IMAGE_SIZE;
export const allowedImageTypes = process.env.ALLOWED_IMAGE_TYPE;
