import fs from "fs";
import path from "path";

/**
 * Audit script: scans all API routes under app/api/admin/
 * and verifies each has the admin role check pattern.
 *
 * Run: npx tsx scripts/audit-admin-routes.ts
 */

const adminApiDir = path.join(process.cwd(), "src/app/api/admin");

// Match patterns like: session.user?.role !== "ADMIN" or session.user.role !== "ADMIN"
// Also matches requireAdmin() helper usage
const requiredPatterns = [
  /session\.user\??\.role\s*!==\s*["']ADMIN["']/,
  /requireAdmin\s*\(/,
  /role\s*!==\s*["']ADMIN["']/,
];

let hasFailures = false;

function scanDirectory(dir: string) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      scanDirectory(fullPath);
    } else if (file.name === "route.ts") {
      const content = fs.readFileSync(fullPath, "utf-8");
      const hasCheck = requiredPatterns.some((pattern) =>
        pattern.test(content)
      );
      const relativePath = path.relative(process.cwd(), fullPath);
      if (!hasCheck) {
        console.error(`❌ MISSING ADMIN CHECK: ${relativePath}`);
        hasFailures = true;
      } else {
        console.log(`✅ OK: ${relativePath}`);
      }
    }
  }
}

console.log("🔍 Scanning admin API routes for authorization checks...\n");
scanDirectory(adminApiDir);
console.log(
  hasFailures
    ? "\n⚠️  Some routes are missing admin checks! Fix immediately."
    : "\n✅ All admin routes have proper authorization checks."
);

if (hasFailures) process.exit(1);
