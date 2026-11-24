# Roadmap

Phase 01 implementation: shared parser, DOM rendering, URL validation, independent fetch states, and project index validation implemented. Local unit tests pass; browser and live Sheets integration remain unverified.

## P0 — Data correctness and safe rendering

- Shared CSV parser added for quoted fields, commas, escaped quotes, multiline fields, BOM and CRLF; broader integration verification remains.
- Completed: render spreadsheet text through DOM APIs and restrict external URLs to HTTP(S).
- Replace row-index project links with stable IDs while retaining a documented compatibility path for legacy `?id=<row>` links.
- Completed: loading, fetch/parse error with retry, and empty states for all six categories.
- Verify the current sheet headers and column mapping with Eka before changing any schema.

## P1 — Usability and accessibility

- Persist light/dark theme in localStorage and expose an accessible theme control with state.
- Add accessible names/alt text, keyboard focus visibility, semantic landmarks, and reduced-motion support.
- Review mobile spacing, project cards, detail media, and skill carousel behavior at common viewport sizes.
- Replace placeholder social links with verified destinations or remove them after confirming intent.

## P2 — Maintainability and performance

- Move inline scripts into small JavaScript files while keeping the static architecture.
- Centralize shared CSV loading, URL constants, and theme behavior.
- Reduce duplicated rendering logic and avoid repeated full `innerHTML` concatenation.
- Review external assets/CDNs, image loading, caching, and failure behavior.

## P3 — Search and documentation

- Add accurate page-specific metadata, descriptions, social preview metadata, and favicon if approved assets exist.
- Document each sheet's verified headers, field meaning, optional values, and update/publish procedure in README.
- Document local preview and deployment process after confirming how the repository is hosted.

## Audit findings to resolve

- CSV is currently split by newline and comma, so quoted commas/newlines are parsed incorrectly.
- Spreadsheet fields are inserted into HTML templates; this enables markup injection. Links and image URLs are not robustly validated.
- Fetch failures are swallowed, leaving indefinite loading text; empty datasets have no explicit feedback.
- Project detail uses a filtered row index, which can shift when rows change.
- Theme toggle is not persisted and has no accessible label/state.
- Mobile layout has a single breakpoint; fixed background and continuously animated carousel may affect usability/performance.
- Social links are `#` placeholders. Font declarations name Poppins and Space Mono without local imports visible in source.
- Current project detail parser and landing page have duplicated CSV logic.

## Verification status

Audit only. No source changes, tests, live-site checks, CSV fetches, or deployment checks were performed. Validate each implementation increment when work begins.

## Phase 07 — Cloudflare & Custom Domain Deployment

- Plan hosting, DNS, custom domain, TLS, and migration after approval. No deployment has been performed.
