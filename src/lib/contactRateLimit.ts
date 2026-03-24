import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const RATE_LIMIT_MAX_ATTEMPTS = 2;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT_FILE = join(tmpdir(), "portfolio-contact-rate-limit.json");

type RateLimitStore = Record<string, number[]>;

let writeQueue: Promise<void> = Promise.resolve();

function normalizeIp(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if (trimmed.startsWith("::ffff:")) {
    return trimmed.slice(7);
  }

  return trimmed;
}

function extractFirstForwardedIp(value: string | null) {
  if (!value) return "";

  const [first] = value.split(",");
  return normalizeIp(first || "");
}

function getClientIpFromHeaders(request: Request) {
  const headerCandidates = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("true-client-ip"),
    request.headers.get("x-real-ip"),
    request.headers.get("fly-client-ip"),
    request.headers.get("x-client-ip"),
    request.headers.get("fastly-client-ip"),
    request.headers.get("x-forwarded-for"),
  ];

  for (const value of headerCandidates) {
    const candidate = extractFirstForwardedIp(value);
    if (candidate) return candidate;
  }

  return "";
}

async function readStore() {
  try {
    const raw = await readFile(RATE_LIMIT_FILE, "utf8");
    return JSON.parse(raw) as RateLimitStore;
  } catch {
    return {};
  }
}

async function writeStore(store: RateLimitStore) {
  await mkdir(dirname(RATE_LIMIT_FILE), { recursive: true });
  await writeFile(RATE_LIMIT_FILE, JSON.stringify(store), "utf8");
}

function pruneStore(store: RateLimitStore, now: number) {
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  for (const [key, timestamps] of Object.entries(store)) {
    const fresh = timestamps.filter((timestamp) => timestamp > cutoff);

    if (fresh.length > 0) {
      store[key] = fresh;
    } else {
      delete store[key];
    }
  }
}

async function withStoreLock<T>(task: () => Promise<T>) {
  const result = writeQueue.then(task, task);
  writeQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

export function resolveRateLimitKey(clientAddress: string | undefined, request: Request, email: string) {
  const clientIp = normalizeIp(clientAddress || "") || getClientIpFromHeaders(request);

  if (clientIp) {
    return `ip:${clientIp}`;
  }

  return `email:${email.trim().toLowerCase()}`;
}

export async function takeContactRateLimitSlot(key: string) {
  return withStoreLock(async () => {
    const now = Date.now();
    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    const store = await readStore();

    pruneStore(store, now);

    const attempts = (store[key] || []).filter((timestamp) => timestamp > cutoff);

    if (attempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
      const retryAfterMs = Math.max(attempts[0] + RATE_LIMIT_WINDOW_MS - now, 0);

      return {
        allowed: false as const,
        retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
      };
    }

    store[key] = [...attempts, now];
    await writeStore(store);

    return {
      allowed: true as const,
      retryAfterSeconds: 0,
    };
  });
}
