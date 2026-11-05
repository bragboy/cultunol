# Cultuñol website redesign

A redesign of www.cultunol.com (Mónica Fiestas' online Spanish academy), built as a gift. Static Hugo site, bilingual Spanish (default, at `/`) and English (at `/en/`). The live site runs on Systeme.io; this repo replaces the design only. URLs, links and copy match the original.

## Commands

Tools are pinned with mise. Never install tools with brew or by hand.

```sh
mise install       # pinned Hugo (extended)
mise run dev       # http://127.0.0.1:1313
mise run build     # production build into dist/
```

For a temporary domain, build with `hugo --gc --minify --destination dist --baseURL https://<temp-domain>/` so canonical and og:url point at it.

## Pages (same paths as the original site)

`/`, `/newsletter`, `/suscribirse`, `/cursos`, `/cursos-grupales`, `/cultunol_principiantes`, `/curso_cultunol`, `/equipo`, `/metodologia`, `/contactar`, `/legal-page`. Each has a `content/<name>.es.md` and `.en.md` twin; copy lives in front matter, and each page has its own template in `layouts/`.

## Content rules

- Spanish copy is Mónica's, verbatim from the original site (`reference/crawl/content.txt`). English is a faithful translation. Never invent facts, prices, testimonials or stats.
- The legal page is English on the original and stays verbatim in both languages (`assets/legal.md`).
- No em-dashes or en-dashes in new text.
- Images are hers, downloaded from the original site into `assets/images/` and served as responsive WebP via the `img.html` partial.

## Known gaps

- `/suscribirse` form is not wired yet. It validates and shows a "coming soon, write to us" note. Hook it to Systeme.io (or another provider) later.
- The original site's email links point to `mailto:info@monicafiestas.com` while showing `info@cultunol.com`. Kept as is; confirm with Mónica.

## Design

- Palette from her illustrations: caramel dog fur, MADRID orange, Ana's green, denim blue, parchment cream, night panels (`:root` tokens in `assets/css/main.css`).
- Dark rounded story panels with a glowing ribbon linking numbered nodes (`ribbon.html` partial), scroll-zoom of the board illustration, words that light up on scroll, slow "breathing" illustrations (`.alive`), photo-to-dog portrait flips, swipe rails on phones.
- All art sits in fixed-ratio frames anchored to the top (`.frame`) so crops are consistent.
- No inline scripts or style attributes; JS in `assets/js/main.js`. Respect `prefers-reduced-motion`.
- Check every change at 1440px and 390px with Playwright: no horizontal scroll, no console errors.
