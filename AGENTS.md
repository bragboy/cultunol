# Cultuñol website redesign

A redesign of www.cultunol.com (Mónica Fiestas' online Spanish academy), built as a gift. Static Hugo site, bilingual Spanish (default, at `/`) and English (at `/en/`). The live site runs on Systeme.io; this repo replaces the design only. URLs, links and copy match the original.

## Commands

Tools are pinned with mise. Never install tools with brew or by hand.

```sh
mise install       # pinned Hugo (extended)
mise run dev       # http://127.0.0.1:1313
mise run build     # production build into dist/
```

Publishing: **there is no deploy command.** Every push to `main` builds and publishes the site with GitHub Actions (`.github/workflows/pages.yml`) to GitHub Pages. Check a run with `gh run list` / `gh run watch`.

- Today: repo `github.com/bragboy/cultunol`, custom domain https://cultunol.prueba.top (Cloudflare CNAME to `bragboy.github.io`, DNS only, HTTPS enforced).
- After handover: the repo is transferred to Mónica's GitHub account; she points `www.cultunol.com` at it from Namecheap (steps in `GUIA-MONICA.md`).
- Her pre-call checklist (Spanish PDF): `handover/preparacion.html`, rendered to `handover/Cultunol-Preparacion.pdf` with headless Chrome.
- The old DigitalOcean preview (francium.tech server) has been removed; nothing of this site runs there any more.

## Pages (same paths as the original site)

`/`, `/newsletter`, `/suscribirse`, `/bundle`, `/2suscripcionmochila`, `/suscrito`, `/cursos`, `/cursos-grupales`, `/cultunol_principiantes`, `/curso_cultunol`, `/equipo`, `/metodologia`, `/contactar`, `/legal-page`. Each has a `content/<name>.es.md` and `.en.md` twin; copy lives in front matter, and each page has its own template in `layouts/`.

## Content rules

- Spanish copy is Mónica's, verbatim from the original site (`reference/crawl/content.txt`). English is a faithful translation. Never invent facts, prices, testimonials or stats.
- The legal page is English on the original and stays verbatim in both languages (`assets/legal.md`).
- No em-dashes or en-dashes in new text.
- Check the original `sitemap.xml` as well as the menus: Systeme funnel pages are only listed there.
- Images are hers, downloaded from the original site into `assets/images/` and served as responsive WebP via the `img.html` partial.

## Known gaps

- `/suscribirse` and the two `/bundle` email forms are not wired yet. They validate and show a "coming soon, write to us" note. Hook them to Systeme.io (or another provider) later.
- Her funnel page says "Añádame" (usted) while the rest uses tú; kept verbatim, worth asking her.
- The original site's email links point to `mailto:info@monicafiestas.com` while showing `info@cultunol.com`. Kept as is; confirm with Mónica.

## Design

- Brand colours (from cultunol.com, Mónica asked for them to be clear): orange #DA984D, blue #587499, green #58995C. Story panels and footer are her blue, the home courses band is green, the newsletter band blue, accents orange. Cream background and dog-illustration tones support them.
- One inset (`--inset`) and radius for every full-width tile so edges line up on phones.
- Dark rounded story panels with a glowing ribbon linking numbered nodes (`ribbon.html` partial), scroll-zoom of the board illustration, words that light up on scroll, slow "breathing" illustrations (`.alive`), photo-to-dog portrait flips, swipe rails on phones.
- All art sits in fixed-ratio frames anchored to the top (`.frame`) so crops are consistent.
- No inline scripts or style attributes; JS in `assets/js/main.js`. Respect `prefers-reduced-motion`.
- Check every change at 1440px and 390px with Playwright: no horizontal scroll, no console errors.

## Decisions from Braga's feedback (keep these)

- Phones: every panel sits 16px from each side (`--inset`), the same line as the text. Braga cares about side breathing room, not vertical gaps.
- Portraits flip photo to dog: hover on desktop, tap to toggle on touch, keyboard focus shows the dog. Mouse clicks never lock it. No automatic "peek" animation (rejected).
- Home motion: greeting bubble (¡Hola!/Hello!/¡Guau!), paw trail in the hero, "fin" struck through in the manifesto, Paraguay postmark on the newsletter postcard, ribbon nodes pulsing with the travelling light.
- Prices: Spanish "325 €" style with non-breaking spaces, English "€325" style; amounts never change.
- Portraits `monica.jpg`, `ana.jpeg`, `equipo-monica.jpeg` are AI-restored versions Braga approved (faces checked against originals). Stock images from her funnel pages (watermarked envelope, check mark) are replaced by drawn SVG animations.
- Workflow: commit after each change, `git push` to publish, show screenshots so Braga can give feedback.
