import { z } from "zod";

// ─── Auth Validators ─────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Product Validators ─────────────────────────────────────

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters").max(200),
  slug: z.string().min(3).max(200).optional(),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000).optional(),
  price: z.number().positive("Price must be a positive number").max(99999),
  brandId: z.string().cuid("Invalid brand"),
  categoryId: z.string().cuid("Invalid category"),
  subcategoryId: z.string().cuid("Invalid subcategory"),
  gender: z.enum(["MEN", "WOMEN", "KIDS"]),
  material: z.string().max(100).optional(),
  status: z.enum(["AVAILABLE", "LIMITED", "TRENDING", "NEW_ARRIVAL"]).default("AVAILABLE"),
  isFeatured: z.boolean().default(false),
  colors: z
    .array(
      z.object({
        name: z.string().min(1),
        hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      })
    )
    .min(1, "At least one color is required"),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1),
        isAvailable: z.boolean().default(true),
      })
    )
    .min(1, "At least one size is required"),
});

// ─── Category Validators ────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(50),
  slug: z.string().min(2).max(50).optional(),
  gender: z.enum(["MEN", "WOMEN", "KIDS"]),
  image: z.string().url().optional(),
});

export const subcategorySchema = z.object({
  name: z.string().min(2, "Subcategory name must be at least 2 characters").max(50),
  slug: z.string().min(2).max(50).optional(),
  categoryId: z.string().cuid("Invalid category"),
});

// ─── Brand Validators ───────────────────────────────────────

export const brandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters").max(50),
  slug: z.string().min(2).max(50).optional(),
  logo: z.string().url().optional(),
  description: z.string().max(500).optional(),
});

// ─── Quiz Validators ────────────────────────────────────────

export const quizSchema = z.object({
  gender: z.enum(["MEN", "WOMEN", "KIDS"]),
  occasion: z.enum(["Sports", "Casual", "Formal", "Fancy"]),
  colorFamily: z.enum(["Neutral", "Bold", "Pastel", "All"]),
  budget: z.enum(["under500", "500to1500", "1500to3000", "above3000"]),
});

// ─── Query Validators ───────────────────────────────────────

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  gender: z.enum(["MEN", "WOMEN", "KIDS"]).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  sort: z.enum(["newest", "popular", "price-asc", "price-desc"]).default("newest"),
  search: z.string().max(100).optional(),
  status: z.enum(["AVAILABLE", "LIMITED", "TRENDING", "NEW_ARRIVAL"]).optional(),
});

// ─── Type Exports ───────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type SubcategoryInput = z.infer<typeof subcategorySchema>;
export type BrandInput = z.infer<typeof brandSchema>;
export type QuizInput = z.infer<typeof quizSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
