# Publishing abolfazlsajadi.com

The site remains on GitHub Pages behind the existing Cloudflare domain setup.
No DNS or Cloudflare Worker changes are required for the content editor.

## Current publishing flow

1. A push to `main`, including an online Pages CMS save, starts
   `.github/workflows/pages.yml`.
2. Node 24 installs the locked build dependencies.
3. `npm run build:site` renders `content/*.json` through `templates/*.html`,
   sanitizes rich text, minifies CSS/JavaScript, and prepares `_site/`.
4. `npm test` checks content constraints, repeatable theses, metadata, local
   links, and render behavior.
5. GitHub uploads and deploys only `_site/`.

There is no database or editor code in the public pages. The public artifact
contains HTML, minified CSS/JS, assets, the editor entrance, CNAME, robots.txt and
sitemap.xml. Source JSON, templates, build dependencies and tests are excluded.
A failed build or check leaves the existing deployment in place.

## Local changes

```sh
npm ci --ignore-scripts --no-bin-links --no-audit --no-fund
npm run build:site
npm test
python3 -m http.server 8092 --directory _site
```

Review the local site, commit the named changed files, and push `main` when the
update is ready to publish. Check the GitHub Actions result and then verify the
live site. Cloudflare can retain an older cached response briefly.

The authoritative content is in `content/`; the layout is in `templates/`.
Do not copy the older `CV_2026/website` HTML over this repository. After pulling an
online content edit, run `npm run build` to refresh generated root HTML locally.

## Editor connection

Follow [EDITOR.md](EDITOR.md). GitHub sign-in and installation of the Pages CMS
app on this repository are separate from website deployment. Until the owner
connects that app, the entrance can be live but authenticated editing is not yet
activated.

## Domain and deployment checks

Keep `CNAME` set to `abolfazlsajadi.com` and GitHub Settings > Pages configured to
use GitHub Actions. Keep the current Cloudflare DNS, HTTPS and analytics routes.
The content editor does not require access to the analytics Worker or its secrets.

After a deployment, verify its commit in Actions, retrieve the homepage and a
thesis page, confirm their minified asset versions, and compare at least one
image asset. Cloudflare email protection rewrites HTML, so a raw HTML checksum
can differ even when the correct deployment is served.
