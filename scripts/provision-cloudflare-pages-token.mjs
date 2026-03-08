#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4";

function parseArgs(argv) {
  const flags = new Set();
  const values = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      flags.add("help");
      continue;
    }
    if (arg === "--dry-run") {
      flags.add("dryRun");
      continue;
    }
    if (arg === "--no-github") {
      flags.add("noGithub");
      continue;
    }
    if (arg === "--repo") {
      values.repo = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--pages-project") {
      values.pagesProject = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--token-name") {
      values.tokenName = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--permission-group-id") {
      values.permissionGroupId = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--expires-on") {
      values.expiresOn = argv[index + 1];
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { flags, values };
}

function printHelp() {
  process.stdout.write(
    [
      "Provision a least-privilege Cloudflare Pages deploy token and store it in GitHub Actions secrets.",
      "",
      "Usage:",
      "  node scripts/provision-cloudflare-pages-token.mjs [options]",
      "",
      "Options:",
      "  --repo OWNER/REPO           Override GitHub repo (default: auto-detect via gh)",
      "  --pages-project NAME        Override Pages project name (default: CLOUDFLARE_PAGES_PROJECT or jmcte-me)",
      "  --token-name NAME           Override deploy token name",
      "  --permission-group-id ID    Override permission group id (Pages:Edit)",
      "  --expires-on ISO8601        Set token expiry (example: 2026-12-31T23:59:59Z)",
      "  --no-github                 Create token only; skip GitHub wiring",
      "  --dry-run                   Print actions without calling APIs",
      "  -h, --help                  Show this help",
      "",
      "Required env vars (loadable from .env):",
      "  CLOUDFLARE_TOKEN_MGMT_TOKEN",
      "  CLOUDFLARE_ACCOUNT_ID",
      ""
    ].join("\n")
  );
}

function loadDotenv(filepath) {
  try {
    const raw = readFileSync(filepath, "utf8");
    const env = {};
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const equalsIndex = trimmed.indexOf("=");
      if (equalsIndex === -1) continue;
      const key = trimmed.slice(0, equalsIndex).trim();
      let value = trimmed.slice(equalsIndex + 1).trim();
      if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
    return env;
  } catch {
    return {};
  }
}

function requireValue(value, label) {
  if (!value) {
    throw new Error(`Missing required value: ${label}`);
  }
  return value;
}

function isIso8601Utc(value) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value);
}

async function cfRequest(token, method, pathname, body) {
  const response = await fetch(`${CLOUDFLARE_API_BASE}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.errors?.[0]?.message || payload?.messages?.[0]?.message || response.statusText;
    throw new Error(`Cloudflare API error (${response.status}): ${message}`);
  }

  if (!payload?.success) {
    const message = payload?.errors?.[0]?.message || "Unknown Cloudflare API failure";
    throw new Error(`Cloudflare API failure: ${message}`);
  }

  return payload;
}

async function resolvePagesEditPermissionGroupId(mgmtToken, overrideId) {
  if (overrideId) return overrideId;

  const groupsPayload = await cfRequest(mgmtToken, "GET", "/user/tokens/permission_groups");
  const groups = Array.isArray(groupsPayload.result) ? groupsPayload.result : [];

  const exact = groups.find((group) => group.name === "Cloudflare Pages:Edit");
  if (exact?.id) return exact.id;

  const candidates = groups.filter((group) => {
    const name = String(group.name || "").toLowerCase();
    return name.includes("pages") && name.includes("edit");
  });

  if (candidates.length === 1 && candidates[0]?.id) {
    return candidates[0].id;
  }

  const candidateNames = candidates.slice(0, 8).map((group) => `- ${group.name} (${group.id})`);
  const hint =
    candidateNames.length > 0
      ? `Candidates:\n${candidateNames.join("\n")}\n`
      : "No candidates found.\n";

  throw new Error(
    `Unable to locate Cloudflare Pages:Edit permission group.\n${hint}Set CLOUDFLARE_PAGES_PERMISSION_GROUP_ID or pass --permission-group-id.`
  );
}

function runGh(args, { input } = {}) {
  const result = spawnSync("gh", args, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    input
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    const message = (result.stderr || result.stdout || "").trim() || `gh ${args.join(" ")} failed`;
    throw new Error(message);
  }

  return (result.stdout || "").trim();
}

function resolveGitHubRepo(explicitRepo) {
  if (explicitRepo) return explicitRepo;
  const name = runGh(["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"]);
  if (!name) {
    throw new Error("Unable to auto-detect GitHub repo. Set GITHUB_REPO or pass --repo.");
  }
  return name;
}

function setGitHubSecret(repo, name, value) {
  runGh(["secret", "set", name, "--repo", repo], { input: `${value}\n` });
}

function setGitHubVariable(repo, name, value) {
  runGh(["variable", "set", name, "--repo", repo], { input: `${value}\n` });
}

async function main() {
  const { flags, values } = parseArgs(process.argv.slice(2));
  if (flags.has("help")) {
    printHelp();
    return;
  }

  const dotenv = loadDotenv(resolve(process.cwd(), ".env"));
  const env = { ...dotenv, ...process.env };

  const mgmtToken = requireValue(env.CLOUDFLARE_TOKEN_MGMT_TOKEN, "CLOUDFLARE_TOKEN_MGMT_TOKEN");
  const accountId = requireValue(env.CLOUDFLARE_ACCOUNT_ID, "CLOUDFLARE_ACCOUNT_ID");

  const pagesProject = values.pagesProject || env.CLOUDFLARE_PAGES_PROJECT || "jmcte-me";
  const tokenName = values.tokenName || env.CLOUDFLARE_PAGES_DEPLOY_TOKEN_NAME || `${pagesProject}-pages-deploy`;
  const expiresOn = values.expiresOn || env.CLOUDFLARE_PAGES_DEPLOY_TOKEN_EXPIRES_ON;
  const permissionGroupOverride = values.permissionGroupId || env.CLOUDFLARE_PAGES_PERMISSION_GROUP_ID;

  if (expiresOn && !isIso8601Utc(expiresOn)) {
    throw new Error(
      `Invalid --expires-on / CLOUDFLARE_PAGES_DEPLOY_TOKEN_EXPIRES_ON value: ${expiresOn}. Expected UTC ISO8601 like 2026-12-31T23:59:59Z.`
    );
  }

  const planLines = [
    `Cloudflare account: ${accountId}`,
    `Pages project: ${pagesProject}`,
    `Deploy token name: ${tokenName}`,
    expiresOn ? `Deploy token expiresOn: ${expiresOn}` : "Deploy token expiresOn: (none)"
  ];

  if (flags.has("dryRun")) {
    process.stdout.write(`[dry-run] ${planLines.join("\n[dry-run] ")}\n`);
    process.stdout.write("[dry-run] Would create token + set GitHub secrets/variables via gh.\n");
    return;
  }

  const pagesEditGroupId = await resolvePagesEditPermissionGroupId(mgmtToken, permissionGroupOverride);

  const createBody = {
    name: tokenName,
    policies: [
      {
        effect: "allow",
        resources: {
          [`com.cloudflare.api.account.${accountId}`]: "*"
        },
        permission_groups: [{ id: pagesEditGroupId }]
      }
    ]
  };

  if (expiresOn) {
    createBody.expires_on = expiresOn;
  }

  const createPayload = await cfRequest(mgmtToken, "POST", "/user/tokens", createBody);
  const created = createPayload.result || {};
  const deployTokenValue = created.value;
  const deployTokenId = created.id;

  if (!deployTokenValue || typeof deployTokenValue !== "string") {
    throw new Error("Cloudflare token provisioning succeeded but no token value was returned.");
  }

  if (!flags.has("noGithub")) {
    runGh(["auth", "status"]);
    const repo = resolveGitHubRepo(values.repo || env.GITHUB_REPO);

    setGitHubSecret(repo, "CLOUDFLARE_API_TOKEN", deployTokenValue);
    setGitHubSecret(repo, "CLOUDFLARE_ACCOUNT_ID", accountId);
    setGitHubVariable(repo, "CLOUDFLARE_PAGES_PROJECT", pagesProject);

    process.stdout.write(
      `Provisioned Cloudflare Pages deploy token (${deployTokenId}) and updated GitHub repo secrets/variable for ${repo}.\n`
    );
    process.stdout.write("Secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID\n");
    process.stdout.write("Variable: CLOUDFLARE_PAGES_PROJECT\n");
  } else {
    process.stdout.write(`Provisioned Cloudflare Pages deploy token (${deployTokenId}).\n`);
    process.stdout.write("Skipped GitHub wiring due to --no-github.\n");
  }

  process.stdout.write("Recommended: remove CLOUDFLARE_TOKEN_MGMT_TOKEN from .env after this completes.\n");
}

main().catch((error) => {
  process.stderr.write(`provision failed: ${error.message}\n`);
  process.exit(1);
});
