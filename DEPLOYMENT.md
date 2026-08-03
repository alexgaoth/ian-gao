# Deploying ian-gao.com

This is the checklist for taking the site from "built" to "live and indexed." Everything up to this point (the Astro
site itself) is done and verified — see the build notes at the bottom. This document is what's left, and it's meant
to be carried out by you (or Ian), not by the coding agent, since it involves account access, DNS, and domain
ownership.

## 2. Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Select the repo you just pushed.
3. Build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist/client` — the Cloudflare adapter emits static assets there, not
     into `dist/` (which also holds an empty `server/`). Pointing Pages at `dist` deploys nothing.
   - **Node version**: 20 or later (set `NODE_VERSION=20` as an environment variable if Cloudflare doesn't pick it
     up automatically — this repo was built and tested against Node 24)
4. Deploy. Cloudflare will give you a `*.pages.dev` URL first — confirm the site loads there before wiring up the
   custom domain.

---

## 3. Domain & DNS

Per the spec, the canonical domain is the apex `ian-gao.com`, with `www` redirecting to it (not serving a separate
copy).

1. In Cloudflare Pages → your project → **Custom domains**, add `ian-gao.com`.
2. If DNS for `ian-gao.com` isn't already on Cloudflare, move nameservers there first (Cloudflare will walk you
   through this when you add the domain to your account).
3. Add `www` as a second custom domain in the same Pages project, then set up a redirect so it 301s to the apex
   rather than serving content — Cloudflare Pages does this automatically when you add both apex and `www` as
   custom domains on the same project (it redirects the non-primary one). Confirm this actually redirects (`curl -I
   https://www.ian-gao.com` should show a `301`/`308` to `https://ian-gao.com`), not silently serve a duplicate.
4. **SSL/TLS** → set encryption mode to **Full (strict)**.
5. **SSL/TLS → Edge Certificates** → enable **Always Use HTTPS** and **HSTS** (per the spec).

---

## 4. Search Console & Bing Webmaster Tools

Do this immediately after the domain is live — don't wait for organic crawl discovery.

1. **Google Search Console** (search.google.com/search-console):
   - Add property, domain-level, `ian-gao.com`.
   - Verify via DNS TXT record (Cloudflare DNS → add the TXT record GSC gives you).
   - Once verified, submit `https://ian-gao.com/sitemap-index.xml` under Sitemaps.
2. **Bing Webmaster Tools** (bing.com/webmasters):
   - You can import directly from a verified Google Search Console property (faster) or verify separately via DNS
     TXT the same way.
   - Submit the same sitemap URL.

---

## 5. Cloudflare Web Analytics

Per the spec, this is the preferred analytics tool (privacy-friendly, no cookie banner, lightweight) over GA4.

1. Cloudflare dashboard → **Analytics & Logs → Web Analytics** → add a site for `ian-gao.com`.
2. Cloudflare gives you a JS snippet with a unique beacon token. Add it as a single `<script defer>` tag in
   `src/components/BaseHead.astro`, near the other `<script>`/`<link>` tags — this wasn't added automatically since
   it requires a token from your Cloudflare account.

---

## 6. Validate structured data

Once live:

1. Run the homepage through Google's Rich Results Test (search.google.com/test/rich-results) — should validate the
   `Person` schema.
2. Once at least one post exists in `/writing/`, run that post's URL through the same tool — should validate
   `BlogPosting`.

---

## 7. Core Web Vitals

Local Lighthouse runs during the build (desktop, unthrottled) came back perfect — 100/100 on Performance,
Accessibility, Best Practices, and SEO on every page, LCP ~0.5s, CLS 0.012, zero blocking JS. Lighthouse's default
mobile simulation (4x CPU throttle + slow 4G) reports a much worse LCP (~4s); that's the simulated-throttle number,
not a real-device number, and per the spec's own guidance the number that actually matters is **Search Console's
Core Web Vitals report using real field data**, not a local lab run. Check that report ~2–4 weeks after launch once
Chrome UX Report has enough real visits to populate it. If it does show a slow mobile LCP, the first lever to pull
is self-hosting the one remaining Google Font (Newsreader — Archivo and Caveat were dropped in the Aug 2026
redesign) instead of loading it from `fonts.googleapis.com`. Note this is already measurable: under Lighthouse's
default *simulated* slow-4G mobile profile the homepage scores perf 0.85 with LCP 3.4s, and the LCP breakdown is 87%
render delay attributable to that cross-origin stylesheet — not to any image. Under `--throttling-method=provided`
the same page measures LCP 0.2-0.3s. Self-hosting the single woff2 removes the critical-path hop.

---

## Open items — need your input before the site is fully "done"

These were deliberately left as honest placeholders rather than faked, per the project's own ground rules. Nothing
is broken without them, but the site is more convincing with them:

- **Photos (Aug 2026 — mostly resolved).** Ian's photo set has been delivered and wired in: the hero uses
  `Ian main picture`, the favicon/apple-touch-icon are generated from `website logo picture` (his face),
  `Ian with Matt mahan` sits beside the existing campaign photo, `Ian theater 4/5/6` run as a row in the Theatre
  section, and all 13 gallery images are on `/gallery`. **Still missing: `ian theater 1`, `ian theater 2` and
  `ian theater 3`** — they exist in Ian's Drive but were not in the download. Drop them in `src/assets/theatre/`
  and add them to the row in `src/pages/index.astro`.
- **Which theatre photo belongs to which production?** Ian numbered the theatre stills without naming the shows, so
  they are shown as an unattributed row rather than guessed into specific productions. Each production row already
  has a working `photo?` slot — tell the agent which still goes with which show and it becomes a one-line change per
  photo, no CSS edit.
- **Per-photo gallery captions.** Ian said he'd write "small subtitles" for each gallery photo later. Each entry in
  `src/pages/gallery.astro` has an empty `caption` field that renders only when filled — none were invented.
- **LinkedIn URL.** Not included anywhere — there was no confirmed URL to link to. Add it to `src/lib/site.ts`
  (`SITE.sameAs`) and to the contact section on the homepage once you have it.
- **Backlink URLs.** As of Aug 2026 the "Elsewhere" section on `/about` renders **nothing** — the empty
  "(link pending)" placeholder shelf was removed deliberately (it announced that people write about Ian without
  linking to anything). The section reappears automatically as soon as real URLs exist: add
  `{ label, href }` entries to `pressMentions` in `src/pages/about.astro`. The two expected entries are the Leland
  Speech & Debate team page and the school newspaper article. Per the spec, it's worth asking whoever maintains
  those pages to link back to ian-gao.com — a real backlink from an already-indexed page.
- **"What I believe" section.** Ian asked for more "what I believe in" rather than what he is. `src/data/beliefs.ts`
  exports an empty array and the homepage section renders nothing until it is filled. **Nothing was written on his
  behalf** — this needs his own words, in his own voice.
- **Phone number.** The resume lists a personal cell number; it was deliberately left off every public page. A
  minor's phone number on an indexed site is a spam/harassment surface with no real upside over the email address
  already in use — flagging this rather than silently omitting it in case you want it included anyway.

### Decisions only Ian can make (from the Aug 2026 review pass)

These came out of implementing Ian's own written feedback. Each was deliberately **not** decided by the agent.

- **GPA / SAT / AP block on `/about`.** Currently reads "4.33 weighted GPA, 4.00 unweighted, 1540 SAT" plus the six
  AP courses. This is the most admissions-officer-only content on the site, and Ian wrote that his "target audience
  shouldn't be just AOs" and that he's worried classmates will search "Ian Gao Leland" and find the site. It was
  kept because deleting a true accomplishment isn't the agent's call. Three options: (a) keep as-is, (b) drop the
  scores and keep the AP course list, (c) drop the block. There is an `OPEN DECISION FOR IAN` comment at the code
  site in `src/pages/about.astro`.
- **Should `/activities` exist at all?** It is the most résumé-like page on the site and largely duplicates the
  homepage sections (only Track & Field is unique to it). Retiring it would serve the "less resume listing" goal,
  but it's a content deletion, so it's Ian's call. It is currently linked from the footer so it isn't orphaned.
- **Confirm the INT 93LS grade.** "Earned an A in INT 93LS" appears in Ian's review doc but *not* in his resume.
  Worth confirming before it's indexed and ingested by answer engines.
- **`gallery 2` shows another, apparently young, person** ("my favorite photo of gloria"). Included because Ian
  designated it a gallery photo, but worth a consent check before the site is public.
- **The Mahan group photo appears twice** — `gallery 3` and `Ian with Matt mahan` are the same scene, and Ian asked
  for the photo in both places (gallery list *and* the Campaigning section). Both are shown as instructed; say the
  word if you'd rather it appear only once.
- **The accent colour is still teal.** Ian wrote "Change color, I agree the green is pretty impersonal". The page
  *background* changed completely (dark teal chrome → warm paper) and the brass/oxblood accents are gone, which is
  most of what read as impersonal — but the single remaining accent, `#1e4a4d`, is very close to the retired
  `#1d4748`. If he wants a genuinely different hue, it is one variable in `src/styles/global.css`.
- **First essays.** `/writing/` is wired up end-to-end (collection schema, RSS, individual post template with
  `BlogPosting` JSON-LD) but empty — it shows an honest "nothing published yet" state rather than fabricated sample
  posts. Add `.mdx` files to `src/content/writing/` whenever the first essay is ready; frontmatter needs `title`,
  `description` (≤160 chars), `pubDate`, optionally `updatedDate` and `tags`.
- **Chinese-language version.** Still an open decision per the spec (section 9) — not started. The only Chinese-name
  reference currently on the site is "Tianyi Gao" as a low-key alternate name (About page body text + footer +
  `llms.txt`), per your instruction to de-prioritize it; no Chinese characters were used anywhere since none were
  confirmed.
- **Git-based MDX vs. lightweight CMS.** Also open per the spec. The site is built assuming Ian edits `.mdx` files
  directly in git — if that's the wrong call for how he'll actually maintain it, this is worth deciding before he's
  expected to publish the first essay.

---

## What's already built (for reference)

- Astro 7, static output, `@astrojs/mdx` + `@astrojs/sitemap` + `@astrojs/rss`.
- Design: "The Study" from the Claude Design export, Deep Teal palette, baked as static CSS custom properties (no
  client-side theme picker shipped).
- Pages: `/`, `/about`, `/activities`, `/gallery`, `/writing/` + `/writing/[slug]`, plus `robots.txt`, `llms.txt`, `rss.xml`,
  `sitemap-index.xml`.
- `Person` JSON-LD on the homepage, `BlogPosting` JSON-LD wired into the post template for whenever posts exist.
- All content is the real resume Ian provided — no fabricated tournament results, quotes, or credentials. Where the
  original design mockup had invented flavor text (a reading list, essay titles, "#20/Captain"), it was replaced
  with his actual record (19th nationally, President) or removed.
