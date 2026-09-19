import assert from "node:assert/strict";
import test from "node:test";
import { checkRateLimit, getRequestIdentifier, resetRateLimit } from "../src/lib/rateLimit.ts";

test("prefers the first forwarded IP address", () => {
  assert.equal(
    getRequestIdentifier({ "x-forwarded-for": "203.0.113.10, 10.0.0.1" }),
    "203.0.113.10",
  );
});

test("falls back to real IP and then unknown", () => {
  assert.equal(getRequestIdentifier({ "x-real-ip": "203.0.113.11" }), "203.0.113.11");
  assert.equal(getRequestIdentifier({}), "unknown");
});

test("blocks attempts after the configured limit and can reset", () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  const options = { limit: 2, windowMs: 60_000 };

  assert.equal(checkRateLimit(key, options).allowed, true);
  assert.equal(checkRateLimit(key, options).allowed, true);
  const blocked = checkRateLimit(key, options);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);

  resetRateLimit(key);
  assert.equal(checkRateLimit(key, options).allowed, true);
  resetRateLimit(key);
});