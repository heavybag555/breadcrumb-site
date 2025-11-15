# Breadcrumb Studio

A single-page website for Breadcrumb Studio, an independent digital, creative, and web studio based in Los Angeles.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, add your font files to the `public/fonts/` directory. The project expects:
- `SFProText-Regular.woff2` (or `.woff`, `.otf`)
- `SFProText-Medium.woff2` (or `.woff`, `.otf`)

If you have different font files, update the `@font-face` declarations in `app/globals.css`.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Design

- Text color: `#5D75E0`
- Background: `#EAEAEA`
- Font size: 15px
- Font: SF Pro Text (Regular and Medium)

## Project Structure

- `app/` - Next.js app directory
  - `page.tsx` - Main page component
  - `layout.tsx` - Root layout
  - `globals.css` - Global styles and font definitions
  - `page.module.css` - Page-specific styles
- `public/fonts/` - Font files directory
