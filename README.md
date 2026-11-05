# MVJCE Championship Hub

A responsive, buildless sports hub for the MVJCE Inter-Department Championship. Serve this directory with any static web server; no dependency installation or build is needed.

## Views

- Fixtures: event, date, department and status filters; schedules and venues; live and completed scorecards.
- Points table: event-specific played/won/drawn/lost records for every department.
- Leaderboard: department wins across all registered events, with Overall, Boys and Girls filters.
- All 14 event categories have animated SVG arenas with replay, pause/resume and reduced-motion support. Events without fixtures offer an arena preview.

## Ranking rule

Departments rank by completed match wins only, as specified by the organiser. Draws and losses do not add wins. Equal win totals share competition rank (1, 1, 3); alphabetical ordering only stabilises the display, not the rank. Departments without a completed result are unranked. No medal weighting or separate points formula is applied.

`rankings.js` is shared by both ranking views. Only the roster-filtered match set is passed into the calculator. Numeric final scores can determine a winner for goals, sets, games or board scores. For cricket, set an explicit `winner` to a department ID; a run/wicket score is never compared as a number. A `result: 'draw'` record counts as drawn. Results without a determinable outcome do not count.

## Event data

The organiser-supplied roster in `data.js` includes:

- Boys: Kho Kho, Kabaddi, Football, Basketball, Cricket, Volleyball, Handball, Chess, Table Tennis.
- Girls: Table Tennis, Kabaddi, Volleyball, Throwball, Chess.

All fixtures, scores, dates, venues and department lists remain sample data. Only one currently registered sample match is completed, so the preview leaderboard has one win. The website has no live scoring API. Replace sample records with approved data; real-time scoring requires a trusted service. All match times display in IST.

Only fixtures with a registered sport/category pair appear. Legacy Men/Women names map to Boys/Girls. Off-roster and unassigned Open examples remain in the source but are hidden.

## Files

- `index.html`: accessible views, navigation, filters and match dialog.
- `data.js`: event roster and sample match records.
- `app.js`: filters, scorecards, views and ranking presentation.
- `rankings.js`: completed-result calculation and tied ranks.
- `courts.js`: original sport-specific SVG arenas and animation controls.
- `styles.css`, `courts.css`, `compact.css`, `simple.css`, `premium.css`, `mobile.css`: responsive styling and motion.

The GitHub export places files at the repository root. Publish main / root through GitHub Pages; `.nojekyll` keeps the site static. All assets use relative paths.

## Assets and accessibility

Typography: DM Sans and Barlow Condensed through Google Fonts, with system fallbacks. Current banner and arena art use original HTML/SVG/CSS. Arena animations illustrate venues, not player tracking. Native dialogs support Escape and backdrop close, return keyboard focus and prevent background scrolling. Reduced-motion preferences disable entrance animations.

## Sites deployment

`.openai/hosting.json` retains the existing project ID and `dist` static directory. Preserve the ID and public audience on future updates.

## Mobile-first interface

Phones use a compact header and fixed bottom navigation for Fixtures, Points table and Leaderboard. Safe-area insets protect controls on notched screens. Primary touch targets are at least 44 CSS pixels high, and native selects use 16px text. A shorter banner brings fixtures into the first screen. Match detail dialogs become scrollable bottom sheets with larger score text and animation controls. Standings fit a narrow screen with a visible P/W/D/L key. Mobile blur effects are reduced while arena entrances remain available. Small landscape windows have larger controls and omit the banner. Desktop styling is retained.

