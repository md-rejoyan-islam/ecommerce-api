const seedProducts = [
  {
    name: "T-shirt",
    title: "Nice T-shirt",
    slug: "t-shirt",
    creator: "6643ac283233bd867ff1e434",
    description: {
      short: "Comfortable T-shirt",
      long: "Comfortable T-shirt made of cotton fabric with a round neck and short sleeves. Perfect for summer days.",
    },
    price: {
      regular: 10.0,
      sale: 8.0,
    },
    category: "6641121a44971515a9d663f3", // male
    brand: "6641122944971515a9d66402", // Nike
    tags: [
      "664111ca2b58b2527e38bb8c",
      "664111ca2b58b2527e38bb8d",
      "664111ca2b58b2527e38bb8e",
    ], // [clothing, summer, cotton]
    images: [],
    quantity: 10,
    sold: 1,
    rating: 2.5,
    shipping: {
      type: "free",
      fee: 5.0,
    },
    status: "active",
  },
  {
    name: "Shorts",
    title: "Nice Shorts",
    slug: "shorts",
    creator: "6643ac283233bd867ff1e433",
    description: {
      short: "Comfortable Shorts",
      long: "Comfortable shorts made of cotton fabric with an elastic waistband and side pockets. Perfect for summer days.",
    },
    price: {
      regular: 15.0,
      sale: 12.0,
    },
    category: "6641121a44971515a9d663f4", // female
    brand: "6641122944971515a9d66402", // Nike
    tags: [
      "664111ca2b58b2527e38bb8c",
      "664111ca2b58b2527e38bb8d",
      "664111ca2b58b2527e38bb8e",
    ], // [clothing, summer, cotton]
    images: [],
    quantity: 10,
    sold: 1,
    rating: 3.5,
    shipping: {
      type: "free",
      fee: 5.0,
    },
    status: "active",
  },
  {
    name: "Sneakers",
    title: "Nice Sneakers",
    slug: "sneakers",
    creator: "6643ac283233bd867ff1e434",
    description: {
      short: "Comfortable Sneakers",
      long: "Comfortable sneakers made of leather with a lace-up fastening and a rubber sole. Perfect for casual wear.",
    },
    price: {
      regular: 50.0,
      sale: 40.0,
    },
    category: "6641121a44971515a9d663fb", // shoes
    brand: "6641122944971515a9d66403", // Adidas
    tags: [
      "664111ca2b58b2527e38bb8a",
      "664111ca2b58b2527e38bb8b",
      "664111ca2b58b2527e38bb94",
    ], // [shoes, casual, leather]
    images: [],
    quantity: 10,
    sold: 1,
    rating: 4.5,
    shipping: {
      type: "free",
      fee: 5.0,
    },
    status: "active",
  },
  {
    name: "Sunglasses",
    title: "Nice Sunglasses",
    creator: "6643ac283233bd867ff1e433",
    slug: "sunglasses",
    description: {
      short: "Stylish Sunglasses",
      long: "Stylish sunglasses with a metal frame and tinted lenses. Perfect for sunny days.",
    },
    price: {
      regular: 20.0,
      sale: 15.0,
    },
    category: "6641121a44971515a9d663f5", // accessories
    brand: "6641122944971515a9d66404", // Ray-Ban
    tags: [
      "664111ca2b58b2527e38bb97",
      "664111ca2b58b2527e38bb98",
      "664111ca2b58b2527e38bb99",
    ], // [accessories, sunglasses, metal]
    images: [],
    quantity: 10,
    sold: 1,
    rating: 5.0,
    shipping: {
      type: "free",
      fee: 5.0,
    },
    status: "active",
  },
  {
    name: "Backpack",
    title: "Nice Backpack",
    slug: "backpack",
    creator: "6643ac283233bd867ff1e433",
    description: {
      short: "Stylish Backpack",
      long: "Stylish backpack made of canvas with adjustable shoulder straps and multiple compartments. Perfect for everyday use.",
    },
    price: {
      regular: 30.0,
      sale: 25.0,
    },
    category: "6641121a44971515a9d663f5", // accessories
    brand: "6641122944971515a9d66405", // Herschel
    tags: [
      "664111ca2b58b2527e38bb97",
      "664111ca2b58b2527e38bb95",
      "664111ca2b58b2527e38bb96",
    ], // [accessories, backpack, canvas]
    images: [],
    quantity: 10,
    sold: 1,
    rating: 4.0,
    shipping: {
      type: "free",
      fee: 5.0,
    },
    status: "active",
  },
  {
    name: "Watch",
    title: "Nice Watch",
    slug: "watch",
    creator: "6643ac283233bd867ff1e431",
    description: {
      short: "Stylish Watch",
      long: "Stylish watch with a stainless steel case and a leather strap. Perfect for everyday wear.",
    },
    price: {
      regular: 40.0,
      sale: 35.0,
    },
    brand: "6641122944971515a9d66406", // Fossil
    tags: [
      "664111ca2b58b2527e38bb97",
      "664111ca2b58b2527e38bb94",
      "664111ca2b58b2527e38bb93",
    ], // [accessories, watch, leather]
    category: "6641121a44971515a9d663f5", // accessories
    images: [],
    quantity: 10,
    sold: 1,
    rating: 4.5,
    shipping: {
      type: "free",
      fee: 5.0,
    },
    status: "active",
  },
  {
    name: "HP Laptop",
    title: "HP Laptop",
    slug: "hp-laptop",
    creator: "6643ac283233bd867ff1e431",
    description: {
      short: "HP Laptop",
      long: "HP Laptop with 8GB RAM, 256GB SSD, and Intel Core i5 processor. Perfect for work and entertainment.",
    },
    price: {
      regular: 800.0,
      sale: 750.0,
    },
    brand: "6641122944971515a9d66407", // HP
    tags: [
      "664111ca2b58b2527e38bb9e",
      "664111ca2b58b2527e38bb91",
      "664111ca2b58b2527e38bb92",
    ], // [electronics, laptop, intel]
    category: "6641121a44971515a9d663f9", // Laptops
    images: [],
    quantity: 10,
    sold: 1,
    rating: 4.0,
    shipping: {
      type: "free",
      fee: 5.0,
    },
    status: "active",
  },
  {
    name: "Apple iPhone",
    title: "Apple iPhone",
    slug: "apple-iphone",
    creator: "6643ac283233bd867ff1e434",
    description: {
      short: "Apple iPhone",
      long: "Apple iPhone with 128GB storage, 6.1-inch display, and A14 Bionic chip. Perfect for communication and entertainment.",
    },
    price: {
      regular: 1000.0,
      sale: 950.0,
    },
    brand: "6641122944971515a9d66408", // Apple
    tags: [
      "664111ca2b58b2527e38bb9e",
      "664111ca2b58b2527e38bb9c",
      "664111ca2b58b2527e38bb9d",
    ], // [electronics, smartphone, apple]
    category: "6641121a44971515a9d663f8", // Mobiles
    images: [],
    quantity: 10,
    sold: 1,
    rating: 4.5,
    shipping: {
      type: "free",
      fee: 5.0,
    },
    status: "active",
  },
  {
    name: "Samsung TV",
    title: "Samsung TV",
    slug: "samsung-tv",
    creator: "6643ac283233bd867ff1e433",
    description: {
      short: "Samsung TV",
      long: "Samsung TV with 55-inch 4K UHD display, HDR, and smart features. Perfect for watching movies and TV shows.",
    },
    price: {
      regular: 500.0,
      sale: 450.0,
    },
    brand: "6641122944971515a9d66401", // Samsung
    tags: [
      "664111ca2b58b2527e38bb9e",
      "664111ca2b58b2527e38bb9a",
      "664111ca2b58b2527e38bb9b",
    ], // [electronics, tv, samsung]
    category: "6641121a44971515a9d663f7", // Tv
    images: [],
    quantity: 10,
    sold: 1,
    rating: 5.0,
    shipping: {
      type: "free",
      fee: 5.0,
    },
    status: "active",
  },
];

export default seedProducts;
