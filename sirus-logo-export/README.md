# Sirus — Logo

The Sirus mark is a galloping-horse silhouette paired with the "Sirus" wordmark.

## Files
- `sirus-mark.png` — the mark. Transparent PNG, pure black (#000000), 1402×863. Use `filter: invert(1)` to render white on dark backgrounds.
- `SirusLogo.jsx` — drop-in React component (horizontal / stacked / mark-only, light / dark).

## Brand rules
- **Type:** Inter, weight **500** only (never bold), `font-feature-settings: 'ss01'`, letter-spacing `-0.02em`.
- **Color:** 100% achromatic. Black `#000000` on light, white `#ffffff` on dark. Never add color, gradient, shadow, or glow to the logo.
- **Clear space:** keep padding around the mark equal to roughly the horse's muzzle height on all sides.
- **Radius (containers/avatars):** 33.76px (system radius); 50% for circular avatars.
- **Minimum size:** mark reads down to ~16px; below that prefer the mark alone over the full lockup.

## Usage
```jsx
import { SirusLogo } from "./SirusLogo";

<SirusLogo variant="horizontal" theme="light" height={32} />
<SirusLogo variant="stacked" theme="dark" height={120} />
<SirusLogo variant="mark" height={24} />   // favicon / avatar
```
Place `sirus-mark.png` in your public/ root (or update the `src` path in the component). Make sure Inter is loaded (e.g. Google Fonts weights 400 & 500).

## Note
`sirus-mark.png` is raster. If you need infinite scalability, trace it to SVG once (e.g. in Illustrator / Figma) and swap the `<img>` for inline SVG — the silhouette traces cleanly as a single flat path.
