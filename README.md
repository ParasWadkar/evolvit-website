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
| Join | Recruitment CTA + FAQ, linking to `apply.html` |

All content is sourced from the official **EvolVIT Club Record 2025–26**, including the club
logo and event photography.

---

## Structure

```
.
├── index.html              # the main page
├── apply.html              # recruitment form (front end only, no backend)
├── assets/
│   ├── css/styles.css      # design tokens -> base -> components -> sections -> responsive
│   ├── css/apply.css       # form styles for apply.html
│   ├── js/main.js          # nav, scroll reveal, counters, hero canvas, lightbox
│   ├── js/apply.js         # form validation, counters, local draft, success state
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

## Before you publish: connect the form

`apply.html` is a complete, working front end for recruitment — validation, character
counters, a draft saved in the visitor's own browser, and a success screen — but it has
**no backend**, so submissions are not stored or emailed anywhere. The page says so plainly
in an amber notice, so nobody thinks they have applied when they haven't.

To make it live, pick one:

- **Google Form** — easiest. Create the form, then either point the `Apply to join` buttons
  straight at it, or keep this page and POST to the form's `formResponse` endpoint.
- **Formspree / Getform / Basin** — set `action="https://formspree.io/f/XXXX"` and
  `method="post"` on `<form id="applyForm">` in `apply.html`, then delete the
  `e.preventDefault()` branch in `assets/js/apply.js`.
- **Club portal** — the Quantumard project management system already has role-based auth;
  POST the same field names to it.

Field names are already sensible and stable: `name`, `reg`, `email`, `phone`, `year`,
`branch`, `team1`, `team2`, `skills[]`, `why`, `built`, `portfolio`, `hours`, `internship`,
`consent`.

When the form is connected, remove the `.demo-note` block from `apply.html`.

All other links are live: Instagram (`@evolvitclub_vitb`), LinkedIn
(`linkedin.com/company/evolvit-club`), and the member projects (`uprole.me`, `pracup.co.in`).

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
