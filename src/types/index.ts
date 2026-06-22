import { type DefaultSession } from "next-auth";

// ─── Auth Type Augmentation ─────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

// ─── Product Types ──────────────────────────────────────────

export interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  material: string | null;
  gender: "MEN" | "WOMEN" | "KIDS";
  status: "AVAILABLE" | "LIMITED" | "TRENDING" | "NEW_ARRIVAL";
  isFeatured: boolean;
  viewCount: number;
  wishlistCount: number;
  createdAt: Date;
  updatedAt: Date;
  brandId: string;
  categoryId: string;
  subcategoryId: string;
  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    gender: "MEN" | "WOMEN" | "KIDS";
  };
  subcategory: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImageType[];
  sizes: ProductSizeType[];
  colors: ProductColorType[];
}

export interface ProductImageType {
  id: string;
  productId: string;
  url: string;
  publicId: string | null;
  type: "PRIMARY" | "GALLERY" | "LIFESTYLE" | "ALT_ANGLE";
  order: number;
  alt: string | null;
}

export interface ProductSizeType {
  id: string;
  productId: string;
  size: string;
  isAvailable: boolean;
}

export interface ProductColorType {
  id: string;
  productId: string;
  name: string;
  hexCode: string | null;
}

// ─── Category Types ─────────────────────────────────────────

export interface CategoryWithSubcategories {
  id: string;
  name: string;
  slug: string;
  gender: "MEN" | "WOMEN" | "KIDS";
  image: string | null;
  subcategories: {
    id: string;
    name: string;
    slug: string;
  }[];
  _count?: {
    products: number;
  };
}

// ─── Brand Types ────────────────────────────────────────────

export interface BrandType {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  _count?: {
    products: number;
  };
}

// ─── Wishlist Types ─────────────────────────────────────────

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
  product: ProductWithRelations;
}

// ─── Filter Types ───────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  gender?: "MEN" | "WOMEN" | "KIDS";
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  sort?: "newest" | "popular" | "price-asc" | "price-desc";
  search?: string;
  status?: "AVAILABLE" | "LIMITED" | "TRENDING" | "NEW_ARRIVAL";
  page?: number;
  limit?: number;
}

// ─── Paginated Response ─────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Quiz Types ─────────────────────────────────────────────

export interface QuizAnswers {
  gender: "MEN" | "WOMEN" | "KIDS";
  occasion: "Sports" | "Casual" | "Formal" | "Fancy";
  colorFamily: "Neutral" | "Bold" | "Pastel" | "All";
  budget: "under500" | "500to1500" | "1500to3000" | "above3000";
}

// ─── Admin Dashboard Stats ──────────────────────────────────

export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalWishlistSaves: number;
  totalViews: number;
  mostViewedProducts: {
    id: string;
    name: string;
    slug: string;
    viewCount: number;
  }[];
  mostWishlistedProducts: {
    id: string;
    name: string;
    slug: string;
    wishlistCount: number;
  }[];
}

// ─── API Response ───────────────────────────────────────────

export interface ApiResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
