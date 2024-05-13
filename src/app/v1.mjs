import authRouter from "../v1/routes/auth.routes.mjs";
import productRouter from "../v1/routes/product.routes.mjs";
import userRouter from "../v1/routes/users.routes.mjs";
import brandRouter from "../v1/routes/brand.routes.mjs";
import categoryRouter from "../v1/routes/category.routes.mjs";
import tagRouter from "../v1/routes/tag.routes.mjs";

// version 1 routes
const v1 = [
  {
    path: "/api/v1/auth",
    route: authRouter,
  },
  {
    path: "/api/v1/products",
    route: productRouter,
  },
  {
    path: "/api/v1/users",
    route: userRouter,
  },
  {
    path: "/api/v1/brands",
    route: brandRouter,
  },
  {
    path: "/api/v1/categories",
    route: categoryRouter,
  },
  {
    path: "/api/v1/tags",
    route: tagRouter,
  },
];

export default v1;
