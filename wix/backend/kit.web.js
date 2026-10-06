// Wix backend web module: paste into Studio as backend/kit.web.js.
// Adds an Expert Talks registrant to Kit and tags them, so Paeng can
// target RSVPs in later sends. Needs a Kit v4 API key saved in the
// Secrets Manager as KIT_API_KEY.
import { Permissions, webMethod } from "wix-web-module";
import { secrets } from "wix-secrets-backend.v2";
import { elevate } from "wix-auth";
import { fetch } from "wix-fetch";

const KIT_API = "https://api.kit.com/v4";
const TAG_NAME = "STATE - Expert Talks RSVP";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const getSecretValue = elevate(secrets.getSecretValue);
let tagIdCache;

async function kit(apiKey, path, init = {}) {
  const res = await fetch(`${KIT_API}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey },
  });
  if (!res.ok) throw new Error(`Kit ${init.method || "GET"} ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function tagId(apiKey) {
  if (tagIdCache) return tagIdCache;
  const { tags } = await kit(apiKey, "/tags?per_page=1000");
  const tag = tags.find((t) => t.name === TAG_NAME);
  if (!tag) throw new Error(`Kit tag "${TAG_NAME}" not found`);
  return (tagIdCache = tag.id);
}

export const registerForExpertTalk = webMethod(Permissions.Anyone, async (firstName, email) => {
  firstName = String(firstName || "").trim().slice(0, 100);
  email = String(email || "").trim().toLowerCase().slice(0, 254);
  if (!firstName || !EMAIL_RE.test(email)) throw new Error("Invalid registration");

  const { value: apiKey } = await getSecretValue("KIT_API_KEY");
  // Creating an existing subscriber updates them, so re-registering is safe.
  await kit(apiKey, "/subscribers", {
    method: "POST",
    body: JSON.stringify({ first_name: firstName, email_address: email, state: "active" }),
  });
  await kit(apiKey, `/tags/${await tagId(apiKey)}/subscribers`, {
    method: "POST",
    body: JSON.stringify({ email_address: email }),
  });
  return { ok: true };
});
