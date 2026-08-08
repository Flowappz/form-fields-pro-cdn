import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { minify } from "terser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SCRIPT_FILENAME = "form-fields-pro-cdn.js";

function getLatestLocalVersion() {
  const srcDir = resolve(ROOT, "src");
  const versions = readdirSync(srcDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d+\.\d+\.\d+$/.test(d.name))
    .map((d) => d.name)
    .sort((a, b) => {
      const [am, an, ap] = a.split(".").map(Number);
      const [bm, bn, bp] = b.split(".").map(Number);
      return am - bm || an - bn || ap - bp;
    });
  return versions.at(-1) ?? null;
}

function isSemver(v) {
  return /^\d+\.\d+\.\d+$/.test(v);
}

function authHeaders() {
  const headers = { "Content-Type": "application/json" };

  // Prefer Basic when available — staging often has BASIC_AUTH without a matching
  // CDN_RELEASE_SECRET. Bearer is used when Basic is absent.
  const basicToken = process.env.BASIC_AUTH_TOKEN || process.env.VITE_BASIC_AUTH_TOKEN;
  if (basicToken) {
    headers.Authorization = basicToken.startsWith("Basic ")
      ? basicToken
      : `Basic ${basicToken}`;
    return headers;
  }

  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASSWORD;
  if (user && pass) {
    headers.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
    return headers;
  }

  const secret = process.env.CDN_RELEASE_SECRET;
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }
  return headers;
}

// ─── Args: <env> [--nr [patch|minor|major]] [--version x.y.z] [--register] ───
// Workflow (recommended):
//   1. Create/edit src/<version>/form-fields-pro-cdn.js (readable source)
//   2. pnpm release:staging -- --version x.y.z
//      → terser minify → upload form-fields-pro-cdn.<contentHash>.js
//      → Cache-Control: public, max-age=31536000, immutable
//      → SRI hash is over minified bytes; re-register sites if URL/hash changes
//
// Alternatives:
//   pnpm release:staging -- --nr patch|minor|major   # bump from DB version
//   pnpm release:staging                             # re-deploy current DB version
//   pnpm release:staging -- --register               # force re-register all sites
//
// Note: same-version re-deploy with changed source is safe — content hash changes
// the object key, so immutable cache never serves stale bytes under a new SRI.
const args = process.argv.slice(2);
const env = args[0];

if (!["dev", "staging", "production", "standalone"].includes(env)) {
  console.error(
    "Usage: node upload.mjs <dev|staging|production|standalone> [--version x.y.z | --nr [patch|minor|major]] [--register]",
  );
  process.exit(1);
}

const forceRegister = args.includes("--register");

const versionFlagIndex = args.indexOf("--version");
const explicitVersion =
  versionFlagIndex !== -1 ? args[versionFlagIndex + 1] : null;
if (versionFlagIndex !== -1 && !isSemver(explicitVersion || "")) {
  console.error(
    `Invalid --version "${explicitVersion ?? ""}". Use semver like 5.1.0`,
  );
  process.exit(1);
}

const nrIndex = args.indexOf("--nr");
const bump = nrIndex !== -1 ? (args[nrIndex + 1] ?? "patch") : null;
if (bump && !["patch", "minor", "major"].includes(bump)) {
  console.error(`Invalid bump type "${bump}". Use patch, minor, or major.`);
  process.exit(1);
}

if (explicitVersion && bump) {
  console.error("Use either --version or --nr, not both.");
  process.exit(1);
}

// ─── Load env file ────────────────────────────────────────────────────────────
const envFile = env === "dev" ? ".env" : `.env.${env}`;
dotenv.config({ path: resolve(ROOT, envFile) });
// Optional designer Basic auth for cdn-release when Bearer secret is unset/mismatched
dotenv.config({
  path: resolve(ROOT, "../advanced-forms-frontend/.env"),
});

const {
  NODE_ENV,
  APP_SLUG,
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
  BACKEND_URL,
} = process.env;

if (
  !NODE_ENV ||
  !APP_SLUG ||
  !R2_ACCOUNT_ID ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_BUCKET_NAME ||
  !R2_PUBLIC_URL ||
  !BACKEND_URL
) {
  console.error(`Missing required env vars in ${envFile}`);
  process.exit(1);
}

if (!process.env.CDN_RELEASE_SECRET) {
  console.warn(
    `⚠ CDN_RELEASE_SECRET missing in ${envFile} — POST /api/cdn-release may fail if backend requires it.`,
  );
}

// ─── Resolve version from DB ──────────────────────────────────────────────────
console.log(`Fetching current version from ${BACKEND_URL}...`);
let release = null;
try {
  const latestRes = await fetch(`${BACKEND_URL}/api/cdn-release/latest`, {
    headers: authHeaders(),
  });
  if (latestRes.ok) {
    ({ release } = await latestRes.json());
  } else {
    const body = await latestRes.text();
    console.warn(`⚠ Failed to fetch latest release (${latestRes.status}): ${body}`);
    if (!explicitVersion && !bump) {
      console.error(
        "\nHint: staging/production backend must have /api/cdn-release/* deployed (feature/cdn-release-pipeline).",
      );
      process.exit(1);
    }
    console.warn("Continuing with explicit --version / --nr despite latest fetch failure.");
  }
} catch (err) {
  console.warn("⚠ Latest release request failed:", err?.message || err);
  if (!explicitVersion && !bump) process.exit(1);
}

if (!release?.version) {
  const localLatest = getLatestLocalVersion();
  if (!explicitVersion && !bump && !localLatest) {
    console.error(
      "✗ No release found in DB and no local version folders. Use --version or --nr to create the first release.",
    );
    process.exit(1);
  }
  release = { version: localLatest ?? "0.0.0" };
  console.log(
    `No DB release yet — seeding from local version folder: ${release.version}`,
  );
}

const currentVersion = release.version;
const currentHostedLocation = release.hostedLocation ?? null;
const currentIntegrityHash = release.integrityHash ?? null;

let version = currentVersion;
let isNewVersion = false;

if (explicitVersion) {
  version = explicitVersion;
  isNewVersion = version !== currentVersion;
  console.log(
    isNewVersion
      ? `Deploying explicit version: ${currentVersion} → ${version}`
      : `Re-deploying explicit version: ${version}`,
  );
} else if (bump) {
  const [maj, min, pat] = currentVersion
    .replace(/-.*$/, "")
    .split(".")
    .map(Number);
  if (bump === "major") version = `${maj + 1}.0.0`;
  else if (bump === "minor") version = `${maj}.${min + 1}.0`;
  else version = `${maj}.${min}.${pat + 1}`;
  isNewVersion = true;
  console.log(`Bumping version: ${currentVersion} → ${version}`);
} else {
  console.log(`Re-deploying current version: ${version}`);
}

// ─── Resolve local script file ────────────────────────────────────────────────
const versionDir = resolve(ROOT, "src", version);
const filePath = resolve(versionDir, SCRIPT_FILENAME);
const previousPath = resolve(ROOT, "src", currentVersion, SCRIPT_FILENAME);

if (!existsSync(filePath)) {
  if (explicitVersion) {
    console.error(
      `✗ Missing script for --version ${version}. Expected:\n  ${filePath}`,
    );
    process.exit(1);
  }
  if (!existsSync(previousPath)) {
    console.error(
      `✗ Missing script file. Expected either:\n  - ${filePath}\n  - ${previousPath}`,
    );
    process.exit(1);
  }
  console.log(
    `Local v${version} folder missing — copying from v${currentVersion}...`,
  );
  mkdirSync(versionDir, { recursive: true });
  copyFileSync(previousPath, filePath);
}

console.log(`\nUsing local file: ${filePath}`);

// ─── Inject environment-specific service URLs ─────────────────────────────────
const DEFAULT_DATA_CLIENT_URLS = {
  production: "https://flowapps-data-client.vercel.app",
  staging: "https://flowapps-data-client-staging.up.railway.app",
  standalone: "https://flowapps-data-client.vercel.app",
  dev: "http://localhost:3000",
};
const DEFAULT_EMAIL_NOTIFIER_URLS = {
  production: "https://email-notifier-prod.up.railway.app",
  staging: "https://form-fields-pro-email-notifier-staging.up.railway.app",
  standalone: "https://email-notifier-prod.up.railway.app",
  dev: "http://localhost:4000",
};

function normalizeServiceUrl(url) {
  return String(url || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");
}

const dataClientUrl = normalizeServiceUrl(
  process.env.DATA_CLIENT_URL || BACKEND_URL || DEFAULT_DATA_CLIENT_URLS[env],
);
const emailNotifierUrl = normalizeServiceUrl(
  process.env.EMAIL_NOTIFIER_URL || DEFAULT_EMAIL_NOTIFIER_URLS[env],
);

if (!dataClientUrl || !emailNotifierUrl) {
  console.error(
    "✗ Missing DATA_CLIENT_URL/BACKEND_URL or EMAIL_NOTIFIER_URL for CDN placeholders.",
  );
  process.exit(1);
}

console.log(`Data client URL: ${dataClientUrl}`);
console.log(`Email notifier URL: ${emailNotifierUrl}`);

// ─── Minify before upload ─────────────────────────────────────────────────────
// Source stays readable in src/; R2 + SRI hash use the minified bytes.
console.log(`\nMinifying with terser...`);
const rawSource = readFileSync(filePath, "utf8");
const source = rawSource
  .replaceAll("__FFP_DATA_CLIENT_URL__", dataClientUrl)
  .replaceAll("__FFP_EMAIL_NOTIFIER_URL__", emailNotifierUrl)
  .replaceAll(
    "__FFP_SUBMISSION_SECRET__",
    process.env.FORM_SUBMISSION_SECRET || process.env.SUBMISSION_HMAC_SECRET || "",
  );

if (
  source.includes("__FFP_DATA_CLIENT_URL__") ||
  source.includes("__FFP_EMAIL_NOTIFIER_URL__") ||
  source.includes("__FFP_SUBMISSION_SECRET__")
) {
  console.error(
    "✗ CDN placeholders were not fully replaced. Check DATA_CLIENT_URL / EMAIL_NOTIFIER_URL / FORM_SUBMISSION_SECRET.",
  );
  process.exit(1);
}

const minifyResult = await minify(source, {
  compress: true,
  mangle: true,
  format: {
    comments: false,
  },
});
if (!minifyResult.code) {
  console.error("✗ Terser produced empty output");
  process.exit(1);
}
const body = Buffer.from(minifyResult.code, "utf8");
const contentHash = createHash("sha256").update(body).digest("hex").slice(0, 12);
const integrityHash =
  "sha384-" + createHash("sha384").update(body).digest("base64");

const distDir = resolve(ROOT, "dist", version);
mkdirSync(distDir, { recursive: true });
const distPath = resolve(distDir, SCRIPT_FILENAME);
writeFileSync(distPath, body);
console.log(
  `✓ Minified: ${source.length.toLocaleString()} → ${body.length.toLocaleString()} bytes`,
);
console.log(`  Artifact: ${distPath}`);

// Content-hash in the object key so immutable caching is safe even if the same
// semver is re-deployed with different bytes (URL changes → no stale SRI).
const hashedFilename = `form-fields-pro-cdn.${contentHash}.js`;
const key = `${APP_SLUG}/${NODE_ENV}/${version}/${hashedFilename}`;

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

console.log(`\nUploading ${key} to R2 bucket "${R2_BUCKET_NAME}"...`);
await client.send(
  new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: "application/javascript",
    // Versioned + content-hashed URL → long-lived immutable cache is safe.
    CacheControl: "public, max-age=31536000, immutable",
  }),
);
console.log(`✓ Uploaded: ${R2_PUBLIC_URL}/${key}`);

// ─── Save release metadata ────────────────────────────────────────────────────
const hostedLocation = `${R2_PUBLIC_URL}/${key}`;
console.log(`\nSaving release metadata to DB...`);
const releaseRes = await fetch(`${BACKEND_URL}/api/cdn-release`, {
  method: "POST",
  headers: authHeaders(),
  body: JSON.stringify({
    version,
    hostedLocation,
    integrityHash,
  }),
});
if (!releaseRes.ok) {
  console.error("✗ Failed to save release metadata:", await releaseRes.text());
  process.exit(1);
}
console.log(`✓ Release metadata saved: v${version}`);

// ─── Re-register on all sites ────────────────────────────────────────────────
// Registered scripts carry an SRI integrity hash. Any change to the file bytes
// changes that hash (and the content-hashed URL), so a site still holding the
// previous hash/URL will have the script blocked by the browser. Re-register
// whenever the version, the URL, or the integrity hash changes.
const urlChanged =
  currentHostedLocation !== null && currentHostedLocation !== hostedLocation;
const hashChanged =
  currentIntegrityHash !== null && currentIntegrityHash !== integrityHash;

if (urlChanged && !isNewVersion) {
  console.log(
    `\nHosted URL changed for v${version}:\n  old: ${currentHostedLocation}\n  new: ${hostedLocation}`,
  );
}
if (hashChanged && !isNewVersion) {
  console.log(
    `\nScript contents changed for v${version} — SRI hash updated:\n  old: ${currentIntegrityHash}\n  new: ${integrityHash}`,
  );
}

if (isNewVersion || urlChanged || hashChanged || forceRegister) {
  console.log(`\nRe-registering script on all sites...`);
  const registerRes = await fetch(
    `${BACKEND_URL}/api/cdn-release/register-all`,
    {
      method: "POST",
      headers: authHeaders(),
    },
  );
  if (!registerRes.ok) {
    console.error("✗ Failed to re-register scripts:", await registerRes.text());
    process.exit(1);
  }
  const { results } = await registerRes.json();
  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected");
  const isStaleInstall = (msg) => /status code 4(0[14]|03)\b/.test(msg || "");
  const stale = failed.filter((f) => isStaleInstall(f.error));
  const realFailures = failed.filter((f) => !isStaleInstall(f.error));
  console.log(
    `✓ Re-registered on ${succeeded}/${results.length} site(s)${stale.length ? ` (${stale.length} stale install(s) skipped)` : ""}`,
  );
  if (realFailures.length) {
    console.warn(`⚠ Failed sites:`);
    realFailures.forEach((f) => console.warn(`  - ${f.siteId}: ${f.error}`));
  }
} else {
  console.log(
    `\nSkipping site re-registration (same version, URL and integrity hash — sites already point at this exact file).`,
  );
  console.log(`Use --register to force re-registration.`);
}

console.log(`\nDone. v${version} deployed and injected.`);
console.log(
  `Public URL: ${hostedLocation}\nIntegrity: ${integrityHash}`,
);
