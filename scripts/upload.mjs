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

// Only reached for the very first release, before the DB has one: after that
// the version comes from the latest release the backend knows about. It used to
// scan `src/<semver>/`; the runtime no longer lives there.
function getLatestLocalVersion() {
  const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8"));
  return pkg.runtimeVersion ?? null;
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Staging's GET /latest has returned a one-off Prisma 500 that succeeded on
// the next call a few seconds later. Fail the release only after retries.
async function fetchWithRetry(url, options, { retries = 3, label = url } = {}) {
  let lastRes = null;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.status < 500 || attempt === retries) return res;
      lastRes = res;
      console.warn(
        `⚠ ${label} returned ${res.status}, retrying (${attempt}/${retries})...`,
      );
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(
        `⚠ ${label} failed (${err?.message || err}), retrying (${attempt}/${retries})...`,
      );
    }
    await sleep(1000 * attempt);
  }
  return lastRes;
}

function latestFetchHint(status) {
  if (status === 404) {
    return "Hint: staging/production backend must have /api/cdn-release/* deployed (feature/cdn-release-pipeline).";
  }
  if (status === 401 || status === 403) {
    return "Hint: check BASIC_AUTH / VITE_BASIC_AUTH_TOKEN / CDN_RELEASE_SECRET against the target backend.";
  }
  return "Hint: /api/cdn-release/latest is deployed but the backend threw. Retry; if it persists, check Railway logs for that route.";
}

// ─── Args: <env> [--nr [patch|minor|major]] [--version x.y.z] [--register] ───
// Workflow (recommended):
//   1. Edit the source under packages/ and set `runtimeVersion` in package.json
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

// A trailing slash here produces `//api/...`, which the backend answers with a
// 308 and the release script reads as a failure.
const API_BASE = String(BACKEND_URL).trim().replace(/\/+$/, "");

if (!process.env.CDN_RELEASE_SECRET) {
  console.warn(
    `⚠ CDN_RELEASE_SECRET missing in ${envFile} — POST /api/cdn-release may fail if backend requires it.`,
  );
}

// ─── Resolve version from DB ──────────────────────────────────────────────────
console.log(`Fetching current version from ${BACKEND_URL}...`);
let release = null;
try {
  const latestRes = await fetchWithRetry(
    `${API_BASE}/api/cdn-release/latest`,
    { headers: authHeaders() },
    { label: "GET /api/cdn-release/latest" },
  );
  if (latestRes.ok) {
    ({ release } = await latestRes.json());
  } else {
    const body = await latestRes.text();
    console.warn(`⚠ Failed to fetch latest release (${latestRes.status}): ${body}`);
    if (!explicitVersion && !bump) {
      console.error(`\n${latestFetchHint(latestRes.status)}`);
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
      "✗ No release in the DB and no `runtimeVersion` in package.json. Use --version or --nr to create the first release.",
    );
    process.exit(1);
  }
  release = { version: localLatest ?? "0.0.0" };
  console.log(
    `No DB release yet — seeding from package.json runtimeVersion: ${release.version}`,
  );
}

const currentVersion = release.version;
const currentHostedLocation = release.hostedLocation ?? null;
const currentIntegrityHash = release.integrityHash ?? null;
// When the latest-release fetch failed we seeded `release` locally, so we do not
// actually know what sites currently point at. Skipping registration on that
// guess leaves every site on the previous script with no warning.
const currentReleaseUnknown = currentHostedLocation === null;

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
// The bundled core from scripts/build.mjs wins when it exists. It carries the
// chunk manifest, so uploading src/<version>/ instead would publish a core whose
// bytes have no idea the chunks exist - every field would fall back to its
// native input and nothing would look broken enough to notice.
const versionDir = resolve(ROOT, "src", version);
const builtPath = resolve(ROOT, "build", version, SCRIPT_FILENAME);
const filePath = existsSync(builtPath)
  ? builtPath
  : resolve(versionDir, SCRIPT_FILENAME);
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

const DEFAULT_LICENSE_URLS = {
  production: "https://license.flowappz.com/api/license",
  staging: "https://license-staging.flowappz.com/api/license",
  standalone: "https://license.flowappz.com/api/license",
  dev: "https://license-staging.flowappz.com/api/license",
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
// Optional: the beacon endpoint. Absent means core skips telemetry entirely,
// which is the right default for a self-hosted or standalone release.
const beaconUrl = process.env.BEACON_URL
  ? normalizeServiceUrl(process.env.BEACON_URL)
  : "";

const emailNotifierUrl = normalizeServiceUrl(
  process.env.EMAIL_NOTIFIER_URL || DEFAULT_EMAIL_NOTIFIER_URLS[env],
);
// Not run through normalizeServiceUrl: this one keeps its `/api/license` path.
const licenseUrl = String(
  process.env.LICENSE_VALIDATION_URL || DEFAULT_LICENSE_URLS[env] || "",
)
  .trim()
  .replace(/\/+$/, "");

// EMAIL_NOTIFIER_URL is deliberately not required. The runtime dropped
// __FFP_EMAIL_NOTIFIER_URL__ in 5.1.5, so this script was hard-requiring an env
// var for a placeholder the source no longer contains - a release that failed
// for a reason that had stopped being real. The substitution below is kept so an
// older pinned version can still be re-released.
if (!dataClientUrl || !licenseUrl) {
  console.error(
    "✗ Missing DATA_CLIENT_URL/BACKEND_URL or LICENSE_VALIDATION_URL for CDN placeholders.",
  );
  process.exit(1);
}

console.log(`Data client URL: ${dataClientUrl}`);
if (emailNotifierUrl) console.log(`Email notifier URL: ${emailNotifierUrl}`);
if (beaconUrl) console.log(`Beacon URL: ${beaconUrl}`);
console.log(`License URL: ${licenseUrl}`);

// ─── Minify before upload ─────────────────────────────────────────────────────
// The build in build/<version>/ is the input; R2 + SRI hash use the minified bytes.
console.log(`\nMinifying with terser...`);
const rawSource = readFileSync(filePath, "utf8");
const source = rawSource
  .replaceAll("__FFP_DATA_CLIENT_URL__", dataClientUrl)
  .replaceAll("__FFP_EMAIL_NOTIFIER_URL__", emailNotifierUrl ?? "")
  .replaceAll("__FFP_BEACON_URL__", beaconUrl ?? "")
  .replaceAll("__FFP_LICENSE_URL__", licenseUrl)
  .replaceAll(
    "__FFP_SUBMISSION_SECRET__",
    process.env.FORM_SUBMISSION_SECRET || process.env.SUBMISSION_HMAC_SECRET || "",
  );

// Guard on the tokens, not on the env vars: a placeholder still present after
// substitution ships a literal `__FFP_...` string into an immutable public
// object, and there is no way to fix it afterwards without a new release.
const leftover = [
  "__FFP_DATA_CLIENT_URL__",
  "__FFP_EMAIL_NOTIFIER_URL__",
  "__FFP_LICENSE_URL__",
  "__FFP_BEACON_URL__",
  "__FFP_SUBMISSION_SECRET__",
].filter((token) => source.includes(token));

if (leftover.length) {
  console.error(`✗ CDN placeholders were not replaced: ${leftover.join(", ")}`);
  console.error(
    "  Set the matching env var in the .env file for this environment.",
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

// ─── Upload lazily-loaded chunks ──────────────────────────────────────────────
// Chunks go up FIRST. Core carries their URLs and sha384 digests as literals, so
// a core object that is reachable before its chunks are would fail every
// integrity check for the length of that window. Order is the safety property.
//
// Keys are content-addressed, so re-uploading an unchanged chunk writes the same
// bytes to the same key and is a no-op. Never mutate an existing key: that is
// what makes `immutable` and rollback safe.
const buildManifestPath = resolve(ROOT, "build", version, "build-manifest.json");
if (existsSync(buildManifestPath)) {
  const buildManifest = JSON.parse(readFileSync(buildManifestPath, "utf8"));
  const chunkNames = Object.keys(buildManifest.chunks ?? {});

  if (buildManifest.nodeEnv !== NODE_ENV || buildManifest.appSlug !== APP_SLUG) {
    console.error(
      `✗ build/${version} was built for ${buildManifest.appSlug}/${buildManifest.nodeEnv}, not ${APP_SLUG}/${NODE_ENV}.`,
    );
    console.error("  Chunk URLs are baked into core. Re-run: node scripts/build.mjs " + env + " --version " + version);
    process.exit(1);
  }

  console.log(`\nUploading ${chunkNames.length} chunks to R2...`);
  for (const name of chunkNames) {
    const entry = buildManifest.chunks[name];
    const chunkKey = new URL(entry.url).pathname.replace(/^\/+/, "");
    const chunkBody = readFileSync(resolve(ROOT, "build", version, "chunks", chunkKey.split("/").pop()));

    // The digest core will enforce, recomputed from the bytes actually being
    // uploaded. A mismatch means build/ and the manifest have drifted, and every
    // visitor would get a blocked script instead of a working field.
    const actual = "sha384-" + createHash("sha384").update(chunkBody).digest("base64");
    if (actual !== entry.integrity) {
      console.error(`✗ ${name}: bytes on disk do not match the manifest digest.`);
      console.error(`  manifest: ${entry.integrity}\n  on disk:  ${actual}`);
      console.error("  Re-run scripts/build.mjs - core must be rebuilt with the new digest.");
      process.exit(1);
    }

    await client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: chunkKey,
        Body: chunkBody,
        ContentType: "application/javascript",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    console.log(`  ✓ ${name.padEnd(10)} ${chunkKey}`);
  }
} else {
  console.log(
    `\nNo build/${version}/build-manifest.json - uploading core only.`,
  );
  console.log("  Run scripts/build.mjs first if this release is meant to ship chunks.");
}

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
// A trailing slash on R2_PUBLIC_URL would otherwise register a `//` URL that 404s.
const publicBase = String(R2_PUBLIC_URL).trim().replace(/\/+$/, "");

console.log(`✓ Uploaded: ${publicBase}/${key}`);

// ─── Save release metadata ────────────────────────────────────────────────────
const hostedLocation = `${publicBase}/${key}`;
console.log(`\nSaving release metadata to DB...`);
const releaseRes = await fetchWithRetry(
  `${API_BASE}/api/cdn-release`,
  {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      version,
      hostedLocation,
      integrityHash,
    }),
  },
  { label: "POST /api/cdn-release" },
);
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

// ─── Re-register on all sites ────────────────────────────────────────────────
// Marketplace: never push new bytes to existing sites from this pipeline.
// New JS is a new immutable CdnRelease version and an App update. Installs and
// the Designer's "Apply version" path register a pin per site.
if (forceRegister && NODE_ENV !== "production") {
  console.log(`\nRe-registering script on all sites (--register, non-production)...`);
  const registerRes = await fetchWithRetry(
    `${API_BASE}/api/cdn-release/register-all`,
    {
      method: "POST",
      headers: authHeaders(),
    },
    { label: "POST /api/cdn-release/register-all" },
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
    `\nSkipping site re-registration. Marketplace sites stay on their pinned version until a reviewer-approved App update and a per-site Apply.`,
  );
  if (NODE_ENV === "production") {
    console.log(`Production uploads never call register-all.`);
  } else {
    console.log(`Use --register to force re-registration in non-production.`);
  }
}

console.log(`\nDone. v${version} deployed and injected.`);
console.log(
  `Public URL: ${hostedLocation}\nIntegrity: ${integrityHash}`,
);
