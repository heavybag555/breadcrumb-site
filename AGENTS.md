## Learned User Preferences

- Implement designs pixel-faithfully from Figma — match text styles, colors, and spacing exactly.
- Light-mode site uses Helvetica Neue (system stack); no Google Fonts or custom @font-face unless explicitly reintroduced.
- Page layout uses 20px margins/gutters and a 4px spacing system — all spacing should snap to the 4px grid.
- Prefer heavy, natural motion: slow cubic-bezier transitions on hovers, overlays, page transitions, and nav; no scale-in or swipe-in for primary UI motion; respect `prefers-reduced-motion`. User repeatedly asks for buttery, deliberately slow interactions.
- Images may fade in with opacity-only ease once loaded (`FadeImage` / `data-fade`); no slide-in or scale-in on images.
- Sanity CMS drives work projects, photo projects, resource links (Learning/Reading/Watching), and writing entries; remaining site content stays in code.
- Prefer minimal dependencies: Next.js, React, Sanity, and `next-sanity`; shared motion uses CSS duration/easing tokens in `globals.css`.
- Navigation header has no background fill; scroll-direction show/hide with slow opacity fade (always visible within ~100px of top).
- Homepage hero owns its directory nav (Information/Resources/Stack slide-down reveals, Email/Instagram socials); the global fixed header is suppressed on `/`.
- External directory/social links use an upward-right arrow 4px to the right of the label.
- Semantic section titles (Information, Services, etc.) use caption style in accent blue (`#417dff`), flush above body content with a 4px gap.
- Work tag badges: black text, transparent fill, 1px black stroke, 0px border radius, 4px×8px padding (no colored fills).

## Learned Workspace Facts

- Studio header reads "2u4u Studio" (no trailing period); rebranded from "Breadcrumb Studio".
- Contact email: 2you4youstudio@gmail.com | Instagram: https://www.instagram.com/2u4u.studio/ | Hero socials: Email + Instagram; Are.na appears in Stack panel CMS list only.
- Founded and operated by Benjamin Uribe, based in Los Angeles. Dev server runs on port 4000.
- Light-mode palette: background `#ffffff`, ink `#000000`, grey text `#b8b8b8`, accent `#417dff`; divider lines `rgba(0,0,0,0.08)`.
- Typography tokens: Heading (20px/22px/-0.02em, weight 500), Body (12px/16px/-0.10px, weight 500), Caption (10px/12px/-0.05px, weight 500); hero copy uses 12px/14px scale.
- Sanity project ID: `tl235np0`; embedded studio at `/studio`. Schema types: `project`, `photoProject`, `resource`, `writing`.
- Site uses a 4-column grid inside a centered 840px container, with 20px gutter and 20px page margin on all pages.
- Homepage (`/`): full-viewport hero (fit-width brand + tagline + Latest domain badge) with column directory → selected work list with hover preview and alternating web/photo rows → footer contact CTA; work section ends with `background.jpg` reveal.
- Subpages: `/info` (about/services/stack/interests/principles grid), `/resources` (CMS links by category), `/writing` (CMS entries with lightbox). Other pages use fixed header nav: Work, Info, Resources, Writing.
- Work index rows show index number, client/title, domain with external arrow, and outlined tag badges (Web/Photo, topics, stack); "Selected work" label above list in grey; web projects lead, then alternating web/photo.
- Site SEO: description "Web, Photo, and Interaction Studio based in Los Angeles, CA"; OG preview uses `/images/benuribe.jpg`.
- Raster assets referenced as `/images/...` must live under `public/images/`. Figma design file key: `LAQL3Co2GY5sagwcHqeVP4`.
