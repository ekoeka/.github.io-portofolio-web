# Project context

## Owner and purpose

Eka is an Electrical Engineering student at Telkom University, interested in embedded systems, IoT, FPGA, AI, computer vision, control systems, electronics, software development, and Linux. This site is an existing portfolio, not a greenfield project.

## Current technical direction

- Static site using HTML, CSS, and vanilla JavaScript.
- `index.html` lists portfolio sections; `detail.html` presents project details.
- Google Sheets published as CSV is intended to remain the editable content source. The first Skills column is used as a display group; its actual sheet header and intent still need verification.
- Six sheets/categories: Projects, Education, Skills, Experience, Achievements, Courses and Certifications.
- Font Awesome is loaded from CDN.
- Desired visual direction: professional, modern, restrained engineering aesthetic; black/blue/green palette; readable, responsive, light and dark modes.

## Project ideas (not verified publication content)

CNN_FPGA-26; 2-DOF solar tracker; Smart Plant IoT (described as a final project in development); ESP32-S3 CAM with remote YOLO inference; Cursed Signal game; Linux server and virtualization exploration. Verify status, details, and results with Eka before publishing claims.

## Constraints

Do not replace the framework, remove working features, change spreadsheet URLs or columns, fabricate portfolio facts, expose unnecessary personal information, or push to `main` without approval. Keep dependencies minimal and make staged changes.

## Audit scope and uncertainty

The audit inspected the four tracked-looking root files visible in the workspace: `index.html`, `detail.html`, `style.css`, and `README.md`. No live browser, spreadsheet contents, deployment configuration, or repository history was verified. The published CSV URLs and their current sheet schemas are present in source, but fetch availability and actual header/row contents remain unverified.
