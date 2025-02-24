## Multi-Vendor Ecommerce API

### DESCRIPTION

The Multi-Vendor Ecommerce API is designed to support a marketplace where multiple vendors can sell their products. Whether you’re building a platform for sellers or integrating with existing Ecommerce solutions, this API provides the necessary functionality.

### Features

- <b>Buyer Registration :</b>
  - Buyer can create accounts and log in securely.
  - Easily find product by slug and give rewview.
- <b>Vendor Registration and Authentication:</b>
  - Vendors can create accounts and log in securely.
  - Authentication tokens are generated for API requests.
- <b>Product Management:</b>
  - Vendors can add, update, and delete their products.
  - Products include details such as name, description, price, and availability.

### PACKAGES

- Express
- Express-validator
- Mongoose
- Multer
- Nodemailer
- Wintson Loger
- JWT
- Bcryptjs
- Cookie-parser

### API ENDPOINTS

#### Auth

| Method | Endpoint                   | Details                                              | Access        |
| ------ | -------------------------- | ---------------------------------------------------- | ------------- |
| POST   | /api/v1/auth/register      | Registers a new user                                 | Public        |
| POST   | /api/v1/auth/activate      | Activates a user account after registration.         | Public        |
| POST   | /api/v1/auth/login         | Logs in a user with validation and request limiter   | Public        |
| GET    | /api/v1/auth/refresh-token | Refreshes the user's session token.                  | Public        |
| POST   | /api/v1/auth/logout        | Logs out a user, requiring the user to be logged in. | Authenticated |
| GET    | /api/v1/auth/me            | Retrieves the current logged-in user's information.  | Authenticated |

#### Users

| Method | Endpoint                             | Details                                     | Access              |
| ------ | ------------------------------------ | ------------------------------------------- | ------------------- |
| GET    | /api/v1/users/                       | Retrieves a list of all users.              | Admin Only          |
| POST   | /api/v1/users/                       | Creates a new user.                         | Admin Only          |
| PATCH  | /api/v1/users/ban-user/:id           | Bans a user by their ID.                    | Admin Only          |
| PATCH  | /api/v1/users/unban-user/:id         | Unbans a user by their ID.                  | Admin Only          |
| PATCH  | /api/v1/users/update-password/:id    | Updates a user's password by their ID.      |
| GET    | /api/v1/users/forgot-password/:email | Initiates a password reset with email       | Admin, User, Seller |
| PATCH  | /api/v1/users/reset-password         | Resets a user's password.                   | Admin, User, Seller |
| GET    | /api/v1/users/:id                    | Retrieves a user's information by their ID. | Admin, User, Seller |
| DELETE | /api/v1/users/:id                    | Deletes a user by their ID.                 | Admin, User, Seller |
| PATCH  | /api/v1/users/:id                    | Updates a user's details by their ID.       | Admin, User, Seller |

#### Brands

| Method | Endpoint                   | Details                                    | Access        |
| ------ | -------------------------- | ------------------------------------------ | ------------- |
| GET    | /api/v1/brands/            | Retrieves a list of all brands.            | Public        |
| POST   | /api/v1/brands/            | Creates a new brand.                       | Authenticated |
| DELETE | /api/v1/brands/bulk-delete | Bulk deletes brands based on provided IDs. | Admin Only    |
| GET    | /api/v1/brands/:slug       | Retrieves a brand by its slug              | Authenticated |
| DELETE | /api/v1/brands/:id         | Deletes a brand by its ID                  | Authenticated |
| PATCH  | /api/v1/brands/:id         | Updates a brand by its ID                  | Authenticated |

#### Tags

| Method | Endpoint           | Details                       | Access        |
| ------ | ------------------ | ----------------------------- | ------------- |
| GET    | /api/v1/tags/      | Retrieves a list of all tags. | Public        |
| POST   | /api/v1/tags/      | Creates a new tag.            | Authenticated |
| GET    | /api/v1/tags/:slug | Retrieves a tag by its slug.  | Authenticated |
| DELETE | /api/v1/tags/:id   | Deletes a tag by its ID.      | Authenticated |
| PATCH  | /api/v1/tags/:id   | Updates a tag by its ID.      | Authenticated |

#### Categories

| Method | Endpoint                 | Details                             | Access        |
| ------ | ------------------------ | ----------------------------------- | ------------- |
| GET    | /api/v1/categories/      | Retrieves a list of all categories. | Public        |
| POST   | /api/v1/categories/      | Creates a new category.             | Authenticated |
| GET    | /api/v1/categories/:slug | Retrieves a category by its slug.   | Admin Only    |
| DELETE | /api/v1/categories/:id   | Deletes a category by its ID.       | Admin Only    |
| PATCH  | /api/v1/categories/:id   | Updates a category by its ID.       | Admin Only    |

#### Products

| Method | Endpoint                                  | Details                                     | Access        |
| ------ | ----------------------------------------- | ------------------------------------------- | ------------- |
| GET    | /api/v1/products/                         | Retrieves a list of all products.           | Public        |
| POST   | /api/v1/products/                         | Creates a new product.                      | Authenticated |
| PATCH  | /api/v1/products/add-to-wishlist/:id      | Adds a product to the user's wishlist.      | User Only     |
| PATCH  | /api/v1/products/remove-from-wishlist/:id | Removes a product from the user's wishlist. | User Only     |
| GET    | /api/v1/products/:slug                    | Retrieves a product by its slug.            | Public        |
| DELETE | /api/v1/products/:slug                    | Deletes a product by its slug.              | Authenticated |
| PATCH  | /api/v1/products/:slug                    | Updates a product by its slug.              | Authenticated |

### LINKS

[API Documentation with Postman](https://documenter.getpostman.com/view/22735243/2sAYdcsCXT) <br/>
[API URL](https://tinyurl.com/k7tssj6c)

### Contact

For questions or suggestions, feel free to reach out:

- **Name**: Md Rejoyan Islam
- **Email**: [rejoyanislam0014@gmail.com]
- **LinkedIn**: [https://www.linkedin.com/in/md-rejoyan-islam/]
- **Portfolio**: [https://md-rejoyan-islam.github.io/]
