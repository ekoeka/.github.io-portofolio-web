# Coding agent instructions

- Preserve the existing static HTML, CSS, and vanilla JavaScript architecture unless Eka explicitly approves a change.
- Keep Google Sheets published CSV as the portfolio content source. Do not change its URL or sheet column layout without approval.
- Treat project examples in `PROJECT_CONTEXT.md` as unverified context, not publishable claims.
- Do not invent personal details, project results, employment, awards, or certifications.
- Make incremental changes; preserve working features and avoid unnecessary dependencies.
- At the end of each development phase, run relevant tests, inspect `git status` and `git diff`, and check that credentials, sensitive files, and temporary files are not included.
- Update `README.md` and `ROADMAP.md` to reflect actual progress, then commit with a clear descriptive message.
- Push updates directly to `main` and verify the push, unless Eka requests another branch. Report the branch, commit hash, commit URL, test results, and remaining issues.
- Merge into `main` and deploy without requesting additional approval when needed for Eka's requested work. Never force-push. If a push fails, report the cause and do not claim success.
- Stop after each phase and wait for review before beginning the next phase.
- For implementation tasks, inspect relevant existing code first and describe what was changed and how it was checked. Do not claim checks that were not run.
- Keep data rendering safe: use DOM text APIs for text and validate URLs before assigning them to links or images.
- Preserve theme choice, accessible controls, responsive layouts, and loading/error/empty feedback when improving the site.
- For each visual update, capture screenshots of the changed interface, save them under `screenshot/YYYY-MM-DD_HH-MM-UTC/`, and include them in the push.
- Preserve the fixed lower-left social sidebar with GitHub, LinkedIn, email icons and its vertical line, adapting it to both themes and mobile without covering content. Keep unverified destinations inactive.
- Keep README, PROJECT_CONTEXT, and ROADMAP current when project direction or structure changes.
