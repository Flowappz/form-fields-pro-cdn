import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
} from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

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
  const secret = process.env.CDN_RELEASE_SECRET;
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }
  return headers;
}

// ─── Args: <env> [--nr [patch|minor|major]] [--version x.y.z] [--register] ───
// Workflow (recommended):
//   1. Create/edit src/5.1.0/form-fields-pro-cdn.js
//   2. pnpm release:staging -- --version 5.1.0
//
// Alternatives:
//   pnpm release:staging -- --nr patch|minor|major   # bump from DB version
//   pnpm release:staging                             # re-deploy current DB version
//   pnpm release:staging -- --register               # force re-register all sites
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
const latestRes = await fetch(`${BACKEND_URL}/api/cdn-release/latest`);
if (!latestRes.ok) {
  console.error("✗ Failed to fetch latest release:", await latestRes.text());
  console.error(
    "\nHint: staging/production backend must have /api/cdn-release/* deployed (feature/cdn-release-pipeline).",
  );
  process.exit(1);
}
let { release } = await latestRes.json();
if (!release?.version) {
  const localLatest = getLatestLocalVersion();
  if (!explicitVersion && !bump && !localLatest) {
    console.error(
      "✗ No release found in DB and no local version folders. Use --version or --nr to create the first release.",
    );
    process.exit(1);
  }
  // First release: seed from latest local folder (e.g. 5.0.9), then optionally bump.
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

// ─── Upload to R2 ─────────────────────────────────────────────────────────────
const key = `${APP_SLUG}/${NODE_ENV}/${version}/${SCRIPT_FILENAME}`;
const body = readFileSync(filePath);
const hash = "sha384-" + createHash("sha384").update(body).digest("base64");

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
    CacheControl: "no-cache, no-store",
  }),
);
console.log(`✓ Uploaded: ${R2_PUBLIC_URL}/${key}`);

// ─── Save release metadata ────────────────────────────────────────────────────
const hostedLocation = `${R2_PUBLIC_URL}/${key}`;
console.log(`\nSaving release metadata to DB...`);
const releaseRes = await fetch(`${BACKEND_URL}/api/cdn-release`, {
  method: "POST",
  headers: authHeaders(),
  body: JSON.stringify({ version, hostedLocation, integrityHash: hash }),
});
if (!releaseRes.ok) {
  console.error("✗ Failed to save release metadata:", await releaseRes.text());
  process.exit(1);
}
console.log(`✓ Release metadata saved: v${version}`);

// ─── Re-register on all sites ────────────────────────────────────────────────
// Registered scripts carry an SRI integrity hash. Any change to the file bytes
// changes that hash, so a site still holding the previous hash will have the
// script blocked by the browser. Re-register whenever the version, the URL, or
// the integrity hash changes — not just on a version bump.
const urlChanged =
  currentHostedLocation !== null && currentHostedLocation !== hostedLocation;
const hashChanged =
  currentIntegrityHash !== null && currentIntegrityHash !== hash;

if (urlChanged && !isNewVersion) {
  console.log(
    `\nHosted URL changed for v${version}:\n  old: ${currentHostedLocation}\n  new: ${hostedLocation}`,
  );
}
if (hashChanged && !isNewVersion) {
  console.log(
    `\nScript contents changed for v${version} — SRI hash updated:\n  old: ${currentIntegrityHash}\n  new: ${hash}`,
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
  `Public URL: ${hostedLocation}\nIntegrity: ${hash}`,
);
