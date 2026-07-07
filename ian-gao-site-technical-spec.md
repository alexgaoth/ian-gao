# ian-gao.com — Technical Build Spec (SEO priority, GEO secondary)

Purpose of this doc: give a coding agent (or a human) everything needed to build the site correctly the first time, without re-litigating stack decisions mid-build. SEO is the priority; GEO (visibility in AI answer engines like Google AI Overviews, ChatGPT, Perplexity) is optimized in parallel wherever it doesn't conflict with SEO.

---

## 1. Locked Decisions

| Item | Decision | Why |
|---|---|---|
| Domain | ian-gao.com (already purchased) | exact-ish name match, clean, memorable |
| Framework | Astro | zero-JS by default, best Core Web Vitals, native MDX, built-in sitemap/RSS |
| Hosting | Cloudflare Pages | free, global edge network, same platform as DNS, no ad-driven AI-bot blocking concerns since site has no ads |
| Canonical domain form | apex, `ian-gao.com` (not `www.ian-gao.com`) | fewer redirect hops, simpler; redirect www → apex |
| Content format | MDX files in repo (`/src/content/writing/*.mdx`) | git-based, fast, no CMS dependency, agent-friendly |

If any of these get overridden later, update this table first so the spec stays the source of truth.

---

## 2. Stack Detail

**Framework: Astro**
- Use Astro's Content Collections API for the writing/blog section (`src/content/writing/`), typed frontmatter (title, description, pubDate, updatedDate, tags).
- Any interactive component (theme toggle, filter, etc.) should be a Svelte island (`client:idle` or `client:visible` directive), not React, to keep shipped JS minimal. Only hydrate what actually needs interactivity.
- Static output mode (`output: 'static'` in `astro.config.mjs`), not SSR — nothing here needs a server at request time.

**Hosting: Cloudflare Pages**
- Connect the git repo directly, auto-deploy on push to `main`.
- Enable "Always Use HTTPS" and HSTS.
- DNS: A/AAAA or CNAME for apex pointing to Pages, `www` as a CNAME redirect to apex (301, not a separate crawlable copy of the site — avoids duplicate content).
- No ads on this site, so the Sept 15, 2026 Cloudflare default (blocking Training/Agent-classified bots on ad-monetized pages) does not apply here. Nothing to configure on that front, just don't add ad scripts later without reconsidering it.

---

## 3. Technical SEO Requirements

### Sitemap
- Use `@astrojs/sitemap` integration. Auto-generates `/sitemap-index.xml` and `/sitemap-0.xml` at build time.
- Submit to Google Search Console and Bing Webmaster Tools immediately after first deploy — do not wait for organic crawl discovery.

### robots.txt
- Place at `public/robots.txt`. Explicitly allow all standard search and AI crawlers (nothing to hide, we want maximum legitimate visibility):

```
User-agent: *
Allow: /

Sitemap: https://ian-gao.com/sitemap-index.xml
```

- Do not add blanket AI-bot disallows anywhere. GEO visibility depends on these crawlers being able to fetch content.

### Canonical URLs
- Every page gets a `<link rel="canonical" href="https://ian-gao.com/...">` tag pointing to itself, set in a shared `<BaseHead />` component so it's impossible to forget on a new page.

### Structured Data (JSON-LD)
- Homepage: `Person` schema — name, alternateName (if using a nickname), url, sameAs (array of any verified external profiles: LinkedIn, GitHub, school debate page if it has a profile URL), description.
- Each writing piece: `BlogPosting` or `Article` schema — headline, author (reference back to the Person schema), datePublished, dateModified, description.
- Implement via a small typed helper (e.g. `src/lib/schema.ts`) that generates the JSON-LD object, injected in `<script type="application/ld+json">` in the page `<head>`.

### Meta tags / Open Graph
- Every page: unique `<title>`, unique `<meta name="description">` (under ~155 chars), Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`), Twitter Card tags.
- Title tag pattern: `{Page Title} — Ian Gao` (name at the end for content pages, name-first only on homepage).

### URL structure
- Keep it flat and human-readable: `/writing/{slug}`, `/about`, `/activities` (or similar). No query-string based routing, no unnecessary nesting.

---

## 4. GEO (Generative Engine Optimization) Requirements

These are additive to the SEO section above, not a replacement.

- **llms.txt**: add a plain-text `public/llms.txt` at root, following the emerging convention — a short, structured plain-English summary of who the site belongs to and what's on it, with links to key pages. This is explicitly meant for AI crawlers/answer engines to consume directly instead of parsing rendered HTML.
- **Static, fully-rendered HTML**: Astro's static output already satisfies this — AI crawlers frequently don't execute JavaScript well, so a page that requires client-side rendering to show content is invisible to a large share of GEO traffic. Do not convert this to an SPA-style client-rendered app later.
- **RSS feed**: `@astrojs/rss` for the writing section. Some AI/answer-engine crawlers and aggregators still prefer feeds over crawling for freshness signals.
- **Quotable, self-contained content**: each writing piece should be able to stand alone and answer "who is this and why does this matter" without requiring the reader to have other context — this is as much a GEO retrieval concern as a human UX one.
- **Entity consistency**: name, school, and activity references should be written identically across pages (don't alternate "Ian Gao" / "Ian Tianyi Gao" / "Tian Yi Gao" without a clear canonical form) — entity disambiguation systems reward consistency.

---

## 5. Performance / Core Web Vitals

- Images: served as WebP/AVIF via Astro's built-in `<Image />` component, lazy-loaded except the LCP (largest contentful paint) element on each page.
- No render-blocking third-party scripts in `<head>`. Analytics (see below) loaded async/deferred.
- Target: LCP < 2.5s, INP < 200ms, CLS < 0.1, measured via Search Console's Core Web Vitals report post-launch, not just Lighthouse locally.

---

## 6. Analytics & Monitoring

- **Google Search Console**: mandatory, set up day one, verify via DNS TXT record. This is the single most important feedback loop for the whole project — it shows which queries are actually getting impressions.
- **Bing Webmaster Tools**: also submit here, low effort, covers Bing/ChatGPT (which uses Bing's index for some retrieval).
- **Cloudflare Web Analytics**: privacy-friendly, no cookie banner required, lightweight — preferred over GA4 for a site this size where GA4's heavier script isn't worth the performance cost.

---

## 7. Existing Assets to Integrate (backlink leverage)

Ian already has indexable external mentions. Link out to them from the site (and where possible, get them to link back):
- School debate team page/profile
- School newspaper article covering his track and debate activity

Action items:
- Add both as citations/links on an "About" or "Press" section of the site.
- If either page can be edited (e.g. the debate team site lists member links), ask whoever maintains it to add a link back to ian-gao.com. That's a real, legitimate backlink from an already-indexed page, which is worth more than almost anything done on-site alone.

---

## 8. Content Architecture

Suggested minimum page set:
- `/` — homepage, Person schema, short bio, links to writing and activities
- `/writing/` — index of essays, each individual post at `/writing/{slug}`
- `/about` — longer bio, background, credentials
- `/activities` — debate, track, other ECs, each ideally linking to the external indexed proof (school article, results page, etc.)

---

## 9. Open Decisions (need answers before final build, not blocking scaffolding)

- [ ] Will Ian write/edit posts himself via git + MDX, or does this need a lightweight CMS UI (e.g. Tina CMS, Decap CMS) so he's not touching code directly?
- [ ] Does the site need a Chinese-language version or section, given his name Tian Yi? If yes, need an i18n approach decided before content structure is finalized.
- [ ] Any contact form needed? If yes, that's the one place a small serverless function (Cloudflare Pages Functions) or a form service (Formspree, etc.) comes in — still doesn't require Railway.
- [ ] Target application deadline (EA/November vs RD/January) — determines content publishing cadence for the next few months.

---

## 10. Launch Checklist

- [ ] Domain DNS pointed to Cloudflare Pages, HTTPS enforced, www → apex redirect working
- [ ] Sitemap generating correctly, submitted to Search Console and Bing Webmaster Tools
- [ ] robots.txt live and correct
- [ ] Person schema on homepage validated (Google's Rich Results Test)
- [ ] BlogPosting schema on at least one post validated
- [ ] llms.txt present at root
- [ ] RSS feed live and valid
- [ ] Core Web Vitals checked in Search Console after first crawl
- [ ] Backlinks from debate site / school article added or requested
