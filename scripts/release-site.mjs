// Inject the latest CDN release into ONE specific site by siteId.
// Usage: pnpm release:site <siteId>
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const envName = process.env.NODE_ENV || "production";
const envFile = envName === "dev" ? ".env" : `.env.${envName}`;
dotenv.config({ path: resolve(ROOT, envFile), override: true });

const BACKEND_URL = process.env.BACKEND_URL;
if (!BACKEND_URL) {
  console.error(`Missing BACKEND_URL in ${envFile}`);
  process.exit(1);
}

const siteId = process.argv[2];
if (!siteId) {
  console.error("Usage: pnpm release:site <siteId>");
  process.exit(1);
}

console.log(`Injecting latest CDN into site ${siteId} via ${BACKEND_URL}...`);
const res = await fetch(`${BACKEND_URL}/api/cdn-release/inject/${siteId}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
});

if (!res.ok) {
  console.error(`✗ Failed (${res.status}):`, await res.text());
  process.exit(1);
}

const body = await res.json();
console.log(`✓ Done.`, body);
console.log(
  `\nNote: customer needs to publish their site in Webflow for the change to take effect.`,
);
