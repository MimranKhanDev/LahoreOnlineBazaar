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
        public_id: "products/macbook_pro_m3_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/macbook_pro_m3_1.jpg",
      },
      {
        public_id: "products/macbook_pro_m3_2",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/macbook_pro_m3_2.jpg",
      },
    ],
    category: "Laptop",
    stock: 30, seller: "ShopIT",
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
        public_id: "products/asus_rog_g16_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/asus_rog_g16_1.jpg",
      },
      {
        public_id: "products/asus_rog_g16_2",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/asus_rog_g16_2.jpg",
      },
    ],
    category: "Laptop",
    stock: 18, seller: "ShopIT",
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
        public_id: "products/dell_xps13_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/dell_xps13_1.jpg",
      },
    ],
    category: "Laptop",
    stock: 40, seller: "ShopIT",
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
        public_id: "products/samsung_s24ultra_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/samsung_s24ultra_1.jpg",
      },
      {
        public_id: "products/samsung_s24ultra_2",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/samsung_s24ultra_2.jpg",
      },
      {
        public_id: "products/samsung_s24ultra_3",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/samsung_s24ultra_3.jpg",
      },
    ],
    category: "SmartPhones",
    stock: 45, seller: "ShopIT",
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
        public_id: "products/oneplus12_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/oneplus12_1.jpg",
      },
    ],
    category: "SmartPhones",
    stock: 60, seller: "ShopIT",
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
        public_id: "products/pixel8pro_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/pixel8pro_1.jpg",
      },
      {
        public_id: "products/pixel8pro_2",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/pixel8pro_2.jpg",
      },
    ],
    category: "SmartPhones",
    stock: 35, seller: "ShopIT",
    numOfReviews: 234,
    reviews: [],
  },

  // ============= CAMERAS =============
  {
    name: "Sony Alpha 7 IV - Full-Frame Mirrorless Camera with 28-70mm Lens",
    price: 189999,
    description:
      "The Sony Alpha 7 IV features a 33MP full-frame back-illuminated CMOS sensor with advanced BIONZ XR processor. Capture stunning 4K 60p video with 10-bit 4:2:2 color depth. The 5-axis in-body image stabilization ensures sharp handheld shots. Real-time Eye AF for humans, animals, and birds. The 3-inch vari-angle touchscreen makes framing easy.",
    ratings: 4.9,
    images: [
      {
        public_id: "products/sony_a7iv_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/sony_a7iv_1.jpg",
      },
      {
        public_id: "products/sony_a7iv_2",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/sony_a7iv_2.jpg",
      },
    ],
    category: "Camera",
    stock: 12, seller: "ShopIT",
    numOfReviews: 56,
    reviews: [],
  },
  {
    name: "Nikon Z8 - 45.7MP Full-Frame Mirrorless Camera Body",
    price: 289999,
    description:
      "The Nikon Z8 features a 45.7MP stacked CMOS sensor with EXPEED 7 image processor. Capture 8K 60p video and 120fps burst shooting. The advanced autofocus system with deep learning technology tracks subjects with precision. In-body image stabilization provides up to 6 stops of shake compensation. A professional's dream camera.",
    ratings: 4.8,
    images: [
      {
        public_id: "products/nikon_z8_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/nikon_z8_1.jpg",
      },
      {
        public_id: "products/nikon_z8_2",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/nikon_z8_2.jpg",
      },
    ],
    category: "Camera",
    stock: 8, seller: "ShopIT",
    numOfReviews: 34,
    reviews: [],
  },
  {
    name: "Canon EOS R8 - 24.2MP Full-Frame Mirrorless Camera with RF 24-50mm",
    price: 119999,
    description:
      "The Canon EOS R8 features a 24.2MP full-frame CMOS sensor with DIGIC X processor. Capture 4K 60p video with oversampling and advanced Canon Log 3. The Dual Pixel CMOS AF II provides fast and accurate subject tracking. Lightweight and compact design makes it perfect for travel photography.",
    ratings: 4.5,
    images: [
      {
        public_id: "products/canon_r8_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/canon_r8_1.jpg",
      },
    ],
    category: "Camera",
    stock: 20, seller: "ShopIT",
    numOfReviews: 45,
    reviews: [],
  },

  // ============= FOOTWEAR =============
  {
    name: "Puma RS-X Galaxy - Men's Sneakers - Black/White",
    price: 7999,
    description:
      "The Puma RS-X Galaxy features a chunky silhouette with retro design elements. The combination of mesh, leather, and synthetic materials creates a premium look. The RS (Running System) foam provides excellent cushioning and comfort. Perfect for street style and casual wear.",
    ratings: 4.3,
    images: [
      {
        public_id: "products/puma_rsx_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/puma_rsx_1.jpg",
      },
    ],
    category: "Footwear",
    stock: 100, seller: "ShopIT",
    numOfReviews: 89,
    reviews: [],
  },
  {
    name: "New Balance 574 - Classic Sneakers - Grey/Navy",
    price: 6999,
    description:
      "The New Balance 574 is a timeless classic that combines style and comfort. The ENCAP midsole provides superior support and durability. Suede and mesh upper ensures breathability and a premium look. Versatile design pairs well with any outfit, from casual to semi-formal.",
    ratings: 4.4,
    images: [
      {
        public_id: "products/nb574_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/nb574_1.jpg",
      },
      {
        public_id: "products/nb574_2",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/nb574_2.jpg",
      },
    ],
    category: "Footwear",
    stock: 150, seller: "ShopIT",
    numOfReviews: 123,
    reviews: [],
  },
  {
    name: "Adidas Ultraboost Light - Men's Running Shoes - Core Black",
    price: 14999,
    description:
      "The Adidas Ultraboost Light features the lightest BOOST foam ever created. The responsive cushioning provides energy return with every step. Continental Rubber outsole ensures excellent traction on any surface. The Primeknit upper offers adaptive support and breathability.",
    ratings: 4.8,
    images: [
      {
        public_id: "products/adidas_ultraboost_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/adidas_ultraboost_1.jpg",
      },
      {
        public_id: "products/adidas_ultraboost_2",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/adidas_ultraboost_2.jpg",
      },
    ],
    category: "Footwear",
    stock: 80, seller: "ShopIT",
    numOfReviews: 234,
    reviews: [],
  },

  // ============= TOPS =============
  {
    name: "US Polo Assn. Men's Polo T-Shirt - Classic Fit - Navy Blue",
    price: 1499,
    description:
      "The US Polo Assn. Polo T-Shirt features a classic fit with the iconic polo logo. Made from premium cotton pique fabric for comfort and durability. The two-button placket and ribbed collar provide a timeless look. Perfect for casual and semi-formal occasions.",
    ratings: 4.2,
    images: [
      {
        public_id: "products/uspolo_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/uspolo_1.jpg",
      },
    ],
    category: "Tops",
    stock: 250, seller: "ShopIT",
    numOfReviews: 167,
    reviews: [],
  },
  {
    name: "H&M Men's Linen Blend Shirt - Relaxed Fit - White",
    price: 2499,
    description:
      "The H&M Linen Blend Shirt offers a relaxed fit with premium linen-cotton blend fabric. Breathable and lightweight, perfect for summer wear. The classic button-down design with chest pocket provides a sophisticated yet casual look. Versatile enough for office or weekend wear.",
    ratings: 4.0,
    images: [
      {
        public_id: "products/hm_linen_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/hm_linen_1.jpg",
      },
    ],
    category: "Tops",
    stock: 180, seller: "ShopIT",
    numOfReviews: 78,
    reviews: [],
  },
  {
    name: "Peter England Men's Casual Shirt - Slim Fit - Light Blue",
    price: 899,
    description:
      "The Peter England Casual Shirt features a modern slim fit with lightweight cotton fabric. The subtle checkered pattern adds style without being too bold. Perfect for casual outings and everyday wear. Easy to pair with jeans or chinos.",
    ratings: 3.9,
    images: [
      {
        public_id: "products/peterengland_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/peterengland_1.jpg",
      },
    ],
    category: "Tops",
    stock: 300, seller: "ShopIT",
    numOfReviews: 56,
    reviews: [],
  },

  // ============= BOTTOM =============
  {
    name: "Levi's 512 Slim Taper Jeans - Black Stretch Denim",
    price: 3999,
    description:
      "The Levi's 512 Slim Taper Jeans offer a modern fit that's slim through the thigh and tapers at the ankle. Made with stretch denim for maximum comfort and mobility. The black color is versatile and easy to pair with any top. Classic Levi's quality and style.",
    ratings: 4.4,
    images: [
      {
        public_id: "products/levis512_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/levis512_1.jpg",
      },
    ],
    category: "Bottom",
    stock: 120, seller: "ShopIT",
    numOfReviews: 89,
    reviews: [],
  },
  {
    name: "US Polo Assn. Men's Chino Shorts - Flat Front - Beige",
    price: 1999,
    description:
      "The US Polo Assn. Chino Shorts feature a classic flat-front design with premium cotton fabric. Perfect for summer outings and casual events. The beige color pairs well with polo shirts and casual tops. Comfortable and stylish for any occasion.",
    ratings: 4.1,
    images: [
      {
        public_id: "products/uspolo_chino_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/uspolo_chino_1.jpg",
      },
    ],
    category: "Bottom",
    stock: 100, seller: "ShopIT",
    numOfReviews: 45,
    reviews: [],
  },
  {
    name: "John Players Men's Formal Trousers - Slim Fit - Charcoal",
    price: 2999,
    description:
      "The John Players Formal Trousers feature a modern slim fit with premium wool-blend fabric. Perfect for office wear and formal occasions. The charcoal color is professional and versatile. Excellent drape and wrinkle resistance.",
    ratings: 4.3,
    images: [
      {
        public_id: "products/johnplayers_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/johnplayers_1.jpg",
      },
    ],
    category: "Bottom",
    stock: 90, seller: "ShopIT",
    numOfReviews: 67,
    reviews: [],
  },

  // ============= ATTIRE =============
  {
    name: "Raymond Men's Slim Fit Suit - Navy Blue - 2 Piece",
    price: 19999,
    description:
      "The Raymond Men's Suit features a modern slim fit with premium wool-blend fabric. The two-piece set includes a single-breasted jacket with notch lapel and matching trousers. Perfect for weddings, parties, and formal events. Classic navy blue color is always in style.",
    ratings: 4.7,
    images: [
      {
        public_id: "products/raymond_suit_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/raymond_suit_1.jpg",
      },
    ],
    category: "Attire",
    stock: 25, seller: "ShopIT",
    numOfReviews: 34,
    reviews: [],
  },
  {
    name: "Allen Solly Men's Blazer - Single Breasted - Black",
    price: 8999,
    description:
      "The Allen Solly Blazer features a sophisticated single-breasted design with premium fabric. Perfect for both formal and semi-formal occasions. The black color ensures versatility and elegance. Excellent fit with subtle shoulder padding for a polished look.",
    ratings: 4.5,
    images: [
      {
        public_id: "products/allen_solly_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/allen_solly_1.jpg",
      },
    ],
    category: "Attire",
    stock: 30, seller: "ShopIT",
    numOfReviews: 56,
    reviews: [],
  },
  {
    name: "Van Heusen Men's Waistcoat - Formal Vest - Grey",
    price: 3999,
    description:
      "The Van Heusen Waistcoat adds sophistication to any formal outfit. Made from premium fabric with a perfect fit. The grey color is versatile and pairs well with suits and trousers. Ideal for weddings, parties, and formal events.",
    ratings: 4.2,
    images: [
      {
        public_id: "products/van_heusen_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/van_heusen_1.jpg",
      },
    ],
    category: "Attire",
    stock: 50, seller: "ShopIT",
    numOfReviews: 23,
    reviews: [],
  },

  // ============= ACCESSORIES =============
  {
    name: "Bose QuietComfort Ultra Headphones - Noise Cancelling - Black",
    price: 32999,
    description:
      "The Bose QuietComfort Ultra headphones feature world-class noise cancellation with CustomTune technology. Immersive audio with spatial audio support for a cinematic listening experience. Premium materials with plush ear cushions for all-day comfort. Up to 24 hours of battery life.",
    ratings: 4.8,
    images: [
      {
        public_id: "products/bose_qc_ultra_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/bose_qc_ultra_1.jpg",
      },
      {
        public_id: "products/bose_qc_ultra_2",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/bose_qc_ultra_2.jpg",
      },
    ],
    category: "Accessories",
    stock: 60, seller: "ShopIT",
    numOfReviews: 189,
    reviews: [],
  },
  {
    name: "Apple AirPods Pro 2 - USB-C - Active Noise Cancellation",
    price: 24999,
    description:
      "The Apple AirPods Pro 2 features advanced Active Noise Cancellation with Adaptive Transparency. The H2 chip delivers superior sound quality and longer battery life. Personalized Spatial Audio creates an immersive listening experience. USB-C charging and sweat-resistant design.",
    ratings: 4.7,
    images: [
      {
        public_id: "products/airpodspro2_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/airpodspro2_1.jpg",
      },
      {
        public_id: "products/airpodspro2_2",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/airpodspro2_2.jpg",
      },
    ],
    category: "Accessories",
    stock: 120, seller: "ShopIT",
    numOfReviews: 567,
    reviews: [],
  },
  {
    name: "Samsung Galaxy Watch 6 Classic - 47mm - Silver",
    price: 39999,
    description:
      "The Samsung Galaxy Watch 6 Classic features a sophisticated rotating bezel and premium stainless steel design. Advanced health tracking includes ECG, blood pressure monitoring, and sleep tracking. The 1.5-inch Super AMOLED display provides crisp visuals. Wear OS powers a seamless smartwatch experience.",
    ratings: 4.6,
    images: [
      {
        public_id: "products/galaxywatch6_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/galaxywatch6_1.jpg",
      },
    ],
    category: "Accessories",
    stock: 45, seller: "ShopIT",
    numOfReviews: 123,
    reviews: [],
  },

  // ============= ADDITIONAL ITEMS =============
  {
    name: "Dyson V15 Detect - Cordless Vacuum Cleaner - Laser",
    price: 54999,
    description:
      "The Dyson V15 Detect features a laser illumination system that reveals microscopic dust. The powerful Hyperdymium motor delivers unmatched suction power. The piezo sensor measures and displays particle count for smarter cleaning. Up to 60 minutes of fade-free run time.",
    ratings: 4.8,
    images: [
      {
        public_id: "products/dyson_v15_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/dyson_v15_1.jpg",
      },
    ],
    category: "Accessories",
    stock: 20, seller: "ShopIT",
    numOfReviews: 45,
    reviews: [],
  },
  {
    name: "Instant Pot Duo Plus - 9-in-1 Pressure Cooker - 6 Quart",
    price: 9999,
    description:
      "The Instant Pot Duo Plus is a 9-in-1 multi-cooker that combines pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, warmer, sterilizer, and sous vide. The upgraded display features a progress indicator and cooking automation. Perfect for quick and healthy meals.",
    ratings: 4.5,
    images: [
      {
        public_id: "products/instantpot_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/instantpot_1.jpg",
      },
    ],
    category: "Accessories",
    stock: 35, seller: "ShopIT",
    numOfReviews: 89,
    reviews: [],
  },
  {
    name: "Fitbit Charge 6 - Fitness Tracker - Black",
    price: 13999,
    description:
      "The Fitbit Charge 6 features advanced health tracking with Daily Readiness Score. Built-in GPS tracks outdoor activities without your phone. Smart features include Google Wallet and YouTube Music controls. Heart rate tracking and sleep monitoring with detailed analytics.",
    ratings: 4.3,
    images: [
      {
        public_id: "products/fitbit_charge6_1",
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/products/fitbit_charge6_1.jpg",
      },
    ],
    category: "Accessories",
    stock: 75, seller: "ShopIT",
    seller: "ShopIT",
    numOfReviews: 167,
    reviews: [],
  },
];
