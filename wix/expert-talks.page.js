// Wix page code for the Expert Talks page. Change #customElement1 if the
// custom element has a different ID in Studio.
import { registerForExpertTalk } from "backend/kit.web";

$w.onReady(() => {
  const talks = $w("#customElement1");
  talks.on("register", async ({ detail }) => {
    try {
      await registerForExpertTalk(detail);
      talks.setAttribute("status", "success");
    } catch (err) {
      console.error(err);
      talks.setAttribute("status", "error");
    }
  });
});
