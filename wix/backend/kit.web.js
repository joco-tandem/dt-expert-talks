// Wix backend web module: paste into Studio as backend/kit.web.js.
// Adds an Expert Talks registrant to Kit and tags them, so Paeng can
// target RSVPs in later sends, then records them as a guest on the Wix
// event. Needs a Kit v4 API key saved in the Secrets Manager as
// KIT_API_KEY, and the @wix/events and @wix/essentials packages installed
// in Studio (Code > Packages & Apps > npm).
import { Permissions, webMethod } from "wix-web-module";
import { secrets } from "wix-secrets-backend.v2";
import { elevate } from "wix-auth";
import { fetch } from "wix-fetch";
import { rsvpV2 } from "@wix/events";
import { auth } from "@wix/essentials";

const KIT_API = "https://api.kit.com/v4";
// Kit tag "STATE - Expert Talks RSVP".
const TAG_ID = 24334376;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// The Wix event "Expert Talks Series: Behind the Behavior". Its
// registration must be set to "on your site" (RSVP), not "external".
const EVENT_ID = "93601d53-bb62-4891-9bb3-34053a0c65ba";
// Input names from the event's registration form. They change if someone
// rebuilds those fields in the dashboard.
const SOURCE_INPUT = "custom";
const QUESTION_INPUT = "custom-071fc3eb4211948b";
const SOURCES = ["A Friend", "Dinner Table Community Board", "Email", "Social", "Ad", "Other"];

const getSecretValue = elevate(secrets.getSecretValue);
const createRsvp = auth.elevate(rsvpV2.createRsvp);

async function kit(apiKey, path, init = {}) {
  const res = await fetch(`${KIT_API}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey },
  });
  if (!res.ok) throw new Error(`Kit ${init.method || "GET"} ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export const registerForExpertTalk = webMethod(Permissions.Anyone, async (reg = {}) => {
  const clean = (v, max) => String(v || "").trim().slice(0, max);
  const firstName = clean(reg.firstName, 50);
  const lastName = clean(reg.lastName, 50);
  const email = clean(reg.email, 255).toLowerCase();
  const source = clean(reg.source, 100);
  const question = clean(reg.question, 400);
  if (!firstName || !lastName || !EMAIL_RE.test(email) || !SOURCES.includes(source)) {
    throw new Error("Invalid registration");
  }

  const { value: apiKey } = await getSecretValue("KIT_API_KEY");
  // Creating an existing subscriber updates them, so re-registering is safe.
  await kit(apiKey, "/subscribers", {
    method: "POST",
    body: JSON.stringify({
      first_name: firstName,
      email_address: email,
      state: "active",
      fields: { last_name: lastName },
    }),
  });
  await kit(apiKey, `/tags/${TAG_ID}/subscribers`, {
    method: "POST",
    body: JSON.stringify({ email_address: email }),
  });

  // Kit is what sends the talk link and replay, so a failed Wix RSVP (for
  // example a repeat signup) is logged rather than shown to the visitor.
  const inputValues = [
    { inputName: "firstName", value: firstName },
    { inputName: "lastName", value: lastName },
    { inputName: "email", value: email },
    { inputName: SOURCE_INPUT, value: source },
  ];
  if (question) inputValues.push({ inputName: QUESTION_INPUT, value: question });
  try {
    await createRsvp({ eventId: EVENT_ID, firstName, lastName, email, status: "YES", form: { inputValues } });
  } catch (err) {
    console.error("Wix RSVP failed", email, err);
  }
  return { ok: true };
});
