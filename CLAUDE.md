# CLAUDE.md — ian-gao.com Build & Iteration Instructions

This file is read at the start of every Claude Code session in this repo. Read it, then read `ian-gao-site-technical-spec.md` in the same folder before writing any code. That file is the technical source of truth (framework, hosting, SEO/GEO requirements). This file governs how to *build and iterate* without breaking any of it.

## What this project is

A personal site for Ian Gao, rising senior, built primarily to support college admissions visibility. It needs to rank well (SEO priority, GEO secondary — see spec doc) and it needs to feel like an actual person, not a template. Both things matter equally to whether this project succeeds.

## Inputs in this folder

- `ian-gao-site-technical-spec.md` — stack, hosting, SEO/GEO technical requirements. Non-negotiable.
- A Claude Design export (zip) — Treat it as the visual/layout starting point once it arrives: extract it, study the palette/type/layout/component choices, then rebuild those choices natively as Astro components. Do not just serve the static export as-is — it needs to become real Astro pages/components wired to the content collections defined in the spec, with the SEO head tags, schema, and sitemap generation from that spec intact. If asked to start before the zip arrives, build the structure and content first, layer the design in once it lands.

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

Ground every design decision in Ian's actual world, not in generic "student portfolio" conventions. His world: competitive debate (president of a top-5 national program, ranked nationally in Lincoln-Douglas), research internships (CCIR, UCSB SRA, UCSC SIP), political campaign work, theatre, basketball, guitar. Pull from that vernacular, not from stock portfolio-template language.

Explicitly avoid the three current AI-design defaults unless a real reason pulls toward one of them: cream background + serif + terracotta accent, near-black + single neon accent, broadsheet/hairline-rule newspaper layout. Pick one real, deliberate visual direction and commit to it, take one actual aesthetic risk you can justify rather than landing on whichever of the three defaults is closest to "safe."

Copy should sound like Ian, specific and plain, not like generic admissions-portfolio marketing copy ("passionate," "driven," "well-rounded"). Prefer concrete specifics (rank, program name, actual competition names) over adjectives.

Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus states, reduced-motion respected for anyone with that OS setting on.

## Content source of truth (from Ian's own notes, use as-is until told otherwise)

**Bio (homepage / about):**
Ian Gao, senior at Leland High School, researcher at UCSB and UCSC. President of Leland Speech and Debate (top 5 program nationally), ranked 19th nationally in Lincoln-Douglas debate. Interned on political campaigns: Evan Low for Congress, Matt Mahan for Governor. Outside debate and research: acting in theatre, basketball, learning guitar.

**Section structure:**
- **Debate** — President role, competitive records
- **Research** — CCIR, UCSB SRA, UCSC SIP
- **Campaigning** — Matt Mahan, Evan Low
- **Theatre** — performance clips, production photos

**Flagged as missing (do not fabricate placeholders that look real):** photos across bio and theatre sections. Use clearly-marked placeholder blocks until real images are supplied, don't ship stock photography that could be mistaken for him.

**Existing external assets to link to/from** (real backlink value, see spec doc section 7): school debate team page, school newspaper article on his track/debate activity.

## Iteration workflow

- Every session: re-read this file and the spec doc first, don't rely on memory of a prior session.
- Commit after each meaningful iteration with a message describing what changed, not just "update."
- After any change touching layout, head tags, or content structure, run the verification checklist below before considering the iteration done.
- If a requested change conflicts with a non-negotiable above, say so explicitly and propose the closest alternative that doesn't break it, don't silently drop the SEO requirement to satisfy the design ask.

## Verification checklist (run after every iteration)

- [ ] Site builds clean, no errors/warnings
- [ ] Sitemap and robots.txt still generating correctly
- [ ] JSON-LD on homepage and one sample post passes Google's Rich Results Test
- [ ] Lighthouse (or equivalent) run, Core Web Vitals still in target range
- [ ] Keyboard-only nav reaches every interactive element, visible focus state present
- [ ] Mobile viewport checked, not just desktop
- [ ] No new console errors

## Open items blocking full personalization

- [ ] Claude Design zip not yet provided
- [ ] Photos (bio + theatre) not yet provided
- [ ] Chinese-language version decision (from spec doc, still open)
- [ ] Git-based MDX vs lightweight CMS decision for how Ian edits posts (from spec doc, still open)
