import { PrismaClient, Gender, ProductStatus, ImageType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...\n");

  // ─── Clean existing data ─────────────────────────────────
  await prisma.comparisonProduct.deleteMany();
  await prisma.comparison.deleteMany();
  await prisma.recentlyViewed.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data.\n");

  // ─── Users ────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Admin@123", 12);
  const userPassword = await bcrypt.hash("User@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@delhishoepalace.com" },
    update: {
      name: "Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      name: "Admin",
      email: "admin@delhishoepalace.com",
      password: hashedPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  const users = await Promise.all(
    [
      { name: "Rahul Sharma", email: "rahul@example.com" },
      { name: "Priya Gupta", email: "priya@example.com" },
      { name: "Amit Verma", email: "amit@example.com" },
      { name: "Sneha Patel", email: "sneha@example.com" },
      { name: "Vikram Singh", email: "vikram@example.com" },
    ].map((u) =>
      prisma.user.create({
        data: {
          ...u,
          password: userPassword,
          role: Role.USER,
          emailVerified: new Date(),
        },
      })
    )
  );

  console.log(`Created ${users.length + 1} users (1 admin + ${users.length} regular).\n`);

  // ─── Brands ───────────────────────────────────────────────
  const brandsData = [
    { name: "Nike", slug: "nike", description: "World-renowned sportswear brand known for innovative athletic footwear and the iconic swoosh logo." },
    { name: "Adidas", slug: "adidas", description: "Global sportswear giant with the signature three stripes, blending performance and lifestyle." },
    { name: "Puma", slug: "puma", description: "German multinational known for athletic and casual footwear with a modern edge." },
    { name: "Bata", slug: "bata", description: "India's most trusted footwear brand with over a century of heritage in quality shoes." },
    { name: "Skechers", slug: "skechers", description: "American footwear company famous for comfort technology and lifestyle sneakers." },
    { name: "Red Tape", slug: "red-tape", description: "Premium Indian brand known for high-quality leather shoes and modern casual footwear." },
    { name: "Liberty", slug: "liberty", description: "One of India's largest footwear manufacturers with a wide range for every occasion." },
    { name: "Woodland", slug: "woodland", description: "Adventure and outdoor footwear brand known for rugged durability and nature-inspired design." },
    { name: "Sparx", slug: "sparx", description: "Affordable and stylish footwear brand offering sports, casual, and everyday shoes." },
    { name: "VKC", slug: "vkc", description: "South Indian footwear brand known for comfortable and value-for-money sandals and slippers." },
  ];

  const brands: Record<string, string> = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.create({ data: b });
    brands[b.slug] = brand.id;
  }

  console.log(`Created ${brandsData.length} brands.\n`);

  // ─── Categories & Subcategories ───────────────────────────
  const categoriesData = [
    {
      name: "Men",
      slug: "men",
      gender: Gender.MEN,
      image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80",
      subcategories: [
        { name: "Sports", slug: "men-sports" },
        { name: "Casual", slug: "men-casual" },
        { name: "Formal", slug: "men-formal" },
        { name: "Boots", slug: "men-boots" },
        { name: "Sandals", slug: "men-sandals" },
        { name: "Slippers", slug: "men-slippers" },
      ],
    },
    {
      name: "Women",
      slug: "women",
      gender: Gender.WOMEN,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
      subcategories: [
        { name: "Sports", slug: "women-sports" },
        { name: "Casual", slug: "women-casual" },
        { name: "Fancy", slug: "women-fancy" },
        { name: "Heels", slug: "women-heels" },
        { name: "Boots", slug: "women-boots" },
        { name: "Sandals", slug: "women-sandals" },
        { name: "Slippers", slug: "women-slippers" },
      ],
    },
    {
      name: "Kids",
      slug: "kids",
      gender: Gender.KIDS,
      image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80",
      subcategories: [
        { name: "School Shoes", slug: "kids-school" },
        { name: "Sports", slug: "kids-sports" },
        { name: "Casual", slug: "kids-casual" },
        { name: "Sandals", slug: "kids-sandals" },
        { name: "Slippers", slug: "kids-slippers" },
      ],
    },
  ];

  const categories: Record<string, string> = {};
  const subcategories: Record<string, string> = {};

  for (const cat of categoriesData) {
    const { subcategories: subs, ...catData } = cat;
    const category = await prisma.category.create({ data: catData });
    categories[cat.slug] = category.id;

    for (const sub of subs) {
      const subcategory = await prisma.subcategory.create({
        data: { ...sub, categoryId: category.id },
      });
      subcategories[sub.slug] = subcategory.id;
    }
  }

  console.log(`Created ${categoriesData.length} categories with subcategories.\n`);

  // ─── Products ─────────────────────────────────────────────
  const shoeImages = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80",
  ];

  const lifestyleImages = [
    "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
    "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80",
    "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
  ];

  const productsData = [
    // ── Men Sports ──
    { name: "Nike Air Max 270 Running Shoe", slug: "nike-air-max-270", price: 8999, brand: "nike", cat: "men", sub: "men-sports", gender: Gender.MEN, status: ProductStatus.TRENDING, isFeatured: true, material: "Mesh & Synthetic", colors: [{ name: "Black", hexCode: "#000000" }, { name: "White", hexCode: "#FFFFFF" }], sizes: ["7", "8", "9", "10", "11"], desc: "Experience ultimate comfort with the Nike Air Max 270, featuring the tallest Air unit yet for a soft, bouncy ride. Lightweight mesh upper provides breathability for all-day wear." },
    { name: "Adidas Ultraboost 22", slug: "adidas-ultraboost-22", price: 9499, brand: "adidas", cat: "men", sub: "men-sports", gender: Gender.MEN, status: ProductStatus.NEW_ARRIVAL, isFeatured: true, material: "Primeknit", colors: [{ name: "Core Black", hexCode: "#1A1A1A" }, { name: "Cloud White", hexCode: "#F5F5F5" }], sizes: ["7", "8", "9", "10"], desc: "The Adidas Ultraboost 22 redefines running comfort with responsive BOOST midsole cushioning and a Primeknit upper that adapts to the shape of your foot." },
    { name: "Puma RS-X Reinvention", slug: "puma-rs-x-reinvention", price: 6999, brand: "puma", cat: "men", sub: "men-sports", gender: Gender.MEN, status: ProductStatus.AVAILABLE, isFeatured: true, material: "Mesh & Leather", colors: [{ name: "Blue", hexCode: "#1E40AF" }, { name: "Red", hexCode: "#DC2626" }], sizes: ["7", "8", "9", "10", "11"], desc: "Bold, chunky, and unapologetically retro. The Puma RS-X Reinvention brings back the classic running system with modern materials and a fresh silhouette." },
    { name: "Sparx SM-612 Running Shoe", slug: "sparx-sm-612", price: 1299, brand: "sparx", cat: "men", sub: "men-sports", gender: Gender.MEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Synthetic Mesh", colors: [{ name: "Grey", hexCode: "#6B7280" }, { name: "Navy", hexCode: "#1E3A5F" }], sizes: ["6", "7", "8", "9", "10"], desc: "Affordable everyday running shoes with cushioned insole and durable outsole. Perfect for morning jogs and casual sports." },

    // ── Men Casual ──
    { name: "Skechers Go Walk 6", slug: "skechers-go-walk-6", price: 4999, brand: "skechers", cat: "men", sub: "men-casual", gender: Gender.MEN, status: ProductStatus.TRENDING, isFeatured: true, material: "Engineered Mesh", colors: [{ name: "Navy", hexCode: "#1E3A5F" }, { name: "Black", hexCode: "#000000" }], sizes: ["7", "8", "9", "10", "11"], desc: "Walk in cloud-like comfort. The Go Walk 6 features Skechers' Hyper Pillar Technology for responsive cushioning with every step." },
    { name: "Red Tape Athleisure Sneaker", slug: "red-tape-athleisure", price: 2499, brand: "red-tape", cat: "men", sub: "men-casual", gender: Gender.MEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "PU & Mesh", colors: [{ name: "White", hexCode: "#FFFFFF" }, { name: "Olive", hexCode: "#556B2F" }], sizes: ["7", "8", "9", "10"], desc: "Clean lines and versatile design meet everyday comfort. These athleisure sneakers transition seamlessly from workspace to weekend." },

    // ── Men Formal ──
    { name: "Red Tape Classic Oxford", slug: "red-tape-classic-oxford", price: 3499, brand: "red-tape", cat: "men", sub: "men-formal", gender: Gender.MEN, status: ProductStatus.AVAILABLE, isFeatured: true, material: "Genuine Leather", colors: [{ name: "Brown", hexCode: "#8B4513" }, { name: "Black", hexCode: "#000000" }], sizes: ["7", "8", "9", "10", "11"], desc: "Timeless Oxford craftsmanship in genuine leather. Lace-up design with a polished finish for boardrooms and formal occasions." },
    { name: "Liberty Fortune Derby", slug: "liberty-fortune-derby", price: 2999, brand: "liberty", cat: "men", sub: "men-formal", gender: Gender.MEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Leather", colors: [{ name: "Tan", hexCode: "#D2691E" }, { name: "Black", hexCode: "#000000" }], sizes: ["6", "7", "8", "9", "10"], desc: "Classic derby style with cushioned insole for all-day formal comfort. Trusted Liberty craftsmanship meets modern elegance." },

    // ── Men Boots ──
    { name: "Woodland Classic Adventure Boot", slug: "woodland-adventure-boot", price: 5499, brand: "woodland", cat: "men", sub: "men-boots", gender: Gender.MEN, status: ProductStatus.TRENDING, isFeatured: true, material: "Nubuck Leather", colors: [{ name: "Camel", hexCode: "#C19A6B" }, { name: "Dark Brown", hexCode: "#654321" }], sizes: ["7", "8", "9", "10", "11"], desc: "Built for the trail, styled for the city. These rugged nubuck leather boots offer ankle support, water resistance, and all-terrain grip." },

    // ── Men Sandals ──
    { name: "Bata Comfit Open Sandal", slug: "bata-comfit-sandal", price: 1499, brand: "bata", cat: "men", sub: "men-sandals", gender: Gender.MEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Synthetic Leather", colors: [{ name: "Brown", hexCode: "#8B4513" }, { name: "Black", hexCode: "#000000" }], sizes: ["6", "7", "8", "9", "10"], desc: "Lightweight open sandals with adjustable straps and cushioned footbed. Ideal for everyday casual wear in warm weather." },

    // ── Men Slippers ──
    { name: "VKC Pride Slipper", slug: "vkc-pride-slipper", price: 299, brand: "vkc", cat: "men", sub: "men-slippers", gender: Gender.MEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "EVA", colors: [{ name: "Blue", hexCode: "#1E40AF" }, { name: "Black", hexCode: "#000000" }], sizes: ["6", "7", "8", "9", "10"], desc: "Lightweight, water-resistant EVA slippers for daily use. Ultra-affordable comfort that lasts." },
    { name: "Sparx SFG-2086 Slide", slug: "sparx-sfg-2086", price: 499, brand: "sparx", cat: "men", sub: "men-slippers", gender: Gender.MEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Synthetic", colors: [{ name: "Black", hexCode: "#000000" }, { name: "Grey", hexCode: "#6B7280" }], sizes: ["6", "7", "8", "9", "10", "11"], desc: "Modern slide design with textured footbed for grip and comfort. Perfect for poolside and casual outings." },

    // ── Women Sports ──
    { name: "Nike Revolution 6 Women", slug: "nike-revolution-6-women", price: 4499, brand: "nike", cat: "women", sub: "women-sports", gender: Gender.WOMEN, status: ProductStatus.NEW_ARRIVAL, isFeatured: true, material: "Lightweight Mesh", colors: [{ name: "Pink", hexCode: "#EC4899" }, { name: "Black", hexCode: "#000000" }], sizes: ["4", "5", "6", "7", "8"], desc: "Lightweight and responsive, the Revolution 6 delivers a smooth ride for daily runs and fitness routines with its foam midsole." },
    { name: "Adidas Runfalcon 3.0 Women", slug: "adidas-runfalcon-3-women", price: 3999, brand: "adidas", cat: "women", sub: "women-sports", gender: Gender.WOMEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Textile & Synthetic", colors: [{ name: "White/Purple", hexCode: "#9333EA" }, { name: "Grey", hexCode: "#9CA3AF" }], sizes: ["4", "5", "6", "7", "8"], desc: "Run with confidence in the Adidas Runfalcon 3.0. Cloudfoam cushioning meets a breathable upper for lightweight daily performance." },
    { name: "Puma Softride Sophia Women", slug: "puma-softride-sophia", price: 5499, brand: "puma", cat: "women", sub: "women-sports", gender: Gender.WOMEN, status: ProductStatus.TRENDING, isFeatured: true, material: "Mesh", colors: [{ name: "Lavender", hexCode: "#C4B5FD" }, { name: "White", hexCode: "#FFFFFF" }], sizes: ["4", "5", "6", "7"], desc: "Supreme softness meets sporty style. SoftRide foam technology provides exceptional cushioning for training and casual wear." },

    // ── Women Casual ──
    { name: "Skechers D'Lites Women", slug: "skechers-dlites-women", price: 5999, brand: "skechers", cat: "women", sub: "women-casual", gender: Gender.WOMEN, status: ProductStatus.AVAILABLE, isFeatured: true, material: "Leather & Synthetic", colors: [{ name: "White/Silver", hexCode: "#C0C0C0" }, { name: "Black/Pink", hexCode: "#000000" }], sizes: ["4", "5", "6", "7", "8"], desc: "The iconic D'Lites chunky sneaker with Air-Cooled Memory Foam insole. A fashion statement that never compromises on comfort." },

    // ── Women Fancy ──
    { name: "Bata Red Label Embellished Flat", slug: "bata-embellished-flat", price: 1999, brand: "bata", cat: "women", sub: "women-fancy", gender: Gender.WOMEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Synthetic with Embellishments", colors: [{ name: "Gold", hexCode: "#FFD700" }, { name: "Rose", hexCode: "#FB7185" }], sizes: ["4", "5", "6", "7"], desc: "Delicate embellishments on a cushioned flat for festive occasions and celebrations. Sparkle without sacrificing comfort." },

    // ── Women Heels ──
    { name: "Liberty Senorita Block Heel", slug: "liberty-senorita-heel", price: 2499, brand: "liberty", cat: "women", sub: "women-heels", gender: Gender.WOMEN, status: ProductStatus.NEW_ARRIVAL, isFeatured: true, material: "Synthetic Patent", colors: [{ name: "Black", hexCode: "#000000" }, { name: "Nude", hexCode: "#E8C39E" }], sizes: ["4", "5", "6", "7"], desc: "Elegant block heels with a stable 3-inch lift. Patent finish adds a polished touch to any outfit, from office to evening." },

    // ── Women Boots ──
    { name: "Woodland Women Chelsea Boot", slug: "woodland-women-chelsea", price: 4999, brand: "woodland", cat: "women", sub: "women-boots", gender: Gender.WOMEN, status: ProductStatus.LIMITED, isFeatured: false, material: "Genuine Leather", colors: [{ name: "Burgundy", hexCode: "#800020" }, { name: "Black", hexCode: "#000000" }], sizes: ["4", "5", "6", "7"], desc: "Classic Chelsea boot silhouette in premium leather with elastic side panels. Durable yet refined for autumn and winter styling." },

    // ── Women Sandals ──
    { name: "Bata Comfit Women Sandal", slug: "bata-comfit-women-sandal", price: 1299, brand: "bata", cat: "women", sub: "women-sandals", gender: Gender.WOMEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Synthetic", colors: [{ name: "Tan", hexCode: "#D2691E" }, { name: "Black", hexCode: "#000000" }], sizes: ["4", "5", "6", "7", "8"], desc: "Comfortable daily-wear sandals with adjustable straps and cushioned footbed. Designed for the Indian climate." },

    // ── Women Slippers ──
    { name: "VKC Women House Slipper", slug: "vkc-women-house-slipper", price: 249, brand: "vkc", cat: "women", sub: "women-slippers", gender: Gender.WOMEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Rubber", colors: [{ name: "Pink", hexCode: "#EC4899" }, { name: "Blue", hexCode: "#60A5FA" }], sizes: ["4", "5", "6", "7"], desc: "Soft and lightweight indoor slippers at an unbeatable price. Water-resistant and easy to clean." },

    // ── Kids School ──
    { name: "Bata Black School Shoe", slug: "bata-school-shoe", price: 999, brand: "bata", cat: "kids", sub: "kids-school", gender: Gender.KIDS, status: ProductStatus.AVAILABLE, isFeatured: true, material: "Synthetic Leather", colors: [{ name: "Black", hexCode: "#000000" }], sizes: ["1", "2", "3", "4", "5"], desc: "The classic Indian school shoe. Durable, polished, and ready for every school day. Trusted by millions of parents nationwide." },
    { name: "Liberty Prefect School Shoe", slug: "liberty-prefect-school", price: 899, brand: "liberty", cat: "kids", sub: "kids-school", gender: Gender.KIDS, status: ProductStatus.AVAILABLE, isFeatured: false, material: "PU", colors: [{ name: "Black", hexCode: "#000000" }], sizes: ["1", "2", "3", "4", "5"], desc: "Lightweight school shoes with velcro closure for easy on-off. Non-marking sole approved for school use." },

    // ── Kids Sports ──
    { name: "Nike Star Runner 3 Kids", slug: "nike-star-runner-3-kids", price: 3499, brand: "nike", cat: "kids", sub: "kids-sports", gender: Gender.KIDS, status: ProductStatus.TRENDING, isFeatured: true, material: "Mesh", colors: [{ name: "Blue", hexCode: "#3B82F6" }, { name: "Red", hexCode: "#EF4444" }], sizes: ["1", "2", "3", "4", "5"], desc: "Designed for young athletes, the Star Runner 3 features a flexible outsole and cushioned midsole for playground adventures." },
    { name: "Adidas Tensaur Run 2.0 Kids", slug: "adidas-tensaur-kids", price: 2999, brand: "adidas", cat: "kids", sub: "kids-sports", gender: Gender.KIDS, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Synthetic & Textile", colors: [{ name: "White/Green", hexCode: "#22C55E" }, { name: "Black/Orange", hexCode: "#F97316" }], sizes: ["1", "2", "3", "4", "5"], desc: "Sporty running shoes for active kids. Hook-and-loop closure makes it easy for children to put on by themselves." },

    // ── Kids Casual ──
    { name: "Sparx Kids Casual Sneaker", slug: "sparx-kids-casual", price: 899, brand: "sparx", cat: "kids", sub: "kids-casual", gender: Gender.KIDS, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Canvas", colors: [{ name: "White", hexCode: "#FFFFFF" }, { name: "Navy", hexCode: "#1E3A5F" }], sizes: ["1", "2", "3", "4"], desc: "Fun and colorful canvas sneakers for everyday play. Lightweight and easy to maintain." },

    // ── Kids Sandals ──
    { name: "Bata Kids Adventure Sandal", slug: "bata-kids-adventure-sandal", price: 799, brand: "bata", cat: "kids", sub: "kids-sandals", gender: Gender.KIDS, status: ProductStatus.NEW_ARRIVAL, isFeatured: false, material: "Synthetic", colors: [{ name: "Blue/Grey", hexCode: "#64748B" }, { name: "Brown", hexCode: "#92400E" }], sizes: ["1", "2", "3", "4", "5"], desc: "Sturdy sandals with toe protection for outdoor play. Adjustable velcro straps ensure a secure fit." },

    // ── Kids Slippers ──
    { name: "VKC Kids Flip Flop", slug: "vkc-kids-flip-flop", price: 199, brand: "vkc", cat: "kids", sub: "kids-slippers", gender: Gender.KIDS, status: ProductStatus.AVAILABLE, isFeatured: false, material: "EVA", colors: [{ name: "Red", hexCode: "#EF4444" }, { name: "Yellow", hexCode: "#EAB308" }], sizes: ["1", "2", "3", "4"], desc: "Bright and fun flip flops for kids. Soft EVA material is gentle on young feet." },

    // ── Additional Men Products ──
    { name: "Nike Court Vision Low", slug: "nike-court-vision-low", price: 5499, brand: "nike", cat: "men", sub: "men-casual", gender: Gender.MEN, status: ProductStatus.NEW_ARRIVAL, isFeatured: true, material: "Leather", colors: [{ name: "White", hexCode: "#FFFFFF" }, { name: "Black/White", hexCode: "#1A1A1A" }], sizes: ["7", "8", "9", "10", "11"], desc: "Classic basketball-inspired sneakers with a clean, versatile look. Premium leather upper with stitched overlays." },
    { name: "Adidas Grand Court Base 2", slug: "adidas-grand-court-base-2", price: 3999, brand: "adidas", cat: "men", sub: "men-casual", gender: Gender.MEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Synthetic Leather", colors: [{ name: "White/Green", hexCode: "#166534" }, { name: "White/Navy", hexCode: "#1E3A5F" }], sizes: ["7", "8", "9", "10"], desc: "Tennis-inspired design with the signature three stripes. Cloudfoam Comfort sockliner for a luxurious step-in feel." },
    { name: "Woodland Leather Loafer", slug: "woodland-leather-loafer", price: 4499, brand: "woodland", cat: "men", sub: "men-casual", gender: Gender.MEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Genuine Leather", colors: [{ name: "Brown", hexCode: "#8B4513" }, { name: "Olive", hexCode: "#556B2F" }], sizes: ["7", "8", "9", "10", "11"], desc: "Premium leather loafers with hand-stitched detailing. Memory foam insole provides lasting comfort through your day." },

    // ── Additional Women Products ──
    { name: "Nike Air Force 1 Women", slug: "nike-air-force-1-women", price: 7999, brand: "nike", cat: "women", sub: "women-casual", gender: Gender.WOMEN, status: ProductStatus.TRENDING, isFeatured: true, material: "Leather", colors: [{ name: "White", hexCode: "#FFFFFF" }, { name: "Pale Ivory", hexCode: "#FFFDD0" }], sizes: ["4", "5", "6", "7", "8"], desc: "The icon returns. Classic Air Force 1 silhouette with premium leather and the legendary Air cushioning unit." },
    { name: "Adidas Cloudfoam Pure 2.0 Women", slug: "adidas-cloudfoam-pure-women", price: 4499, brand: "adidas", cat: "women", sub: "women-casual", gender: Gender.WOMEN, status: ProductStatus.AVAILABLE, isFeatured: false, material: "Mesh & Textile", colors: [{ name: "White", hexCode: "#FFFFFF" }, { name: "Grey/Pink", hexCode: "#F9A8D4" }], sizes: ["4", "5", "6", "7"], desc: "Slip-on comfort with Cloudfoam cushioning for a plush, pillow-soft feel. Stretchy knit upper hugs your foot." },
    { name: "Red Tape Women Sneaker", slug: "red-tape-women-sneaker", price: 2299, brand: "red-tape", cat: "women", sub: "women-casual", gender: Gender.WOMEN, status: ProductStatus.LIMITED, isFeatured: false, material: "Mesh & Synthetic", colors: [{ name: "White/Pink", hexCode: "#FBCFE8" }, { name: "Beige", hexCode: "#D2B48C" }], sizes: ["4", "5", "6", "7"], desc: "Minimalist design with maximum style. These lightweight sneakers pair perfectly with any casual outfit." },

    // ── Additional Kids Products ──
    { name: "Puma Smash v2 Kids", slug: "puma-smash-v2-kids", price: 2499, brand: "puma", cat: "kids", sub: "kids-casual", gender: Gender.KIDS, status: ProductStatus.AVAILABLE, isFeatured: true, material: "Leather", colors: [{ name: "White/Black", hexCode: "#000000" }, { name: "White/Blue", hexCode: "#2563EB" }], sizes: ["1", "2", "3", "4", "5"], desc: "Clean and sporty court-style sneaker for kids. Leather upper for durability with rubber outsole for playground grip." },
    { name: "Skechers S-Lights Kids", slug: "skechers-s-lights-kids", price: 3499, brand: "skechers", cat: "kids", sub: "kids-casual", gender: Gender.KIDS, status: ProductStatus.NEW_ARRIVAL, isFeatured: true, material: "Synthetic & Mesh", colors: [{ name: "Multi", hexCode: "#8B5CF6" }], sizes: ["1", "2", "3", "4"], desc: "Light-up sneakers that kids love! Built-in LED lights in the outsole with multiple color modes. Memory foam insole." },
  ];

  let productCount = 0;
  for (const p of productsData) {
    const imgIndex = productCount % shoeImages.length;
    const lifestyleIndex = productCount % lifestyleImages.length;

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.desc,
        price: p.price,
        material: p.material,
        gender: p.gender,
        status: p.status,
        isFeatured: p.isFeatured,
        viewCount: Math.floor(Math.random() * 500),
        wishlistCount: Math.floor(Math.random() * 50),
        brandId: brands[p.brand],
        categoryId: categories[p.cat],
        subcategoryId: subcategories[p.sub],
        images: {
          create: [
            {
              url: shoeImages[imgIndex],
              type: ImageType.PRIMARY,
              order: 0,
              alt: `${p.name} - Primary View`,
            },
            {
              url: shoeImages[(imgIndex + 1) % shoeImages.length],
              type: ImageType.GALLERY,
              order: 1,
              alt: `${p.name} - Side View`,
            },
            {
              url: lifestyleImages[lifestyleIndex],
              type: ImageType.LIFESTYLE,
              order: 2,
              alt: `${p.name} - Lifestyle`,
            },
          ],
        },
        sizes: {
          create: p.sizes.map((size) => ({
            size,
            isAvailable: Math.random() > 0.15,
          })),
        },
        colors: {
          create: p.colors.map((color) => ({
            name: color.name,
            hexCode: color.hexCode,
          })),
        },
      },
    });

    productCount++;
  }

  console.log(`Created ${productCount} products with images, sizes, and colors.\n`);

  // ─── Create some wishlist entries for test users ──────────
  const allProducts = await prisma.product.findMany({ take: 10 });
  for (let i = 0; i < Math.min(users.length, 3); i++) {
    for (let j = 0; j < 3; j++) {
      const prodIndex = (i * 3 + j) % allProducts.length;
      await prisma.wishlist.create({
        data: {
          userId: users[i].id,
          productId: allProducts[prodIndex].id,
        },
      });
    }
  }

  console.log("Created sample wishlist entries.\n");

  // ─── Create some recently viewed entries ──────────────────
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < 5; j++) {
      const prodIndex = (i + j) % allProducts.length;
      await prisma.recentlyViewed.create({
        data: {
          userId: users[i].id,
          productId: allProducts[prodIndex].id,
          viewedAt: new Date(Date.now() - j * 3600000),
        },
      });
    }
  }

  console.log("Created sample recently viewed entries.\n");
  console.log("Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
