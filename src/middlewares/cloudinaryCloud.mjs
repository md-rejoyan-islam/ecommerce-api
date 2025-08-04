// product image upload to cloudinary
export const productUploadToCloud = async (file_path) => {
  const data = await cloudinary.uploader.upload(file_path, {
    folder: "ecommerce/products",
    use_filename: true,
  });
  return data.secure_url;
};

// user image upload to cloudinary
export const userUploadToCloud = async (file_path) => {
  const data = await cloudinary.uploader.upload(file_path, {
    folder: "ecommerce/users",
    use_filename: true,
  });
  return data.secure_url;
};

// brand image upload to cloudinary
export const brandUploadToCloud = async (file_path) => {
  const data = await cloudinary.uploader.upload(file_path, {
    folder: "ecommerce/brands",
    use_filename: true,
  });
  return data.secure_url;
};

// delete image from cloudinary
export const deleteCloudinaryImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};
