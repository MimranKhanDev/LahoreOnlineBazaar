// backend/seeder/data.js

/**
 * 📦 SEED DATA - Sample products for database seeding
 *
 * This file contains sample products with:
 * 1. Realistic product names and descriptions
 * 2. Prices in Indian Rupees (₹)
 * 3. Cloudinary image URLs
 * 4. Categories matching your app
 *
 * 🖼️ HOW TO GET CLOUDINARY IMAGES:
 *    See the guide below!
 *
 * 📝 CATEGORIES:
 *    Laptop, Footwear, Bottom, Tops, Attire, Camera, SmartPhones, Accessories
 */

// backend/seeder/data.js

/**
 * 📦 SEED DATA - Sample products for database seeding
 *
 * This file contains 25 unique sample products with:
 * 1. Realistic product names and descriptions
 * 2. Prices in Indian Rupees (₹)
 * 3. Cloudinary image URLs (replace with your actual URLs)
 * 4. Categories matching your app
 *
 * 🖼️ HOW TO GET CLOUDINARY IMAGES:
 *    1. Upload images to Cloudinary Media Library
 *    2. Copy the "Secure URL"
 *    3. Replace the URLs below
 *
 * 📝 CATEGORIES:
 *    Laptop, Footwear, Bottom, Tops, Attire, Camera, SmartPhones, Accessories
 */

export default [
  // ============= LAPTOPS =============
  {
    name: "Apple MacBook Pro 16-inch M3 Pro - 18GB RAM, 512GB SSD",
    price: 189999,
    description:
      "The Apple MacBook Pro 16-inch with M3 Pro chip delivers exceptional performance with a 12-core CPU and 18-core GPU. The stunning Liquid Retina XDR display with ProMotion technology provides incredible brightness and contrast. With 18GB unified memory and 512GB SSD storage, this laptop handles even the most demanding professional workflows with ease. All-day battery life up to 22 hours.",
    ratings: 4.9,
    images: [
      {
        public_id: "samples/ecommerce/accessories-bag",
        url: "https://res.cloudinary.com/kwxqxaul/image/upload/v1786963696/samples/ecommerce/accessories-bag.jpg",
      },
      {
        public_id: "samples/ecommerce/accessories-bag",
        url: "https://res.cloudinary.com/kwxqxaul/image/upload/v1786963696/samples/ecommerce/accessories-bag.jpg",
      },
    ],
    category: "Laptop",
    Stock: 30,
    numOfReviews: 145,
    reviews: [],
  },
  {
    name: "ASUS ROG Zephyrus G16 - Intel Ultra 9, RTX 4070, 32GB RAM",
    price: 159999,
    description:
      "The ASUS ROG Zephyrus G16 is a gaming powerhouse featuring Intel Core Ultra 9 processor and NVIDIA GeForce RTX 4070 graphics. The 16-inch 2.5K 240Hz OLED display delivers stunning visuals. With 32GB DDR5 RAM and 1TB PCIe Gen4 SSD, experience lightning-fast load times. Advanced cooling with vapor chamber technology keeps performance optimal during intense gaming sessions.",
    ratings: 4.7,
    images: [
      {
        public_id: "samples/ecommerce/leather-bag-gray",
        url: "https://res.cloudinary.com/kwxqxaul/image/upload/v1786963696/samples/ecommerce/leather-bag-gray.jpg",
      },
      {
        public_id: "samples/ecommerce/leather-bag-gray",
        url: "https://res.cloudinary.com/kwxqxaul/image/upload/v1786963696/samples/ecommerce/leather-bag-gray.jpg",
      },
    ],
    category: "Laptop",
    Stock: 18,
    numOfReviews: 89,
    reviews: [],
  },
  {
    name: "Dell XPS 13 Plus - Intel i7-1360P, 16GB RAM, 512GB SSD",
    price: 112999,
    description:
      "The Dell XPS 13 Plus features a stunning 13.4-inch OLED display with virtually borderless design. Powered by Intel i7-1360P processor with 16GB RAM and 512GB SSD. The innovative haptic touchpad and capacitive function row create a clean, modern aesthetic. Perfect for professionals seeking ultimate portability without sacrificing performance.",
    ratings: 4.6,
    images: [
      {
        public_id: "samples/ecommerce/car-interior-design",
        url: "https://res.cloudinary.com/kwxqxaul/image/upload/v1786963696/samples/ecommerce/car-interior-design.jpg",
      },
    ],
    category: "Laptop",
    Stock: 40,
    numOfReviews: 67,
    reviews: [],
  },

  // ============= SMARTPHONES =============
  {
    name: "Samsung Galaxy S24 Ultra - 512GB, Titanium Gray",
    price: 129999,
    description:
      "The Samsung Galaxy S24 Ultra features a 6.8-inch Dynamic AMOLED 2X display with 120Hz refresh rate and Vision Booster. Powered by Snapdragon 8 Gen 3 with 12GB RAM. The quad-camera system includes a 200MP main sensor with advanced AI processing, 50MP telephoto with 5x optical zoom, and 12MP ultra-wide. The titanium frame provides premium durability and style.",
    ratings: 4.9,
    images: [
      {
        public_id: "samples/ecommerce/shoes",
        url: "https://res.cloudinary.com/kwxqxaul/image/upload/v1786963694/samples/ecommerce/shoes.png",
      },
      {
        public_id: "samples/ecommerce/shoes",
        url: "https://res.cloudinary.com/kwxqxaul/image/upload/v1786963694/samples/ecommerce/shoes.png",
      },
      {
        public_id: "samples/ecommerce/shoes",
        url: "https://res.cloudinary.com/kwxqxaul/image/upload/v1786963694/samples/ecommerce/shoes.png",
      },
    ],
    category: "SmartPhones",
    Stock: 45,
    numOfReviews: 423,
    reviews: [],
  },
  {
    name: "OnePlus 12 - 512GB, Flowy Emerald",
    price: 69999,
    description:
      "The OnePlus 12 features a 6.82-inch 2K 120Hz ProXDR display with Dolby Vision. Powered by Snapdragon 8 Gen 3 with 16GB RAM. The Hasselblad triple-camera system includes a 50MP main sensor, 64MP telephoto with 3x optical zoom, and 48MP ultra-wide. 100W wired and 50W wireless charging provides all-day battery in minutes.",
    ratings: 4.6,
    images: [
      {
        public_id: "samples/ecommerce/analog-classic",
        url: "https://res.cloudinary.com/kwxqxaul/image/upload/v1786963692/samples/ecommerce/analog-classic.jpg",
      },
    ],
    category: "SmartPhones",
    Stock: 60,
    numOfReviews: 178,
    reviews: [],
  },
  {
    name: "Google Pixel 8 Pro - 256GB, Obsidian",
    price: 89999,
    description:
      "The Google Pixel 8 Pro features a 6.7-inch Super Actua display with 120Hz refresh rate. Powered by Google Tensor G3 with 12GB RAM and Titan M2 security chip. The advanced triple-camera system includes a 50MP main sensor, 48MP telephoto with 5x optical zoom, and 48MP ultra-wide. Powered by AI, experience the best of Google with new Pixel features.",
    ratings: 4.7,
    images: [
      {
        public_id: "samples/ecommerce/analog-classic",
        url: "https://res.cloudinary.com/kwxqxaul/image/upload/v1786963692/samples/ecommerce/analog-classic.jpg",
      },
      {
        public_id: "samples/ecommerce/analog-classic",
        url: "https://res.cloudinary.com/kwxqxaul/image/upload/v1786963692/samples/ecommerce/analog-classic.jpg",
      },
    ],
    category: "SmartPhones",
    Stock: 35,
    numOfReviews: 234,
    reviews: [],
  },
];
