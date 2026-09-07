# Site update — what's inside

- `index.html`, `styles.css` — the deployed site with the priority-1 fixes applied
- `assets/proact-die.jpg` — photo of the fabricated chip, used above the floorplan
- `apply.sh` — copies the files into your repo and commits (see header for usage)

Before running `apply.sh`, export **CV Improved** to PDF and save it here as
`Abolfazl_Sajadi_CV.pdf`; the script will replace `assets/Abolfazl_Sajadi_CV.pdf`
so the "Download CV" button serves the new version at the same URL.

## Changes applied to index.html

1. PROACT stat tile: "Taped out · fabrication in progress" → "Working silicon · fabricated, packaged, brought up"
2. Hero tagline: "…taped out in GlobalFoundries 22 nm (22FDX)." → "…fabricated in GlobalFoundries 22 nm (22FDX) and working in silicon."
3. Real die photo + caption inserted above the stylized floorplan
4. Experience: removed Ryan iMachines, Shahab Co. and the "Earlier" row so it matches the PDF (Shahab remains on the Home-meter project card)
5. Publications: intro reworded; all seven "AI paper memory" links renamed "Summary"
6. Stylesheet cache-buster bumped (`styles.css?v=silicon1`)

## Not changed (your decision needed)

- PhD end date: site says **Feb 2027**, PDF says **Dec 2026**. Search for `FEB 2027` in index.html (3 places) once you decide.
- Priority-2 readability items (section-header decorations, pipeline lane, hero layers, nav grouping) are described in Review Notes and left untouched.
