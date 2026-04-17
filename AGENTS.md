## Learned User Preferences

- Implement designs pixel-faithfully from Figma — match text styles, colors, and spacing exactly.
- Use only Univers Next Pro (local font files in `/public/fonts/univers/`), no Google Fonts.
- Keep @font-face declarations annotated with size/weight/line-height/letter-spacing specs as comments.
- Reserve anime.js for restrained motion polish (reveals, stagger); use CSS `position: sticky` for core scroll-driven layout.
- Sticky text fragments should assemble into a cohesive paragraph on scroll — like Tetris blocks filling in their natural paragraph position — and disassemble when scrolling back up.
- Only project slots should be Sanity CMS-driven; keep remaining homepage content in code.
- Prefer minimal dependency sets: core stack is Next.js, React, anime.js (v4 named exports: `animate`, `stagger`), Sanity, and `next-sanity`.
- Navigation header should have no background fill; non-sticky elements scroll normally.
- Load all font weights that the design system references (currently Light 300, Regular 400, Medium 500, Bold 700).
- Grey background project containers use 20% opacity (`rgba(89,89,89,0.2)`) with 40px inner padding, `object-fit: contain`, and Body text style (not Heading).
- Header CTA is an orange text link ("Connect") with upward-right arrow icon; all 4 nav items (Work, Info, Writing, Connect) sit in one flex row.
- Footer background is solid black (`#000`) with 4px vertical padding; no Instagram or email in footer.

## Learned Workspace Facts

- Studio rebranded from "Breadcrumb Studio" to "2U4U Studio".
- Contact email: 2you4youstudio@gmail.com | Instagram: https://www.instagram.com/2u4u.studio/
- Founded and operated by Benjamin Uribe, based in Los Angeles. Dev server runs on port 4000.
- Design system uses three text styles: Heading (32px/36px/-0.96px, weight 700), Body (18px/20px/-0.54px), Caption (11px/9px/-0.44px).
- Global background: `#0e0e0e`, primary text: `#595959`, accent text: `#FF6700`, bright text: `#fff`.
- Sanity project ID: `tl235np0`; embedded studio at `/studio` via `next-sanity`. Client lazily initialized to avoid build errors when env vars are missing.
- Homepage layout: sticky text assembly → project grids (asymmetric 4/2, 2/4, 3-equal columns) → footer. Services/Stack/Interests/Principles moved to the info page.
- Assembly text spans left 3 of 6 columns (50% width); service words rendered as caption-styled pill badges; profile image inline next to founder name.
- Nav buttons are grey (`#595959`); "Connect" CTA link is orange (`#FF6700`). `@font-face` loads weights 300, 400, 500, 700 of Univers Next Pro.
- Info page (`/info`) uses in-flow navigation (not sticky/fixed), 3-column equal-flex rows with `border-top: 1px solid #595959`, content centered in middle 3 of 6 columns (50% width). Sections: Information, Philosophy, Contribution to Humanity, Scope.
- Portfolio/hover image asset: `BU-portfolio.jpg`.
- Figma design file key: `LAQL3Co2GY5sagwcHqeVP4`.
