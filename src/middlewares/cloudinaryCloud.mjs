export const productUploadToCloud = async (file_path) => {
  // upload brand logo
  const data = await cloudinary.uploader.upload(file_path, {
    folder: "moon-tech/products",
    use_filename: true,
  });
  return data.secure_url;
};

export const deleteCloudinaryImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};
