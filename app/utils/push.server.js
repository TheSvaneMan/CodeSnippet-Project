import { createSign } from "node:crypto";

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@example.com";

/**
 * Signs a JWT for VAPID authentication using native node:crypto
 */
function createVapidHeader(endpoint) {
  const url = new URL(endpoint);
  const audience = `${url.protocol}//${url.host}`;

  const header = btoa(JSON.stringify({ typ: "JWT", alg: "ES256" })).replace(
    /=/g,
    ""
  );
  const body = btoa(
    JSON.stringify({
      aud: audience,
      exp: Math.floor(Date.now() / 1000) + 43200, // 12 hours
      sub: VAPID_SUBJECT,
    })
  ).replace(/=/g, "");

  const unsignedToken = `${header}.${body}`;

  // Sign using ECDSA with P-256 curve
  const sign = createSign("sha256");
  sign.update(unsignedToken);
  sign.end();

  const signature = sign
    .sign({
      key: Buffer.from(VAPID_PRIVATE, "base64url"),
      format: "der",
      type: "pkcs8",
    })
    .toString("base64url");

  return `${unsignedToken}.${signature}`;
}

export async function sendNativePush(subscription, payload = {}) {
  const token = createVapidHeader(subscription.endpoint);

  const response = await fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      TTL: "60",
      "Content-Type": "application/json",
      Authorization: `WebPush ${token}`,
      "Crypto-Key": `p256ecdsa=${VAPID_PUBLIC}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Push Service Error (${response.status}): ${text}`);
  }

  return response;
}
