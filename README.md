# MVJCE Championship Hub

Responsive inter-department sports fixtures, scores, standings and animated match arenas.

## Features

- Filter matches by event, department, date and status.
- Use three direct views: Matches, Standings and Contacts. Event and status are immediately available; date and department are under More filters. Browser Back/Forward and direct links work, and selections persist between views.
- View scores in animated arenas for all 10 registered sports. Events without fixtures have an arena preview with no invented teams, dates or scores.
- See period-by-period scorecards and department medal standings.
- Replay or pause arena entrances; reduced-motion preferences are respected.

## Event data

The supplied event roster is stored in `data.js` under `eventGroups`:

- **Boys:** Kho Kho, Kabaddi, Football, Basketball, Cricket, Volleyball, Handball, Chess, Table Tennis.
- **Girls:** Table Tennis, Kabaddi, Volleyball, Throwball, Chess.

The picker groups all 14 events by category. Only sample fixtures matching a registered sport/category pair appear. Men/Women labels map to Boys/Girls; legacy examples outside the roster and unassigned Open entries remain in the source but are hidden.

All current fixtures, scores, dates, venues, department lists and medal rules are sample data. The website is an independent design preview. It does not connect to a live scoring service.

Edit `data.js` to add approved event records. Add approved coordinator entries to `coordinators` using `{ sport, name, phone, email }`. Real-time scoring requires a trusted data service.

The sample medal rule is gold = 5 points, silver = 3, bronze = 1. All match times display in IST.

## Run locally

No build or dependency installation is required. Serve this directory with a static web server, for example:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

This repository is ready for branch-based publishing: **Settings → Pages → Deploy from a branch → main → / (root) → Save**.

All application files use relative paths, so project-site URLs are supported. `.nojekyll` keeps publishing static files without Jekyll processing.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `data.js` | Fixtures, standings and contacts |
| `app.js` | Filtering, scorecards and navigation |
| `courts.js` | Sport-specific SVG arenas and controls |
| `styles.css`, `courts.css`, `compact.css`, `simple.css` | Styling, animation and simplified layout |

## External assets

Fonts: DM Sans and Barlow Condensed via Google Fonts, with system fallbacks. Hero photograph: Unsplash image `photo-1521412644187-c49fa049e84d`. Arena surfaces and camera effects are original SVG/CSS illustrations, not player tracking.

New court illustration references: [KKFI](https://khokhofederation.in/rules-regulations/), [Rajasthan government](https://nrega.rajasthan.gov.in/Upload/circulars/Panchyatkhel_sankul.pdf), [IKF](https://www.kabaddiikf.com/images/new-IKF_Rules.pdf), [IHF](https://www.ihf.info/sites/default/files/2020-05/H%40S%20Booklet.pdf), [TFI](https://throwballindia.org/court-of-throwball). Kabaddi layouts distinguish Boys' and Girls' events. Arena geometry is illustrative, not a campus measurement claim.
