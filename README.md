# Abolfazl Sajadi's portfolio

Production: https://abolfazlsajadi.com/

The visitor-facing website is static HTML, CSS and JavaScript. Local images,
responsive AVIF/WebP sources, circuit graphics and signal separators are retained.
The online editing layer is Pages CMS, which uses GitHub sign-in and repository
access. Its code is not loaded by visitors.

## Edit online

See [the editor guide](docs/EDITOR.md). The editor entrance is `/admin/`.
The owner must connect the Pages CMS GitHub app to this repository once.

Editable content lives in `content/*.json`. `.pages.yml` defines the forms:

- Student supervision with an expandable list of completed bachelor’s theses.
- Existing homepage introduction, PROACT, experience, projects, publications,
  education, skills, honors, teaching and activity text.
- The four thesis pages and each page's search/sharing title and description.
- CV PDF uploads and selection of the downloadable file.

Adding a new project card, section or circuit graphic remains a layout change.
The forms edit the existing text and allow adding/removing completed thesis entries.
This keeps the current design stable while supporting routine updates.

## Build and preview

```sh
npm ci --ignore-scripts --no-bin-links --no-audit --no-fund
npm run build:site
npm test
python3 -m http.server 8092 --directory _site
```

Open `http://localhost:8092/`. Node 24 is used by the publishing workflow.
`--no-bin-links` supports external drives without symbolic links.

- `content/`: editable text and PDF selection; authoritative for routine content.
- `templates/`: page layout with content placeholders; edit these for layout changes.
- `scripts/cms-bindings.json`: typed mapping between forms and template placeholders.
- `styles.css`, `script.js`: readable sources.
- `styles.min.css`, `script.min.js`: generated production assets with hashed versions.
- Root HTML: generated static pages, retained for the existing local preview workflow.
- `_site/`: generated public artifact; ignored in Git.

Commit the content, templates, sources and generated HTML/minified files together
when editing locally. Online edits only commit content; Actions rebuilds the pages
and deploys them. After pulling an online edit, run `npm run build` before previewing.
Do not edit generated HTML as the only source: the next build replaces it.

Publishing on a push to `main` renders all content, minifies assets, validates
content and local links, and uploads only `_site/`. Build tools, templates, tests
and content-source JSON are not included in the public artifact. A failed check
stops deployment and leaves the previous live site available.

The portrait preload and `<picture>` sources must use the same candidates and
rendered sizes. No front-end package or editor library is required by visitors.
