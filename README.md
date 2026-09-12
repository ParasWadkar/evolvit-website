# EvolVIT — Club Website

The official website of **EvolVIT**, the 100th official club of **VIT Bhopal University**.
*Evolve. Experience. Excel.*

A single-page, zero-dependency static site: no build step, no framework, no npm install.
Open `index.html` and it runs.

---

## What's on the site

| Section | Content |
| --- | --- |
| Hero | Positioning, club badge, live terminal card |
| Stats | 100th club · 6 core teams · 2 industry partners · 4 flagship events |
| About | Mission, what the club does (6 offerings) |
| Internship Program | The flagship initiative and what makes it different |
| Industry Partners | Datatrack (3 months, 4 live projects, 4 college credits) and Quantumard (1-month full-stack sprint) |
| Selection Process | The five-stage Research Team evaluation |
| Teams | The six core teams behind every event |
| Events | EvolART, Idea2Industry, the Appointy industrial visit, and Viksit Bharat — with winners and photos |
| Join | Recruitment CTA + FAQ |

All content is sourced from the official **EvolVIT Club Record 2025–26**, including the club
logo and event photography.

---

## Structure

```
.
├── index.html              # the whole page
├── assets/
│   ├── css/styles.css      # design tokens -> base -> components -> sections -> responsive
│   ├── js/main.js          # nav, scroll reveal, counters, hero canvas, lightbox
│   └── img/                # club logo, event photos, favicons, OG card
└── README.md
```

## Running locally

Any static server works. For example:

```bash
python -m http.server 5175
```

Then open <http://localhost:5175>.

## Deploying on GitHub Pages

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment**: source `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. The site goes live at `https://<user-or-org>.github.io/<repo>/`.

No build command is needed — Pages serves the files as they are.

---

## Before you publish: two links to fill in

Both are marked with `TODO` comments in `index.html`:

1. **Recruitment form** — the `Apply to join` button in the `#join` section
   (`<a ... data-recruitment-link>`). Point it at your Google Form or club portal.
2. **LinkedIn page** — the LinkedIn icon in the footer (`<a ... data-linkedin-link>`).

The Instagram link (`@evolvitclub_vitb`) and the member project links
(`uprole.me`, `pracup.co.in`) are already live.

Find them quickly:

```bash
grep -n "TODO" index.html
```

## Editing content

- **Text, events, winners, partners** — all inline in `index.html`, under clearly labelled
  section comments (`<!-- ============ EVENTS ============ -->`).
- **Colours, spacing, radii, fonts** — the token block at the top of `assets/css/styles.css`.
  Changing `--brand` and `--aqua` re-themes the entire site, gradients included.
- **New event** — copy an existing `<article class="event">` block and swap the content.
- **New photos** — drop them in `assets/img/` and reference them from a `.shots` block.

## Notes on the build

- **Accessibility** — skip link, visible focus rings, `aria` attributes on the nav and
  lightbox, alt text on every photo, and full keyboard support (Escape closes the menu and
  the lightbox).
- **Motion** — every animation is disabled under `prefers-reduced-motion`, including the hero
  canvas, which also pauses when scrolled out of view or when the tab is hidden.
- **Performance** — one CSS file, one JS file, no libraries; photos are compressed and
  lazy-loaded below the fold.
- **Responsive** — breakpoints at 1080px, 860px and 620px; verified with no horizontal
  overflow at 375px.
- **Social sharing** — Open Graph and Twitter card meta plus a generated `og-cover.jpg`.

---

Built for EvolVIT · VIT Bhopal University · 2025–26
