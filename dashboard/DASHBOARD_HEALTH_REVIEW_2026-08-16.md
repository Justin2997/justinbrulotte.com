# Dashboard health review

Date: 2026-08-16

Production: <https://dashboard.justinbrulotte.ca/>

Repository area: `dashboard/`

## Verdict

The dashboard is online and renders, but it is not reliable as an operations report. Weather and Trello requests return data, the portfolio link works, and the current source builds successfully. The task metrics are materially incorrect, several empty-data charts render invalid percentages, and the public client contains a Trello credential with direct access to personal task data.

Treat the dashboard as **partially working and not production-safe** until the P0 and P1 items below are complete.

## Evidence collected

| Check | Result | Evidence |
| --- | --- | --- |
| Public availability | Pass | HTTPS returned `200` from Netlify and the page rendered without console warnings or errors during the check. |
| Portfolio entry point | Pass | The live French homepage links “Tableau de bord” to the production dashboard. The English and French local pages point to the same `.ca` URL. |
| Weather | Pass | The page returned a current five-day Sherbrooke forecast for August 17–21, 2026, with no broken weather images. |
| Trello connectivity | Partial | Trello data loaded, but “Completed today” and “Today Tasks” both displayed 898 items. The code returns every open card in the `Done` list and does not filter that list by completion date. |
| Task summaries | Fail | The same page showed 898 completed today, 0 this month in the overview, and 556 this month in a separate card. These cannot all describe the same period. |
| Historical charts | Fail | Monthly cards displayed zero totals with `NaN%` category percentages. Their code is fixed to the previous calendar year and divides by zero for empty months. |
| Weekly goals | Inconclusive | The integration completed and returned 0 goals, but the UI has no source timestamp or diagnostic detail to distinguish a genuinely empty list from a stale workflow. |
| Sports | Inconclusive | The four Google Sheets requests completed and the UI displayed 0 activities for August. There is no last-updated time, source health, or stale-data warning. |
| Production/source parity | Pass | The deployed source map was available and the deployed contents of the Trello hook, Strava hook, dashboard composition, and daily report matched the current local files exactly. |
| Local build | Pass with caveat | `npm run build` succeeded with Node 23.6.0. The former Node 16 workaround now fails because a locked dependency expects the global Web Crypto API. |
| Automated tests | Fail | No test or spec files exist under `dashboard/src`. The CI test command did not complete and had to be stopped. |
| Dependency audit | Fail | `yarn audit --groups dependencies` reported 59 high and 9 moderate affected dependency paths, with 0 critical. Several forced `resolutions` are incompatible with the versions requested by the dependency tree. Counts include repeated paths, not necessarily 68 unique vulnerabilities. |

## Findings and required work

### P0 — Contain exposed access and personal data

1. Revoke and rotate the deployed Trello token. `REACT_APP_TRELLO_TOKEN` is used directly by browser code, so Create React App substitutes the value into the public JavaScript bundle. Removing the source map alone does not make that token private.
2. Move Trello access behind a server-side endpoint, such as a Netlify Function. Store the token only in server environment variables and return an allowlisted, redacted dashboard response.
3. Decide whether the dashboard is public or private:
   - If private, restore access control at the edge or application level before exposing task data again.
   - If public, explicitly allowlist every field and category that may be published. The current code hides names only when the first label is exactly `SERVICE NOW`; other personal task names remain public.
4. Until the token has been rotated and server-side access exists, consider temporarily removing the dashboard links from both `index.html` and `fr.html`, or protect/disable the subdomain.
5. Restrict the Google and OpenWeather browser keys by domain and API scope. They are browser keys by design, but they should not be unrestricted.

### P1 — Correct the task model and calculations

1. Define what “completed” means. A Trello card due date is not a completion timestamp. Prefer the Trello action that moves a card into `Done`, or persist a trusted `completedAt` value in the server-side aggregation.
2. Replace the current “today” source. `useTrelloTasks` currently returns all open cards in the current board’s `Done` list, which produced 898 items. Filter by the trusted completion timestamp and the dashboard timezone.
3. Use one normalized dataset for today, yesterday, week, month, and category totals. The current dashboard mixes the current board’s `Done` list with a separate archive board, producing contradictory totals.
4. Include both year and month in every period filter. `NumberOfTaskByMonth` compares only the month number, so it combines August records from different years.
5. Include the ISO week-year when comparing weeks. Week number alone can combine records from different years.
6. Correct the weekly chart labels: the current list starts with Saturday, omits Sunday, and ends with a second Saturday.
7. Make historical chart periods explicit. The 12 monthly category cards are hard-coded to `current year - 1`; their titles do not say which year they represent.
8. Handle empty datasets before calculating percentages. Render `0%` or an empty-state message instead of `NaN%`.
9. Add unit tests for timezone boundaries, January/December transitions, ISO week-year transitions, missing due/completion dates, empty datasets, and multiple years of records.

### P1 — Add integration failure and freshness states

1. Add `try/catch` and explicit error state to the Trello hook. A rejected Trello request currently leaves several widgets in an endless loading state.
2. Give Trello, Strava/Google Sheets, and weather separate health states so one failed source does not block unrelated summary content.
3. Replace the unconditional “Live data” badge with a real `last refreshed` timestamp and a stale/error badge.
4. Remove `console.log(lastWeekList)`, which sends task objects to every visitor’s browser console on each refresh.
5. Validate external payloads before rendering. The Google Sheets path assumes all four sheets, columns, and locale-formatted dates are present.

### P2 — Reduce load and simplify the product

1. Stop fetching every list and every archived card directly from the browser every 30 seconds. Aggregate once server-side, cache the sanitized result, and refresh at a reasonable interval.
2. Remove the unused board-info request and replace the sequential per-list Trello requests with a smaller documented query or controlled concurrency.
3. Decide whether the Google Sheets-based Strava widgets still provide value. If the sheets are no longer maintained, remove the widgets rather than displaying unexplained zeros.
4. Replace the 40-entry weather list with a daily summary if the goal is a five-day scan.
5. Keep the useful overview at the top, and remove or collapse the twelve repetitive historical cards unless they answer a current question.

### P2 — Modernize, document, and harden delivery

1. Replace the unsupported Create React App/React 16/Material UI 4 stack with a maintained build setup. Vite is the smallest fit for this static client after data access moves server-side.
2. Remove forced dependency resolutions and update the lockfile through supported package upgrades. Re-run the audit and document any accepted build-only risk.
3. Standardize the supported runtime in `.nvmrc` or `.node-version` and CI. Current evidence supports Node 23 locally; Node 16 is no longer compatible with the locked tree. Prefer an active LTS version when modernizing.
4. Expand `.env.example`. It currently documents only analytics, while the code also expects Trello, Google Sheets, Strava sheet, and OpenWeather variables. Server-only secrets must be clearly separated from browser-safe configuration.
5. Add a project-specific README with local setup, data contracts, privacy rules, build/test commands, deployment ownership, and rollback steps. The existing README is still the upstream dashboard-template README.
6. Add a CI smoke test that builds the app and verifies the key empty, loading, success, and integration-error states.
7. Disable public production source maps unless they are intentionally required for a protected error-monitoring workflow.
8. Add Netlify security headers, including a Content Security Policy, `X-Content-Type-Options`, and `Referrer-Policy`. HSTS is already present.

## Recommended sequence

1. **Contain:** rotate the Trello token and protect or temporarily delist the dashboard.
2. **Stabilize data:** introduce a server-side sanitized aggregation endpoint and one trusted completion timestamp.
3. **Repair the report:** fix period calculations, zero states, source health, and refresh timestamps.
4. **Verify:** add deterministic data fixtures and browser smoke coverage for desktop and mobile.
5. **Modernize:** move off Create React App and clear the dependency audit without forced incompatible resolutions.
6. **Republish:** deploy, verify the real `.ca` route, then restore the bilingual portfolio links if they were removed.

## Definition of done

- No Trello token or other privileged credential is present in the public HTML, JavaScript, or source maps.
- Public responses contain only explicitly approved task fields and categories.
- Today, yesterday, week, month, and year totals are derived from the same completion model and agree with a known fixture.
- Empty periods render clear zero/empty states and never display `NaN`, `undefined`, or an endless spinner.
- Each external source shows success, stale, or error status plus its last successful refresh time.
- The production build runs on a documented active LTS Node version.
- Unit tests and an end-to-end production smoke test pass.
- The dependency audit has no unreviewed high or critical findings.
- Both English and French portfolio links open the verified production dashboard, if the dashboard is meant to remain public.

## Commands used for this review

```sh
npm run build
yarn audit --groups dependencies --level high --json
CI=true npm test -- --watchAll=false
```

The build completed. The audit reported the counts above. The test command did not finish and was stopped; no test files were found under `dashboard/src`.
