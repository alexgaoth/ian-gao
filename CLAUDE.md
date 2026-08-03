# CLAUDE.md — ian-gao.com Build & Iteration Instructions

This file is read at the start of every Claude Code session in this repo. Read it, then read `ian-gao-site-technical-spec.md` in the same folder before writing any code. That file is the technical source of truth (framework, hosting, SEO/GEO requirements). This file governs how to *build and iterate* without breaking any of it.

## What this project is

A personal site for Ian Gao, rising senior, built primarily to support college admissions visibility. It needs to rank well (SEO priority, GEO secondary — see spec doc) and it needs to feel like an actual person, not a template. Both things matter equally to whether this project succeeds.

## Inputs in this folder

- `ian-gao-site-technical-spec.md` — stack, hosting, SEO/GEO technical requirements. Non-negotiable.
- `Tianyi (Ian) Gao Resume.md` — factual backing for credentials.
- Google Doc "Ian Gao Site — Text for Review", id `17g9jhWdamCh4IYN5vEgSWrXsRY3brRHkDL72lilMZqk` — Ian's own copy edits and design feedback, and he keeps editing it between sessions. **Re-fetch it before any content change. Where it conflicts with the resume, the Doc wins** — it is newer and it is him. (Settled example: the team is "third in California", not the resume's "3rd in the nation".)
- The Claude Design export ("The Study" — dark teal chrome, brass accents, ticker) was built, then deliberately replaced in Aug 2026 after Ian's review. Don't reinstate it.

## Non-negotiables (do not regress these, ever, across any iteration)

Pull the full detail from the spec doc, but at minimum, every iteration must still have:
- Valid sitemap at `/sitemap-index.xml`
- `robots.txt` allowing all crawlers, no accidental blanket disallows
- `Person` JSON-LD on homepage, `BlogPosting`/`Article` JSON-LD on every writing post
- Unique title + meta description per page
- `rel=canonical` on every page
- Core Web Vitals in the green (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- `llms.txt` present at root

If a design change would break any of the above (e.g. a hero animation that tanks LCP, a client-rendered blog list that hides content from crawlers), flag it before building it rather than shipping it and hoping it's fine.

## Design philosophy — this has to feel personal, not templated

Ground every design decision in Ian's actual world, not in generic "student portfolio" conventions.

**Ian reviewed the first build and rejected its tone**: "too cringey/braggy", "trying really hard to be cool but failing pretty miserably → Pretentious feel". He asked for "a lot simpler", said "a bit more bland is okay with me", and is specifically afraid classmates and next year's debate novices will search "Ian Gao Leland" and find it. Restrained beats striking. Keep every fact, drop the trophy-case framing: no ticker/marquee, no KPI stat tiles, no ALL-CAPS letterspaced section tags, one typeface, one accent, hairline rules over bordered cards. **Do not "take an aesthetic risk" here** — that instruction is what produced the version he rejected.

Copy should sound like Ian, specific and plain, not like generic admissions-portfolio marketing copy ("passionate," "driven," "well-rounded"). Prefer concrete specifics over adjectives.

Never write facts, opinions, or beliefs on Ian's behalf. Where content needs his input, ship a data file that renders nothing when empty (e.g. `src/data/beliefs.ts`) rather than a visible "coming soon" placeholder.

Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus states, reduced-motion respected for anyone with that OS setting on.

## Content source of truth (from Ian's own notes, use as-is until told otherwise)

**Homepage bio is Ian's verbatim "changes 7/27" text from the review Doc.** Don't paraphrase it without asking him.

**Section structure:** Debate · Research (CCIR, UCSB SRA, UCSC SIP) · Campaigning (Matt Mahan, Evan Low) · Theatre · Photos (`/gallery`) · Writing. `/about` was deleted Aug 2026 — don't re-add it without asking.

**Voice is first person throughout** — third-person self-description reads as the résumé tone Ian objected to.

**Do not fabricate.** Every claim must trace to the resume or the review Doc. Two facts live only in the Doc and not the resume — the INT 93LS grade and the LD topic "military intervention" (resume says "wealth tax") — so don't "correct" them against the resume.

**External assets to link to/from** (backlink value, spec §7): school debate team page, school newspaper article. Both still unconfirmed URLs.

## Build & tooling gotchas

- **Static output lands in `dist/client/`, not `dist/`** (Cloudflare adapter). Verification greps and the Cloudflare Pages "build output directory" must both use `dist/client` — pointing Pages at `dist` deploys nothing.
- `astro.config.mjs` needs `imageService: 'compile'`. Cloudflare's autoconfig resets it; re-apply after any autoconfig run or prod images 404.
- Content collections live in `src/content.config.ts` with a `glob()` loader. Astro ≥6 hard-errors on the legacy `src/content/config.ts`.
- Deleting an MDX post without clearing `node_modules/.astro/data-store.json` makes `astro build` fail on the phantom route.
- Photos from Ian arrive as HEIC. `sharp` can't decode it and there's no ImageMagick HEIC delegate here — use `npm i heic-convert`. Also strip EXIF rotation with sharp's `.rotate()` or portraits land sideways.
- Playwright: pass `executablePath: '~/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome'`; a newer playwright asks for a build that isn't installed.
- **A Playwright element screenshot of a `loading="lazy"` image comes back blank** — it scrolls into view and shoots before the fetch lands. Scroll the whole page, then `waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0))`. This has twice looked like a broken image that wasn't.

## Iteration workflow

- Every session: re-read this file and the spec doc first, don't rely on memory of a prior session.
- Commit after each meaningful iteration with a message describing what changed, not just "update."
- After any change touching layout, head tags, or content structure, run the verification checklist below before considering the iteration done.
- If a requested change conflicts with a non-negotiable above, say so explicitly and propose the closest alternative that doesn't break it, don't silently drop the SEO requirement to satisfy the design ask.

## Verification checklist (run after every iteration)

- [ ] Site builds clean, no errors/warnings
- [ ] Sitemap and robots.txt still generating correctly
- [ ] JSON-LD on homepage and one sample post passes Google's Rich Results Test
- [ ] Lighthouse run, Core Web Vitals still in target range. Use `--preset=desktop --throttling-method=provided`; Lighthouse's *default* simulated slow-4G reports LCP ~3.4s on the same build that measures 0.2s unthrottled, and the gap is the render-blocking Google Fonts stylesheet, not the images. Don't chase the simulated number without saying which you measured.
- [ ] Keyboard-only nav reaches every interactive element, visible focus state present
- [ ] Mobile viewport checked, not just desktop
- [ ] No new console errors

## Open items

Tracked in `DEPLOYMENT.md` — one list, not two. It holds both the launch checklist and the "Decisions only Ian can make" section (GPA/SAT block, retiring `/activities`, missing `ian theater 1–3`, i18n, CMS-vs-MDX). Update it there when something resolves.
