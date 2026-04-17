## Learned User Preferences

- Implement designs pixel-faithfully from Figma — match text styles, colors, and spacing exactly.
- Use only Univers Next Pro (local font files in `/public/fonts/univers/`), no Google Fonts.
- Keep @font-face declarations annotated with size/weight/line-height/letter-spacing specs as comments.
- Reserve anime.js for restrained motion polish (reveals, stagger); use CSS `position: sticky` for core scroll-driven layout.
- Sticky text fragments should assemble into a cohesive paragraph on scroll — like Tetris blocks filling in their natural paragraph position — and disassemble when scrolling back up.
- Only project slots should be Sanity CMS-driven; keep remaining homepage content in code.
- Prefer minimal dependency sets: core stack is Next.js, React, anime.js (v4 named exports: `animate`, `stagger`), and Sanity.
- Navigation header should have no background fill; non-sticky elements scroll normally.
- Strip unused font weights/variants — only keep what the codebase actually references.
- Grey background containers should use 20% opacity (`rgba(89,89,89,0.2)`), except the header CTA button which stays solid.
- Text inside grey-filled containers should use the Body text style, not Heading.

## Learned Workspace Facts

- Studio rebranded from "Breadcrumb Studio" to "2U4U Studio".
- Contact email: 2you4youstudio@gmail.com
- Instagram: https://www.instagram.com/2u4u.studio/
- Founded and operated by Benjamin Uribe, based in Los Angeles.
- Dev server runs on port 4000.
- Design system uses three text styles: Heading (32px/36px/-0.96px, weight 700), Body (18px/20px/-0.54px), Caption (11px/9px/-0.44px).
- Global background: `#0e0e0e`, primary text: `#595959`, accent text: `#FF6700`, bright text: `#fff`.
- Sanity client is lazily initialized to avoid build errors when env vars are missing.
- Homepage layout: sticky text assembly → project grids (asymmetric 4/2, 2/4, 3-equal columns) → info panels → principles block → footer.
- Assembly text spans left 3 of 6 columns (50% width); service words rendered as caption-styled pill badges; profile image inline next to founder name.
- Info panels span middle 4 of 6 columns (centered); nav buttons sit in columns 4–5, right-aligned.
- Info page (`/info`) uses in-flow navigation (not sticky/fixed), 3-column equal-flex rows with `border-top: 1px solid #FF6700`.
- Portfolio/hover image asset: `BU-portfolio.jpg`.
- Figma design file key: `LAQL3Co2GY5sagwcHqeVP4`.
