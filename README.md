# dt-expert-talks

`<dt-expert-talks>`: the Dinner Table "Expert Talks" event landing page, built as a Wix custom element for the Dinner Table Family Wix Studio site (`dinnertable.com/expert-talks`).

## Use in Wix Studio

Add a **Custom Element** to the page, set its source to **Server URL**, and enter:

- **Server URL:** `https://cdn.jsdelivr.net/gh/joco-tandem/dt-expert-talks@<tag>/dist/dt-expert-talks.js`
- **Tag name:** `dt-expert-talks`

Pin a tag (for example `v1.0.0`) so a change only goes live when the URL in Studio is updated.

## Registration

The form mirrors the Wix event's RSVP form: first name, last name, email, "How did you hear about this event?" and an optional question for the guest. It dispatches a `register` event with `{ firstName, lastName, email, source, question }`. The Wix page code handles it and answers by setting the element's `status` attribute to `success` or `error`. If nothing answers within 15 seconds, the form shows an error.

Each signup goes to Kit with the tag `STATE - Expert Talks RSVP` (last name in the `last_name` field) and is added as a guest on the Wix event, so it shows in the event's guest list. The Wix code lives in `wix/`:

- `wix/backend/kit.web.js` → Studio backend file `backend/kit.web.js`. It reads a Kit v4 API key from the Secrets Manager (`KIT_API_KEY`), adds the subscriber, applies the tag (by ID, `24334376`), then creates a Wix RSVP. Needs the `@wix/events` and `@wix/essentials` npm packages installed in Studio.
- `wix/expert-talks.page.js` → the Expert Talks page's code. It answers `register` by calling the backend.

The Wix RSVP only works while the event's registration is set to "on your site". The dropdown options and the form input names in `kit.web.js` must match the event's form, so update both if that form changes. A failed Wix RSVP is logged and doesn't fail the signup.

## Develop

- Edit `src/dt-expert-talks.js`. The images live in `src/*.b64`, and `__LOGO__` / `__HEADSHOT__` are placeholders for them.
- `python build.py` writes `dist/dt-expert-talks.js` with the images inlined.
- Open `preview.html` to view it. It stands in for the Wix page code and answers `register` with success.
- `node shoot.cjs 375,768,1366,1920` saves full-page screenshots to `shots/`.
