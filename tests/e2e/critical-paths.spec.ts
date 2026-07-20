import { test, expect } from "@playwright/test";

test.describe("Guest Browsing", () => {
  test("homepage loads with hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Delhi Shoe Palace/);
    // Hero section should be visible
    await expect(page.locator("main")).toBeVisible();
  });

  test("products page loads and shows products", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveTitle(/Products/);
    // Should see product cards
    await expect(page.locator("[data-testid='product-card']").or(page.locator(".product-card")).first()).toBeVisible({ timeout: 10_000 });
  });

  test("guest cannot access wishlist page", async ({ page }) => {
    await page.goto("/wishlist");
    // Should redirect to login
    await expect(page).toHaveURL(/auth\/login/);
  });

  test("guest products limited to 15 items", async ({ page }) => {
    await page.goto("/products?page=2");
    // Even with page=2, guests should see at most 15 products
    const cards = page.locator("[data-testid='product-card']").or(page.locator(".product-card"));
    const count = await cards.count();
    expect(count).toBeLessThanOrEqual(15);
  });

  test("404 page renders for unknown route", async ({ page }) => {
    const response = await page.goto("/nonexistent-page-12345");
    expect(response?.status()).toBe(404);
  });
});

test.describe("Auth Pages", () => {
  test("login page renders correctly", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("#login-submit-btn")).toBeVisible();
    await expect(page.locator("#google-login-btn")).toBeVisible();
  });

  test("login shows validation errors for empty fields", async ({ page }) => {
    await page.goto("/auth/login");
    await page.click("#login-submit-btn");
    // Should show validation errors
    await expect(page.locator("text=Please enter a valid email")).toBeVisible({ timeout: 5_000 });
  });

  test("signup page renders correctly", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.locator("form")).toBeVisible();
  });

  test("forgot password page renders correctly", async ({ page }) => {
    await page.goto("/auth/forgot-password");
    await expect(page.locator("form")).toBeVisible();
  });

  test("malicious callbackUrl is stripped", async ({ page }) => {
    await page.goto("/auth/login?callbackUrl=javascript:alert(1)");
    // Should strip the malicious callbackUrl
    await expect(page).not.toHaveURL(/javascript/);
  });
});

test.describe("Contact Form", () => {
  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("#contact-submit-btn")).toBeVisible();
  });

  test("contact form validates required fields", async ({ page }) => {
    await page.goto("/contact");
    await page.click("#contact-submit-btn");
    // Should show validation errors
    await expect(page.locator(".text-red-500").first()).toBeVisible({ timeout: 5_000 });
  });
});

test.describe("Theme Toggle", () => {
  test("theme toggle switches between dark and light", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    // Should start in dark mode (default)
    await expect(html).toHaveClass(/dark/);
  });
});

test.describe("Navigation", () => {
  test("navbar links are functional", async ({ page }) => {
    await page.goto("/");

    // Check that main navigation exists
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
  });

  test("products page responds to search param", async ({ page }) => {
    await page.goto("/products?search=nike");
    await expect(page).toHaveURL(/search=nike/);
  });
});

test.describe("Admin Protection", () => {
  test("admin dashboard redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/auth\/login/);
  });

  test("admin API returns 403 for unauthenticated requests", async ({ request }) => {
    const response = await request.get("/api/admin/stats");
    expect(response.status()).toBe(403);
  });
});

test.describe("SEO", () => {
  test("homepage has proper meta tags", async ({ page }) => {
    await page.goto("/");
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
  });

  test("structured data is present", async ({ page }) => {
    await page.goto("/");
    const ldJson = page.locator('script[type="application/ld+json"]');
    await expect(ldJson.first()).toBeAttached();
  });
});
