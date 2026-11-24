# Coding agent instructions

- Preserve the existing static HTML, CSS, and vanilla JavaScript architecture unless Eka explicitly approves a change.
- Keep Google Sheets published CSV as the portfolio content source. Do not change its URL or sheet column layout without approval.
- Treat project examples in `PROJECT_CONTEXT.md` as unverified context, not publishable claims.
- Do not invent personal details, project results, employment, awards, or certifications.
- Make incremental changes; preserve working features and avoid unnecessary dependencies.
- At the end of each development phase, run relevant tests, inspect `git status` and `git diff`, and check that credentials, sensitive files, and temporary files are not included.
- Update `README.md` and `ROADMAP.md` to reflect actual progress, then commit with a clear descriptive message.
- Push automatically to the current development branch and verify the push. Report the branch, commit hash, commit URL, test results, and remaining issues.
- Never force-push, merge into `main`, or deploy without explicit approval. If a push fails, report the cause and do not claim success.
- Stop after each phase and wait for review before beginning the next phase.
- For implementation tasks, inspect relevant existing code first and describe what was changed and how it was checked. Do not claim checks that were not run.
- Keep data rendering safe: use DOM text APIs for text and validate URLs before assigning them to links or images.
- Preserve theme choice, accessible controls, responsive layouts, and loading/error/empty feedback when improving the site.
- Keep README, PROJECT_CONTEXT, and ROADMAP current when project direction or structure changes.
