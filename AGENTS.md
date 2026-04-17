## Learned User Preferences

- Implement designs pixel-faithfully from Figma — match text styles, colors, and spacing exactly.
- Use only Univers Next Pro (local font files in `/public/fonts/univers/`), no Google Fonts.
- Keep @font-face declarations annotated with size/weight/line-height/letter-spacing specs as comments.
- Avoid load-in/reveal animations on project items; keep motion minimal and reserve anime.js for deliberate polish only.
- Sticky text fragments should assemble into a cohesive paragraph on scroll — like Tetris blocks filling in their natural paragraph position — and disassemble when scrolling back up.
- Whenever the grid, column count, or page padding changes, make the sticky assembly text responsive to the new values.
- Sanity CMS drives per-project content (images, client name, tags, bio, stack, domain, process copy); remaining site content stays in code.
- Prefer minimal dependency sets: core stack is Next.js, React, anime.js (v4 named exports: `animate`, `stagger`), Sanity, and `next-sanity`.
- Navigation header should have no background fill; non-sticky elements scroll normally.
- Header CTA is an orange text link ("Connect") with upward-right arrow icon; all 4 nav items (Work, Info, Writing, Connect) sit in one flex row.
- Footer background is solid black (`#000`) with 4px vertical padding; no Instagram or email in footer.
- Project tags render in standard capitalization, comma-separated, styled as orange text with no pill backgrounds.

## Learned Workspace Facts

- Studio header reads "2u4u Studio." (with trailing period); rebranded from "Breadcrumb Studio".
- Contact email: 2you4youstudio@gmail.com | Instagram: https://www.instagram.com/2u4u.studio/
- Founded and operated by Benjamin Uribe, based in Los Angeles. Dev server runs on port 4000.
- Design system uses three text styles: Heading (32px/36px/-0.96px, weight 700), Body (18px/20px/-0.54px), Caption (11px/9px/-0.44px).
- Colors: background `#0e0e0e`, primary text `#595959`, accent `#FF6700`, bright `#fff`, muted/context text `#353535` (at 100% opacity).
- Sanity project ID: `tl235np0`; embedded studio at `/studio` via `next-sanity`. Client lazily initialized to avoid build errors when env vars are missing.
- Site uses an 8-column grid system with 200px left/right padding on all pages (migrated from 6-column / 120px).
- Homepage: sticky text assembly over the 8-column grid (context/background words use `#353535`) → project grids → footer; services/stack/interests/principles live on the info page.
- Info page (`/info`): in-flow nav; 3 rows of 4 equal columns on the 8-column grid, each content block spans 2 of 8 columns; rows separated by `border-top: 1px solid #595959`.
- Work page projects: image spans 6 of 8 columns with details in the remaining 2; detail column alternates left/right per project; upward-right arrow icon sits to the right of the project title; page ends with a full empty viewport.
- Project cards (Sanity-driven): client name `#fff`, tags primary grey, bio and stack primary grey, domain + arrow orange; no outer grey container on work page.
- Nav buttons grey `#595959`; "Connect" CTA orange `#FF6700`. `@font-face` loads Univers Next Pro weights 300/400/500/700. Figma design file key: `LAQL3Co2GY5sagwcHqeVP4`.
