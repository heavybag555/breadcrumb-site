## Learned User Preferences

- Implement designs pixel-faithfully from Figma — match text styles, colors, and spacing exactly.
- Site-wide typeface is Geist (local variable via `next/font`); Helvetica Neue is fallback only. Body text uses regular weight (400), not medium.
- Page layout uses 20px margins/gutters and a 4px spacing system — all spacing should snap to the 4px grid.
- Prefer heavy, natural motion: slow cubic-bezier transitions on hovers, overlays, page transitions, and nav; no scale-in, swipe-in, or hover scale for primary UI motion; respect `prefers-reduced-motion`. User repeatedly asks for buttery, deliberately slow interactions.
- Images may fade in with opacity-only ease once loaded (`FadeImage` / `data-fade`); no slide-in or scale-in on images.
- Sanity CMS drives work projects, photo projects, resource links (Learning/Reading/Watching), and writing entries; remaining site content stays in code.
- Prefer minimal dependencies: Next.js, React, Sanity, and `next-sanity`; shared motion uses CSS duration/easing tokens in `globals.css`.
- Navigation header has no background fill; scroll-direction show/hide with slow opacity fade (always visible within ~100px of top). Homepage header and footer follow the same 8-column grid as content (items span 2 columns); on mobile keep those columns side by side, not stacked.
- Homepage hero owns its directory nav (Information/Resources/Stack slide-down reveals, Email/Instagram socials); the global fixed header is suppressed on `/`. Hero copy is body size, centered, 0px gap between lines; "2u4u" and "Ben Uribe" stay ink, remaining hero text is grey; Ben Uribe links to https://benjaminuribe.com. Mobile hero nav shows only Information + contacts, side by side. Blue circular chevron sits 20px from the hero bottom edge and fades away on scroll.
- External directory/social links use an upward-right arrow 4px to the right of the label.
- Semantic section titles (Information, Services, etc.) use caption style in accent blue (`#417dff`), flush above body content with a 4px gap.
- Selected work uses the 8-column grid with each card spanning 2 equal columns (4 across desktop): media uses `object-fit: contain` inside padded squares (no crop); no title overlay, no hover scale; domain + stack/location meta stacked below with no gap; domain is black (not accent blue).

## Learned Workspace Facts

- Studio header reads "2u4u Studio" (no trailing period); rebranded from "Breadcrumb Studio".
- Contact email: 2you4youstudio@gmail.com | Instagram: https://www.instagram.com/2u4u.studio/ | Hero socials: Email + Instagram; Are.na appears in Stack panel CMS list only. Personal site: https://benjaminuribe.com (linked from "Ben Uribe" in the hero).
- Founded and operated by Benjamin Uribe, based in Los Angeles. Dev server runs on port 3000 (`next dev -p 3000`).
- Light-mode palette: background `#ffffff`, ink `#0a0a0a`, grey text `rgba(10, 10, 10, 0.5)` (ink at 50% opacity), accent `#417dff`; divider lines `rgba(10, 10, 10, 0.08)`.
- Typography tokens: Heading (20px/22px/-0.02em, weight 500), Body (12px/16px/-0.10px, weight 400), Caption (10px/12px/-0.05px, weight 500); hero copy uses the body 12px/16px scale.
- Sanity project ID: `tl235np0`; embedded studio at `/studio`. Schema types: `project`, `photoProject`, `resource`, `writing`.
- Site uses an 8-column equal-width grid inside a centered 1200px container, with 20px gutter and 20px page margin on all pages. Header items and selected-work cards each span 2 columns.
- Homepage (`/`): full-viewport hero (directory toggles + Email/Instagram + centered multi-line hero copy + bottom scroll chevron) → Selected Work 8-col / span-2 square grid → footer contact CTA (cols 1–2) + location/time (cols 7–8); work section ends with `background.jpg` reveal.
- Subpages: `/info` (about/services/stack/interests/principles grid), `/resources` (CMS links by category), `/writing` (CMS entries with lightbox). Other pages use fixed header nav: Work, Info, Resources, Writing.
- Selected work grid: 4 cards across desktop (span 2 of 8); 12px inner padding in square cells; `object-fit: contain`; web projects lead then alternating web/photo; photo cards show location/year meta instead of domain/stack; serve resized media via Sanity CDN or Next.js Image (avoid full-resolution originals in small cells).
- Site SEO: description "Web, Photo, and Interaction Studio based in Los Angeles, CA"; document titles use ` › ` as separator; OG preview uses `/images/benuribe.jpg`; favicon is a solid black circle at `/icon.svg`.
- Raster assets referenced as `/images/...` must live under `public/images/`. Figma design file key: `LAQL3Co2GY5sagwcHqeVP4`. Geist files live under `app/fonts/geist/`.
