# Dashboard implementation status — 2026-08-19

I implemented the core plan items in code.

## Done

- [x] Reworked Trello metric source for correctness in `dashboard/src/utils/hooks/useTrelloTasks.js`
  - Completed counts now use completion activity timestamps (`dateLastActivity`) instead of due-date assumptions.
  - Today/yesterday filtering uses true calendar-day checks.
  - Label buckets for last 30 days and last 7 days also use completion timestamps.
  - Missing Trello list names and malformed dates are handled safely.
  - Added safer error path for missing Trello proxy endpoint/credential state.
  - Added basic guard for fetch failures so the UI resolves to empty states instead of staying indeterminate.
- [x] Moved Trello fetches into a Netlify Edge Function in `dashboard/netlify/edge-functions/trello-dashboard.js`
  - Endpoint: `/api/trello-dashboard`.
  - Dashboard now consumes `REACT_APP_TRELLO_DASHBOARD_ENDPOINT` (defaults to `/api/trello-dashboard`) from `dashboard/src/utils/hooks/useTrelloTasks.js`.
  - `REACT_APP_TRELLO_BOARD_KEY` / `REACT_APP_TRELLO_TOKEN` removed from frontend requirement.
- [x] Fixed month/year edge cases and zero-safe logic
  - `dashboard/src/views/reports/DashboardView/NumberOfTaskByMonth.js`
  - `dashboard/src/views/reports/DashboardView/TaskReparticionOfMonth.js`
  - `dashboard/src/views/reports/DashboardView/TaskWeekDistribution.js`
  - `dashboard/src/views/reports/DashboardView/DailyReport.js`
  - Year wrapping and division-by-zero edge cases addressed.
- [x] Hardened labels rendering against missing labels
  - `dashboard/src/views/reports/DashboardView/TodayTasks.js`
  - `dashboard/src/views/reports/DashboardView/YeasterdayTasks.js`
  - `dashboard/src/views/reports/DashboardView/WeekGoals.js`
- [x] Made Strava sheet reads resilient to missing arrays/invalid date strings
  - `dashboard/src/utils/hooks/useAllStravaActivity.js`
- [x] Added missing Dashboard environment keys to
  - `dashboard/.env.example`
- [x] Fixed React month-card key warning
  - `dashboard/src/views/reports/DashboardView/index.js`

## Remaining (manual / infra)

- [x] Move Trello credentials out of client bundle (server-side function/proxy).
- [ ] Make sure the Netlify deployment is actually using the edge function config (dashboard route still serves SPA HTML at `/api/trello-dashboard` even after fixes; indicates config/routing may still be on previous build context).
- [ ] Lock dashboard access (auth or allow-list).
- [ ] Add explicit data freshness/error UX in UI (last-updated timestamps + retry).
- [ ] Review OpenWeather API key exposure and enforce key restrictions.
- [ ] Decide whether to keep all current public charts after data aggregation hardening.
