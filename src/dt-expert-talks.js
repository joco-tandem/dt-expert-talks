/*
 * <dt-expert-talks> — Dinner Table "Expert Talks" event landing page.
 * Built as a Wix custom element for the Dinner Table Family Wix Studio site
 * (dinnertable.com/expert-talks), from Paeng's Canva mockup "Expert Talks DT".
 *
 * Registration: the form dispatches a `register` CustomEvent
 * ({ firstName, email }). Wix page code listens with
 *   $w('#customElement1').on('register', ...)
 * and answers by setting the `status` attribute to "success" or "error".
 * If nothing answers within 15s the form shows the error state.
 */
(() => {
  const TAG = "dt-expert-talks";
  if (customElements.get(TAG)) return;

  const LOGO = "data:image/png;base64,__LOGO__";
  const HEADSHOT = "data:image/jpeg;base64,__HEADSHOT__";

  // @font-face doesn't work inside a shadow root, so fonts load on the page.
  // Arita Buri isn't on Google Fonts; a Latin-only subset is inlined instead.
  const FONTS_HREF =
    "https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Libre+Baskerville&family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Vollkorn&display=swap";
  const ARITA_CSS = [
    [500, "__ARITA_MEDIUM__"],
    [600, "__ARITA_SEMIBOLD__"],
  ]
    .map(
      ([weight, b64]) =>
        `@font-face{font-family:"Arita Buri";font-weight:${weight};font-style:normal;font-display:swap;src:url(data:font/woff2;base64,${b64}) format("woff2")}`,
    )
    .join("");

  function ensureFonts() {
    if (document.querySelector(`link[data-${TAG}-fonts]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_HREF;
    link.setAttribute(`data-${TAG}-fonts`, "");
    const style = document.createElement("style");
    style.textContent = ARITA_CSS;
    document.head.append(link, style);
  }

  const CSS = /* css */ `
    :host {
      --cream: #f4eee3;
      --paper: #fbf8f1;
      --peach: #f4e3d1;
      --ink: #303b23;
      --ink-2: #313b2c;
      --body: #47473d;
      --muted: #72725c;
      --rust: #9b512a;
      --rust-btn: #96511e;
      --olive: #5b6234;
      --olive-2: #596233;
      --forest: #303b23;
      --khaki: #d8b280;
      --sand: #d8d1be;
      --footer: #f2eddb;
      --tape: rgba(206, 189, 145, 0.82);
      --serif: "Arita Buri", Georgia, serif;
      --baskerville: "Libre Baskerville", Georgia, serif;
      --vollkorn: "Vollkorn", Georgia, serif;
      --sans: "Public Sans", system-ui, sans-serif;
      --script: "Caveat", "Segoe Print", cursive;
      --gutter: clamp(16px, 5vw, 64px);
      --max: 1150px;
      display: block;
      width: 100%;
      color: var(--ink);
      font-family: var(--sans);
      -webkit-font-smoothing: antialiased;
    }
    *, *::before, *::after { box-sizing: border-box; }
    h1, h2, h3, p, ul { margin: 0; }
    ul { padding: 0; list-style: none; }
    img { display: block; max-width: 100%; }
    .wrap { width: 100%; max-width: calc(var(--max) + 2 * var(--gutter)); margin: 0 auto; padding: 0 var(--gutter); }
    .balance { text-wrap: balance; }
    .pretty { text-wrap: pretty; }
    .nowrap { white-space: nowrap; }

    .dotted {
      background-color: var(--cream);
      background-image: radial-gradient(rgba(120, 104, 74, 0.11) 1px, transparent 1.3px);
      background-size: 7px 7px;
    }
    .eyebrow {
      font-family: var(--sans);
      font-size: 17px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--rust);
    }
    .script { font-family: var(--script); font-weight: 500; }
    .tape {
      position: absolute;
      width: 104px;
      height: 30px;
      background: var(--tape);
      box-shadow: 0 1px 2px rgba(60, 50, 30, 0.12);
      z-index: 2;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: var(--rust-btn);
      color: #fff;
      font: 700 19px/1 var(--sans);
      letter-spacing: 0.01em;
      padding: 15px 28px;
      cursor: pointer;
      text-decoration: none;
      transition: background-color 0.15s ease, transform 0.15s ease;
    }
    .btn:hover { background: #7f4418; }
    .btn:active { transform: translateY(1px); }
    .btn:focus-visible, input:focus-visible { outline: 3px solid var(--khaki); outline-offset: 2px; }

    /* ---------- Hero ---------- */
    .hero { padding: 36px 0 96px; overflow: hidden; }
    .topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .logo { width: 126px; height: auto; }
    .logo-link { display: block; border-radius: 4px; }
    .logo-link:focus-visible { outline: 3px solid var(--khaki); outline-offset: 4px; }
    .event-tag {
      font: 600 11.5px/1.6 var(--sans);
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--muted);
      text-align: right;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 48px;
      align-items: start;
      margin-top: 40px;
    }
    .hero-kicker {
      font-family: var(--script);
      font-weight: 500;
      font-size: 30px;
      color: var(--rust-btn);
      transform: rotate(-2deg);
      transform-origin: left;
      display: inline-block;
    }
    .hero h1 {
      font: 400 70px/1.05 var(--baskerville);
      color: var(--ink);
      margin-top: 28px;
      letter-spacing: -0.005em;
    }
    .hero-lead {
      font: 500 21px/1.6 var(--sans);
      letter-spacing: 0.02em;
      color: var(--body);
      max-width: 400px;
      margin-top: 30px;
    }
    .pills { display: flex; flex-wrap: wrap; gap: 10px 12px; margin-top: 26px; }
    .pill {
      font: 600 14px/1 var(--sans);
      letter-spacing: 0.02em;
      color: var(--body);
      border: 1.5px solid #8d8b72;
      border-radius: 999px;
      padding: 11px 15px;
      white-space: nowrap;
    }
    .pill.free { background: var(--olive-2); border-color: var(--olive-2); color: #faf6f0; font-weight: 700; }
    .cta-row { display: flex; align-items: center; gap: 20px; margin-top: 30px; flex-wrap: wrap; }
    .cta-note { font: 600 13.5px/1.6 var(--sans); letter-spacing: 0.02em; color: var(--muted); max-width: 250px; }

    .hero-art { position: relative; min-height: 500px; padding-top: 50px; }
    .stack { position: relative; width: 330px; margin-left: 26%; }
    .polaroid {
      position: relative;
      background: var(--paper);
      padding: 16px 16px 0;
      box-shadow: 0 2px 4px rgba(60, 50, 30, 0.10), 0 10px 24px rgba(60, 50, 30, 0.10);
    }
    .polaroid img { width: 100%; aspect-ratio: 288 / 335; object-fit: cover; object-position: 50% 30%; }
    .polaroid figcaption {
      font-family: var(--script);
      font-weight: 500;
      font-size: 27px;
      color: var(--body);
      padding: 10px 6px 16px 20px;
    }
    .hero .polaroid { width: 100%; transform: rotate(-4.3deg); }
    .hero .polaroid .tape { top: -14px; left: 50%; margin-left: -58px; width: 116px; transform: rotate(0deg); }
    .teens-note {
      position: absolute;
      top: 10px;
      right: 0;
      font-family: var(--script);
      font-weight: 500;
      font-size: 26px;
      line-height: 1;
      color: var(--muted);
      text-align: center;
      transform: rotate(9deg);
    }
    .ticket {
      position: absolute;
      right: -132px;
      bottom: -70px;
      width: 255px;
      background: #9b4a1c;
      color: #faf6f0;
      padding: 20px 24px 18px;
      transform: rotate(9.6deg);
      box-shadow: 0 6px 16px rgba(60, 40, 20, 0.18);
    }
    .ticket::before {
      content: "";
      position: absolute;
      inset: 7px;
      border: 2px dashed rgba(250, 246, 240, 0.75);
      pointer-events: none;
    }
    .ticket .t-admit { font: 600 11.5px/1.6 var(--sans); letter-spacing: 0.25em; text-transform: uppercase; }
    .ticket .t-date { font: 500 28px/1.1 var(--serif); margin-top: 6px; }
    .ticket .t-time { font: 600 14px/1.6 var(--sans); letter-spacing: 0.02em; margin-top: 4px; }

    /* ---------- Why this talk ---------- */
    .why { background: var(--olive); color: #f2eddb; text-align: center; padding: 76px 0 92px; }
    .why .eyebrow { font-size: 11.5px; letter-spacing: 0.3em; color: #f2eddb; }
    .why h2 { font: 400 42px/1.2 var(--baskerville); letter-spacing: -0.01em; margin-top: 30px; }
    .why-lead { font: 700 19px/1.6 var(--sans); letter-spacing: 0.03em; max-width: 820px; margin: 34px auto 0; }
    .why-script { font-family: var(--script); font-weight: 500; font-size: 31px; line-height: 1.3; max-width: 860px; margin: 30px auto 0; }

    /* ---------- Audience cards ---------- */
    .audience { padding: 88px 0 56px; }
    .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 52px; align-items: start; }
    .card { position: relative; padding: 46px 38px 44px; box-shadow: 0 2px 4px rgba(60, 50, 30, 0.08), 0 12px 26px rgba(60, 50, 30, 0.08); }
    .card.parents {
      background-color: #fdfcf8;
      transform: rotate(-1deg);
    }
    .card.parents .tape { top: -12px; left: 34px; }
    .card.parents h3 { padding-bottom: 14px; border-bottom: 1.5px solid #e6e1d5; margin-left: -38px; margin-right: -38px; padding-left: 38px; padding-right: 38px; }
    .card.parents ul { gap: 0; margin-top: 10px; }
    .card.parents li { padding-top: 12px; padding-bottom: 12px; border-bottom: 1.5px solid #e6e1d5; }
    .card.parents li::before { top: 12px; }
    .card.teens { background: var(--peach); transform: rotate(1.4deg); }
    .card.teens .tape { top: -12px; right: 40px; }
    .card .eyebrow { font-size: 17px; }
    .card h3 { font: 600 27px/1.3 var(--serif); color: var(--ink-2); margin-top: 10px; }
    .card ul { margin-top: 26px; display: grid; gap: 16px; }
    .card li {
      position: relative;
      padding-left: 30px;
      font: 400 17.5px/1.5 var(--sans);
      letter-spacing: 0.02em;
      color: var(--ink-2);
    }
    .card li::before {
      content: "\\2192";
      position: absolute;
      left: 0;
      top: 0;
      color: var(--rust);
      font-weight: 700;
    }
    .card .sign {
      font-family: var(--script);
      font-weight: 500;
      font-size: 26px;
      color: var(--olive-2);
      text-align: right;
      margin-top: 40px;
    }

    /* ---------- Guest ---------- */
    .guest { padding: 56px 0 40px; }
    .guest-grid { display: grid; grid-template-columns: 340px minmax(0, 1fr); gap: 72px; align-items: start; }
    .guest .polaroid { transform: rotate(2.8deg); margin: 18px 0 0; }
    .guest .polaroid figcaption { font-size: 25px; color: var(--ink-2); text-align: center; padding: 14px 6px 22px; }
    .guest .polaroid .tape.l { top: -10px; left: -26px; transform: rotate(-38deg); }
    .guest .polaroid .tape.r { top: -4px; right: -26px; transform: rotate(38deg); }
    .guest h2 { font: 600 51px/1.2 var(--serif); color: var(--ink-2); margin-top: 10px; }
    .guest-role { font: 500 17.5px/1.5 var(--sans); letter-spacing: 0.02em; color: var(--olive-2); margin-top: 14px; }
    .guest-bio p { font: 400 18.3px/1.6 var(--sans); letter-spacing: 0.02em; color: var(--ink-2); margin-top: 16px; }
    .guest-bio p + p { margin-top: 24px; }
    .stats { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }
    .stat {
      background: #fbf8f1;
      border: 1px solid #e3dccb;
      padding: 12px 16px 14px;
      min-width: 148px;
      text-align: center;
      box-shadow: 0 1px 2px rgba(60, 50, 30, 0.06);
    }
    .stat:nth-child(1) { transform: rotate(-1deg); }
    .stat:nth-child(2) { transform: rotate(1.4deg); }
    .stat:nth-child(3) { transform: rotate(-1deg); }
    .stat b { display: block; font: 600 31px/1.4 var(--serif); color: var(--rust); }
    .stat span { font: 400 13.5px/1.5 var(--sans); letter-spacing: 0.02em; color: var(--ink-2); }

    /* ---------- Question card ---------- */
    .question { padding: 70px 0 100px; }
    .q-card {
      position: relative;
      max-width: 728px;
      margin: 0 auto;
      background: #fdfcf8;
      border-top: 5px solid var(--rust-btn);
      padding: 56px 40px 54px;
      text-align: center;
      transform: rotate(-1deg);
      box-shadow: 0 2px 4px rgba(60, 50, 30, 0.08), 0 12px 26px rgba(60, 50, 30, 0.08);
    }
    .q-card .tape { top: -18px; left: 50%; margin-left: -64px; width: 128px; }
    .q-card h2 { font: 600 39px/1.2 var(--serif); color: var(--ink-2); }
    .q-card p { font: 400 18.3px/1.6 var(--sans); letter-spacing: 0.02em; color: var(--ink-2); max-width: 560px; margin: 16px auto 0; }
    .q-card p.script { font: 500 30px/1.3 var(--script); letter-spacing: 0; color: var(--rust); margin-top: 22px; }

    /* ---------- Register ---------- */
    .register { background: var(--forest); color: #f6f0e6; padding: 96px 0 100px; }
    .reg-grid { display: grid; grid-template-columns: minmax(0, 1fr) 430px; gap: 64px; align-items: center; }
    .register .eyebrow { color: var(--khaki); font-weight: 600; }
    .register h2 { font: 400 48px/1.05 var(--vollkorn); letter-spacing: -0.02em; margin-top: 20px; }
    .reg-lead { font: 600 20.8px/1.5 var(--sans); letter-spacing: 0.02em; color: var(--sand); max-width: 590px; margin-top: 28px; }
    .register .script { font-size: 30px; color: var(--khaki); margin-top: 26px; }
    .form-card {
      position: relative;
      background: #f3eee4;
      color: #313b25;
      padding: 40px 36px 40px;
      transform: rotate(1.1deg);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
    }
    .form-card .tape { top: -14px; left: 52px; }
    .form-card h3 { font: 400 34px/1.05 var(--vollkorn); letter-spacing: -0.02em; }
    .form-meta { font: 600 14.7px/1.5 var(--sans); letter-spacing: 0.02em; color: #6b705c; margin-top: 12px; }
    form { margin-top: 18px; display: grid; gap: 16px; }
    label { display: grid; gap: 8px; font: 700 14.7px/1.5 var(--sans); letter-spacing: 0.02em; }
    input {
      width: 100%;
      height: 50px;
      border: 1.5px solid #d6ccb4;
      border-radius: 4px;
      background: #fdfbf6;
      font: 500 17px/1.2 var(--sans);
      color: #313b25;
      padding: 0 14px;
    }
    form .btn { width: 100%; margin-top: 18px; padding: 15px 20px; }
    form .btn[disabled] { opacity: 0.7; cursor: progress; }
    .form-note { font: 600 14.2px/1.25 var(--sans); letter-spacing: 0.02em; color: #6b705c; text-align: center; margin-top: 18px; }
    .form-msg { font: 600 15px/1.5 var(--sans); text-align: center; margin-top: 12px; min-height: 0; }
    .form-msg.error { color: #9b2a1c; }
    .form-done { text-align: center; padding: 26px 0 10px; }
    .form-done h4 { margin: 0; font: 400 30px/1.15 var(--vollkorn); }
    .form-done p { font: 500 17px/1.6 var(--sans); color: #47473d; margin-top: 12px; }
    .form-done p.script { font: 500 27px/1.3 var(--script); color: var(--rust); margin-top: 14px; }

    /* ---------- Footer ---------- */
    .foot { background: var(--footer); color: #3f4731; text-align: center; padding: 56px 0 36px; }
    .foot h2 { font: italic 600 28.7px/1 var(--serif); letter-spacing: -0.02em; }
    .foot .disclaimer { font: 400 13.6px/1.7 var(--sans); letter-spacing: 0.02em; max-width: 500px; margin: 26px auto 0; }
    .foot .logo-link { width: 126px; margin: 30px auto 0; }
    .foot .logo { width: 100%; }
    .foot .contact { font: 400 12px/1.7 var(--sans); letter-spacing: 0.02em; margin-top: 22px; }
    .foot a { color: #9b5b3a; font-weight: 500; }

    /* ---------- Large screens ---------- */
    @media (min-width: 1600px) {
      :host { --max: 1240px; }
    }

    /* ---------- Tablet ---------- */
    @media (max-width: 1024px) {
      .hero h1 { font-size: 58px; }
      .hero-grid { gap: 32px; }
      .hero-art { padding-bottom: 70px; }
      .stack { width: 270px; margin-left: 6%; }
      .ticket { right: -88px; bottom: -112px; width: 222px; }
      .pills { gap: 8px; }
      .pill { font-size: 13px; padding: 9px 12px; }
      .teens-note { right: -6px; }
      .cards { gap: 36px; }
      .card { padding: 42px 28px 40px; }
      .guest-grid { grid-template-columns: 280px minmax(0, 1fr); gap: 48px; }
      .guest h2 { font-size: 44px; }
      .reg-grid { grid-template-columns: minmax(0, 1fr) 380px; gap: 40px; }
      .register h2 { font-size: 42px; }
    }

    /* ---------- Mobile ---------- */
    @media (max-width: 860px) {
      .hero { padding: 24px 0 64px; }
      .logo { width: 104px; }
      .event-tag { font-size: 10px; letter-spacing: 0.18em; }
      .hero-grid { grid-template-columns: 1fr; margin-top: 32px; gap: 40px; }
      .hero-kicker { font-size: 26px; }
      .hero h1 { font-size: clamp(42px, 12vw, 54px); margin-top: 20px; }
      .hero-lead { font-size: 18px; margin-top: 20px; }
      .pill { font-size: 13px; padding: 10px 13px; }
      .hero-art { min-height: 0; padding-bottom: 96px; max-width: 360px; margin: 0 auto; width: 100%; }
      .hero-art { padding-top: 24px; padding-bottom: 150px; }
      .stack { width: min(76%, 270px); margin-left: 4%; }
      .teens-note { font-size: 22px; top: 0; right: 4px; }
      .ticket { right: -26%; bottom: -128px; width: 214px; padding: 16px 18px 14px; }
      .ticket .t-date { white-space: nowrap; }
      .ticket .t-date { font-size: 24px; }

      .why { padding: 56px 0 64px; }
      .why h2 { font-size: 31px; margin-top: 20px; }
      .why-lead { font-size: 17px; margin-top: 24px; }
      .why-script { font-size: 25px; margin-top: 22px; }

      .audience { padding: 64px 0 32px; }
      .cards { grid-template-columns: 1fr; gap: 48px; }
      .card { padding: 40px 22px 34px; }
      .card.parents h3 { margin-left: -22px; margin-right: -22px; padding-left: 22px; padding-right: 22px; }
      .card h3 { font-size: 23px; }
      .card li { font-size: 16.5px; }
      .card .eyebrow { font-size: 14px; }
      .card .sign { font-size: 23px; margin-top: 28px; }

      .guest { padding: 40px 0 24px; }
      .guest-grid { grid-template-columns: 1fr; gap: 40px; }
      .guest .polaroid { width: min(80%, 290px); margin: 18px auto 0; }
      .guest .eyebrow { font-size: 14px; }
      .guest h2 { font-size: 38px; }
      .guest-bio p { font-size: 16.5px; }
      .stats { gap: 10px; }
      .stat { min-width: 0; flex: 1 1 0; padding: 10px 8px 12px; }
      .stat b { font-size: 25px; }
      .stat span { font-size: 12px; display: block; }

      .question { padding: 48px 0 72px; }
      .q-card { padding: 44px 20px 40px; }
      .q-card h2 { font-size: 29px; }
      .q-card p { font-size: 16.5px; }
      .q-card .script { font-size: 25px; }

      .register { padding: 64px 0 72px; }
      .reg-grid { grid-template-columns: 1fr; gap: 48px; }
      .register .eyebrow { font-size: 13px; }
      .register h2 { font-size: 36px; }
      .reg-lead { font-size: 18px; }
      .register .script { font-size: 26px; }
      .form-card { padding: 34px 20px 30px; transform: rotate(0.6deg); }
      .form-card h3 { font-size: 30px; }

      .foot h2 { font-size: 24px; }
    }

    @media (min-width: 861px) and (max-width: 960px) {
      .pills { gap: 6px; }
      .pill { font-size: 12.5px; padding: 8px 10px; }
    }

    /* ---------- Phones ---------- */
    @media (max-width: 560px) {
      .event-tag { max-width: 170px; }
      .cta-row { gap: 14px; }
      .cta-row .btn { width: 100%; }
      .cta-note { max-width: none; text-align: center; width: 100%; }
    }

    @media (max-width: 400px) {
      .ticket { width: 192px; right: -18%; bottom: -132px; padding: 14px 16px 12px; }
      .ticket .t-admit { font-size: 10px; letter-spacing: 0.2em; }
      .ticket .t-date { font-size: 22px; }
      .ticket .t-time { font-size: 12.5px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .btn { transition: none; }
    }
  `;

  const HTML = /* html */ `
    <section class="hero dotted">
      <div class="wrap">
        <div class="topbar">
          <a class="logo-link" href="https://www.dinnertable.com/"><img class="logo" src="${LOGO}" alt="Dinner Table home" width="126" height="33"></a>
          <p class="event-tag">Expert Talks - A Dinner Table Event</p>
        </div>
        <div class="hero-grid">
          <div>
            <p class="hero-kicker">This month at the table...</p>
            <h1 class="balance">Behind the Behavior</h1>
            <p class="hero-lead pretty">How to start honest conversations about mental health and substance use, before your kid needs&nbsp;them.</p>
            <ul class="pills" aria-label="Event details">
              <li class="pill">Sat, Oct 17</li>
              <li class="pill">1:00-2:00 PM EDT</li>
              <li class="pill">Live webinar</li>
              <li class="pill free">Free</li>
            </ul>
            <div class="cta-row">
              <a class="btn" href="#register" data-scroll>Save My Seat</a>
              <p class="cta-note pretty">Can't make it live? Register anyway and we'll send the&nbsp;replay.</p>
            </div>
          </div>
          <div class="hero-art">
            <div class="stack">
              <figure class="polaroid" style="margin:0">
                <span class="tape" aria-hidden="true"></span>
                <img src="${HEADSHOT}" alt="Shane Watson" width="284" height="321">
                <figcaption>Shane Watson</figcaption>
              </figure>
              <div class="ticket" aria-label="Admit one family: Saturday, October 17, 1 PM EDT, online">
                <p class="t-admit">Admit One Family</p>
                <p class="t-date">Sat · Oct 17</p>
                <p class="t-time">1 PM EDT · Online</p>
              </div>
            </div>
            <p class="teens-note" aria-hidden="true">Teens<br>welcome!</p>
          </div>
        </div>
      </div>
    </section>

    <section class="why">
      <div class="wrap">
        <p class="eyebrow">Why this talk</p>
        <h2 class="balance">The conversation most families put off</h2>
        <p class="why-lead balance">Most parents know they should talk with their kids about mental health and substance use. Fewer know how to start without it turning into a lecture or a closed door.</p>
        <p class="why-script balance">That's not you doing it wrong. Nobody handed you a plan for this conversation. Let's build one together.</p>
      </div>
    </section>

    <section class="audience dotted">
      <div class="wrap">
        <div class="cards">
          <article class="card parents">
            <span class="tape" aria-hidden="true"></span>
            <p class="eyebrow">For parents</p>
            <h3 class="balance">You'll walk away knowing how to:</h3>
            <ul>
              <li>Notice early signs that something's off</li>
              <li class="pretty">Open hard conversations without shutting your kid down</li>
              <li>Set tech boundaries without a daily battle</li>
              <li class="pretty">Talk about bullying, whether your kid is going through it, seeing it, or part of it</li>
            </ul>
          </article>
          <article class="card teens">
            <span class="tape" aria-hidden="true"></span>
            <p class="eyebrow">For teens</p>
            <h3>Teens are welcome too.<br>They'll hear:</h3>
            <ul>
              <li>Why asking for help takes strength</li>
              <li class="pretty">How to build resilience before a hard season hits</li>
              <li class="pretty">What healthy coping really looks like (and what only looks healthy)</li>
            </ul>
            <p class="sign">Pull up a chair together <span aria-hidden="true">♡</span></p>
          </article>
        </div>
      </div>
    </section>

    <section class="guest dotted">
      <div class="wrap guest-grid">
        <figure class="polaroid">
          <span class="tape l" aria-hidden="true"></span>
          <span class="tape r" aria-hidden="true"></span>
          <img src="${HEADSHOT}" alt="" width="284" height="321">
          <figcaption class="balance">14 years in, still showing&nbsp;up</figcaption>
        </figure>
        <div>
          <p class="eyebrow">Meet our guest</p>
          <h2>Shane Watson</h2>
          <p class="guest-role balance">Mental health educator, recovery coach, and parent</p>
          <div class="guest-bio">
            <p class="pretty">Shane has spent 14 years working in mental and behavioral health, and he's 14 years into his own long-term recovery. He's spoken at more than 600 schools, companies, and conferences across the U.S., appeared on the Today Show, PBS, Good Day New York, and Kansas City Live, and hosts the Silverladder Podcast on parenting and mental health.</p>
            <p class="pretty">He brings the research and the real story, and he talks to parents like a person, not a&nbsp;pamphlet.</p>
          </div>
          <ul class="stats">
            <li class="stat"><b>14</b><span>years in the field</span></li>
            <li class="stat"><b>600+</b><span>talks across <span class="nowrap">the U.S.</span></span></li>
            <li class="stat"><b>100+</b><span>media interviews</span></li>
          </ul>
        </div>
      </div>
    </section>

    <section class="question dotted">
      <div class="wrap">
        <div class="q-card">
          <span class="tape" aria-hidden="true"></span>
          <h2 class="balance">Bring your question to the table</h2>
          <p class="balance">This is a live, interactive session. Ask about your own family, a specific worry, or simply where to start.</p>
          <p class="script">No question is too small</p>
        </div>
      </div>
    </section>

    <section class="register" id="register">
      <div class="wrap reg-grid">
        <div>
          <p class="eyebrow">Why we're having this talk</p>
          <h2>Capable kids know<br>where they belong.</h2>
          <p class="reg-lead pretty">A home where hard things can be said out loud is a home kids come back to, especially when life gets&nbsp;heavy.</p>
          <p class="script">Free · Live · Replay included</p>
        </div>
        <div class="form-card">
          <span class="tape" aria-hidden="true"></span>
          <div data-form-body>
            <h3>Save your seat</h3>
            <p class="form-meta balance"><span class="nowrap">Sat, Oct 17</span> · <span class="nowrap">1:00-2:00 PM EDT</span> · <span class="nowrap">Online</span></p>
            <form novalidate>
              <label>First name
                <input name="firstName" type="text" autocomplete="given-name" required maxlength="80">
              </label>
              <label>Email
                <input name="email" type="email" autocomplete="email" required maxlength="200">
              </label>
              <button class="btn" type="submit">Save My Seat</button>
              <p class="form-msg" role="status" aria-live="polite"></p>
            </form>
            <p class="form-note">Can't make it live? Register anyway and we'll send the&nbsp;replay.</p>
          </div>
          <div class="form-done" data-form-done hidden>
            <h4>You're on the list.</h4>
            <p class="pretty">We'll email your link before Sat, Oct 17, and the replay after the talk.</p>
            <p class="script">See you at the table</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="foot">
      <div class="wrap">
        <h2>Raising Capable Kids.</h2>
        <p class="disclaimer pretty">This session is for learning and conversation. It isn't a substitute for professional care. If your child is in crisis, call or text 988 (Suicide &amp; Crisis Lifeline) or contact emergency services.</p>
        <a class="logo-link" href="https://www.dinnertable.com/"><img class="logo" src="${LOGO}" alt="Dinner Table home" width="126" height="33"></a>
        <p class="contact">Questions? Email us at <a href="mailto:hello@dinnertable.com">hello@dinnertable.com</a></p>
      </div>
    </footer>
  `;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const RESPONSE_TIMEOUT_MS = 15000;

  class DtExpertTalks extends HTMLElement {
    static get observedAttributes() {
      return ["status"];
    }

    connectedCallback() {
      if (this.shadowRoot) return;
      ensureFonts();
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `<style>${CSS}</style>${HTML}`;

      root.querySelectorAll("[data-scroll]").forEach((a) =>
        a.addEventListener("click", (e) => {
          e.preventDefault();
          root.getElementById("register").scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => root.querySelector('input[name="firstName"]').focus({ preventScroll: true }), 600);
        }),
      );

      this._form = root.querySelector("form");
      this._msg = root.querySelector(".form-msg");
      this._btn = this._form.querySelector("button");
      this._form.addEventListener("submit", (e) => this._onSubmit(e));
    }

    attributeChangedCallback(name, _old, value) {
      if (name !== "status" || !this.shadowRoot) return;
      if (value === "success") this._done();
      else if (value === "error") this._fail();
    }

    _onSubmit(e) {
      e.preventDefault();
      const firstName = this._form.firstName.value.trim();
      const email = this._form.email.value.trim();
      if (!firstName) return this._error("Please add your first name.", this._form.firstName);
      if (!EMAIL_RE.test(email)) return this._error("Please enter a valid email.", this._form.email);

      this._msg.textContent = "";
      this._msg.classList.remove("error");
      this._btn.disabled = true;
      this._btn.textContent = "Saving…";
      this.removeAttribute("status");
      clearTimeout(this._timer);
      this._timer = setTimeout(() => this._fail(), RESPONSE_TIMEOUT_MS);
      this.dispatchEvent(
        new CustomEvent("register", { detail: { firstName, email }, bubbles: true, composed: true }),
      );
    }

    _error(text, field) {
      this._msg.textContent = text;
      this._msg.classList.add("error");
      field.focus();
    }

    _done() {
      clearTimeout(this._timer);
      this.shadowRoot.querySelector("[data-form-body]").hidden = true;
      this.shadowRoot.querySelector("[data-form-done]").hidden = false;
    }

    _fail() {
      clearTimeout(this._timer);
      this._btn.disabled = false;
      this._btn.textContent = "Save My Seat";
      this._msg.innerHTML =
        'Something went wrong. Please try again, or email <a href="mailto:hello@dinnertable.com">hello@dinnertable.com</a>.';
      this._msg.classList.add("error");
    }
  }

  customElements.define(TAG, DtExpertTalks);
})();
