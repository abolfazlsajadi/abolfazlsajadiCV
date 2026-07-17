# Deploying abolfazlsajadi.com — GitHub Pages Guide

This site is **fully static** (HTML + CSS + a small JS file, local assets only).
That means it can be hosted on **GitHub Pages for FREE**. **No paid server, VPS,
or hosting plan is needed — do not buy one.** You only pay for the domain name
`abolfazlsajadi.com` itself (annual registrar fee).

Contents:

1. [What gets deployed](#1-what-gets-deployed)
2. [Create the GitHub repository](#2-create-the-github-repository)
3. [Prepare the site files (assets copy + path rewrite)](#3-prepare-the-site-files-assets-copy--path-rewrite)
4. [Enable GitHub Pages](#4-enable-github-pages)
5. [Custom domain: abolfazlsajadi.com](#5-custom-domain-abolfazlsajadicom)
6. [DNS records at your registrar (exact values)](#6-dns-records-at-your-registrar-exact-values)
7. [HTTPS enforcement](#7-https-enforcement)
8. [Verify the deployment](#8-verify-the-deployment)
9. [Updating the site later](#9-updating-the-site-later)
10. [Fallback options (only if Pages were ever unsuitable — it is not)](#10-fallback-options)
11. [Analytics evaluation (nothing is live yet — read before adding anything)](#11-analytics-evaluation)

---

## 1. What gets deployed

The deployed repository root **is** the site root:

```
<repo root>/
  index.html            — main portfolio page
  thesis-phd.html       — Ph.D. thesis page
  thesis-msc.html       — M.Sc. thesis page
  thesis-bsc.html       — B.Sc. thesis page
  thesis-assoc.html     — Associate thesis page
  styles.css, script.js
  assets/               — images, badges, CV PDF (copied in; see section 3)
  CNAME                 — contains exactly: abolfazlsajadi.com
  robots.txt
  sitemap.xml
  .github/workflows/pages.yml — deploy workflow (no build step)
  docs/DEPLOY.md        — this guide (harmless to deploy; it is public anyway)
```

During development the v4 pages reference shared assets as `../../assets/...`
(they live in `CV_2026/website/variants/v4/` and the assets in
`CV_2026/website/assets/`). For standalone deployment the assets are copied into
the repo and the paths rewritten — section 3 gives the exact commands.

## 2. Create the GitHub repository

Two equally valid options (the account is `github.com/abolfazlsajadi`):

**Option A — user site repo (recommended, simplest):**
Create a repo named exactly **`abolfazlsajadi.github.io`**. GitHub treats this
as your "user site": it publishes from it automatically and serves it at
`https://abolfazlsajadi.github.io` even before the custom domain is set. The
custom domain then simply replaces that URL.

**Option B — any repo name (project site):**
Create a repo with any name (e.g. `cv-website`) and enable Pages on it. Without
a custom domain a project site lives under a sub-path
(`https://abolfazlsajadi.github.io/cv-website/`), which would break root-relative
URLs — but with the custom domain attached, the site is served at the domain
root and behaves identically to Option A.

Either way: the repo can be public or private (GitHub Pages from a **private**
repo requires a paid GitHub plan, so use a **public** repo to stay free — the
site content is public anyway).

```bash
# Using the GitHub CLI (or create it in the web UI):
gh repo create abolfazlsajadi/abolfazlsajadi.github.io --public
```

## 3. Prepare the site files (assets copy + path rewrite)

Clone the new empty repo, copy the v4 site in, copy the shared `assets/`
directory in, and rewrite the development asset prefix `../../assets/` to
`assets/`. Exact commands:

```bash
# 1) Clone the deployment repo and enter it
git clone https://github.com/abolfazlsajadi/abolfazlsajadi.github.io.git
cd abolfazlsajadi.github.io

# 2) Copy the v4 site contents (includes CNAME, robots.txt, sitemap.xml,
#    the .github/workflows/pages.yml workflow, and docs/)
cp -a /media/abish/ExtremePro1/AbishCV/CV_2026/website/variants/v4/. .

# 3) Copy the shared assets directory into the repo root
cp -a /media/abish/ExtremePro1/AbishCV/CV_2026/website/assets ./assets

# 4) Rewrite the development asset prefix in ALL html files:
#    '../../assets/' -> 'assets/'
sed -i 's|\.\./\.\./assets/|assets/|g' *.html

# 4b) If styles.css references assets (e.g. background images via url(...)),
#     the same rewrite applies (CSS paths resolve relative to styles.css,
#     which sits in the repo root next to the html files):
sed -i 's|\.\./\.\./assets/|assets/|g' styles.css

# 5) Verify no development paths remain (must print OK):
grep -rn '\.\./\.\./assets/' *.html *.css && echo "FIX THE ABOVE" || echo "OK: no dev paths remain"

# 6) Commit and push
git add -A
git commit -m "Deploy portfolio site"
git push origin main
```

Notes:

- The `sed` uses `|` as the delimiter so the slashes in the path need no escaping.
- Do NOT commit anything from `_review/` or any local screenshots/scratch files.
- Sanity-check `assets/` size before pushing (`du -sh assets/`) — only the
  images, badge PNGs, and the CV PDF belong there.

## 4. Enable GitHub Pages

Two mechanisms — pick ONE:

**A) The included Actions workflow (recommended):**
`.github/workflows/pages.yml` is already in the repo. It uploads the repo root
as-is with `actions/upload-pages-artifact` and deploys with
`actions/deploy-pages`. There is **no build step** — the site is served exactly
as committed.

1. Repo → **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.
2. Push to `main` (or run the workflow manually from the Actions tab).
3. Watch the run under **Actions**; the deploy job prints the live URL.

**B) Deploy from a branch (zero-workflow alternative):**
Settings → Pages → Source: **"Deploy from a branch"** → Branch `main`, folder
`/ (root)`. GitHub then publishes on every push without the workflow. (The
workflow file can stay; with this source setting it is simply not used for
publishing.)

Either mechanism serves identical results. The workflow variant gives you an
explicit deploy log and status per commit.

## 5. Custom domain: abolfazlsajadi.com

1. Repo → **Settings → Pages → Custom domain** → enter `abolfazlsajadi.com` →
   **Save**. GitHub checks for the `CNAME` file — it is **already in the repo**
   (containing exactly `abolfazlsajadi.com`), so the setting persists across
   deploys. Do not delete that file; if it disappears, the custom domain
   setting silently resets.
2. Configure the DNS records at your registrar — next section.
3. Recommended hardening: GitHub account → **Settings → Pages → Verified
   domains** → verify `abolfazlsajadi.com` (add the TXT record GitHub shows
   you). This prevents anyone else from claiming the domain on GitHub Pages.

**Root + www handling:** set the **apex** (`abolfazlsajadi.com`) as the custom
domain in the Pages settings, and ALSO create the `www` CNAME record below.
GitHub Pages then automatically redirects `www.abolfazlsajadi.com` →
`abolfazlsajadi.com` (and serves a certificate for both). Having both is the
recommended setup: visitors typing either form land on the canonical apex URL,
which is also what `sitemap.xml` and the pages' canonical tags use.

## 6. DNS records at your registrar (exact values)

At the DNS panel of the registrar where `abolfazlsajadi.com` is registered,
create **exactly** these records:

**Four A records for the apex (host `@`), one per IP:**

| Type | Host | Value             |
|------|------|-------------------|
| A    | @    | `185.199.108.153` |
| A    | @    | `185.199.109.153` |
| A    | @    | `185.199.110.153` |
| A    | @    | `185.199.111.153` |

**Optional but recommended — AAAA records (IPv6) for the apex:**

| Type | Host | Value                  |
|------|------|------------------------|
| AAAA | @    | `2606:50c0:8000::153`  |
| AAAA | @    | `2606:50c0:8001::153`  |
| AAAA | @    | `2606:50c0:8002::153`  |
| AAAA | @    | `2606:50c0:8003::153`  |

**One CNAME record for www:**

| Type  | Host | Value                       |
|-------|------|-----------------------------|
| CNAME | www  | `abolfazlsajadi.github.io.` |

(The trailing dot is standard DNS notation; some registrar UIs add it
automatically — either is fine. The value is `<username>.github.io`, i.e. your
GitHub username, NOT the repo name and NOT `abolfazlsajadi.com`.)

Remove any conflicting records first: old A/AAAA records on `@`, registrar
"parking"/URL-forwarding records, or a wildcard `*` record pointing elsewhere.
Do NOT create a CNAME on the apex `@` (most registrars forbid it anyway) — the
apex uses the four A records above.

**Propagation:** DNS changes typically propagate within minutes to a few hours,
but can take up to **24–48 h** worldwide depending on TTLs. Check progress with:

```bash
dig +noall +answer abolfazlsajadi.com A        # must list the four 185.199.x.153 IPs
dig +noall +answer www.abolfazlsajadi.com CNAME # must show abolfazlsajadi.github.io.
```

## 7. HTTPS enforcement

After DNS resolves correctly, GitHub automatically provisions a free
Let's Encrypt certificate for `abolfazlsajadi.com` (and `www`). This can take
from a few minutes up to ~1 hour (occasionally up to 24 h) **after** DNS is
correct.

Then: repo → **Settings → Pages → tick "Enforce HTTPS"**. The checkbox is
greyed out until the certificate is issued — if it is not clickable yet, wait
and refresh; if it stays unavailable for a day, remove and re-add the custom
domain to retrigger provisioning.

With "Enforce HTTPS" on, all `http://` requests 301-redirect to `https://`.

## 8. Verify the deployment

- `https://abolfazlsajadi.com/` loads, padlock shown, no mixed-content warnings.
- `https://www.abolfazlsajadi.com/` redirects to the apex.
- `http://abolfazlsajadi.com/` redirects to HTTPS.
- All 4 thesis pages load; images, badge PNGs, and the CV PDF download work
  (these prove the `assets/` copy + rewrite succeeded).
- `https://abolfazlsajadi.com/robots.txt` and `/sitemap.xml` load.
- Optional: submit `https://abolfazlsajadi.com/sitemap.xml` in Google Search
  Console (verify the domain via DNS TXT record).

## 9. Updating the site later

Edit the files, then `git commit` + `git push` — the workflow redeploys
automatically (or the branch publish does). If shared assets changed upstream in
`CV_2026/website/assets/`, re-run step 3 of section 3 (the `cp -a ... ./assets`)
before committing. The `CNAME` file and DNS never need touching again.

## 10. Fallback options

**You do not need these.** GitHub Pages fully covers a static site like this
one. Listed only for completeness, and both are also free:

- **Cloudflare Pages** — free, unlimited bandwidth, connect the GitHub repo,
  "no build command", output directory `/`. Custom domains are easiest if the
  domain's DNS is on Cloudflare. Bonus: makes Cloudflare Web Analytics
  (section 11) a one-click add.
- **Netlify** — free tier (100 GB bandwidth/month, far more than enough), drag
  and drop deploy or connect the repo, custom domain + automatic HTTPS.

To state it plainly once more: **the site needs NO paid server, NO paid hosting
plan, and NO backend.** Anyone advising a hosting purchase for this site is
wrong.

## 11. Analytics evaluation

**Current status: NO analytics are implemented on the site — deliberately.**
The pages load zero external resources (a performance and privacy feature).
This section evaluates the options for later, with a recommendation and a
ready-to-paste (commented-out) snippet. Adding any analytics script is a
conscious trade-off: it introduces the site's first third-party request.

### Comparison

| Service | GDPR posture | Cookie-consent banner needed? | Cost | Works on GitHub Pages? | Notes |
|---|---|---|---|---|---|
| **StatCounter** | Uses cookies and visitor-level tracking (IP, exact location) — personal data under GDPR | **Yes** — consent banner required in the EU | Free tier limited (recent-visitor log capped); paid plans for more | Yes (JS snippet) | Old-school counter; the visitor-level detail is exactly what triggers GDPR consent duties — discouraged |
| **Google Analytics (GA4)** | Processes personal data; EU regulators have repeatedly found configurations non-compliant; data-ownership concerns (data goes to Google) | **Yes** — consent banner required under GDPR | Free | Yes (JS snippet) | Heavyweight script, overkill for a CV site; consent banner would hurt the site's clean UX |
| **Cloudflare Web Analytics** | Cookieless, no fingerprinting, no personal data stored | **No** | Free | Yes — via JS snippet (or automatic if DNS is on Cloudflare) | Lightweight beacon; aggregate pageviews, referrers, countries, browsers |
| **Plausible** | Cookieless, EU-hosted, GDPR-first design | **No** | **Paid**, ~€9/month | Yes (JS snippet) | Excellent but a recurring cost the site doesn't need |
| **Umami (self-hosted)** | Cookieless, you own all data | **No** | Software free, **but needs a server/DB to host** | Snippet yes — but the backend can't run on Pages | Conflicts with the "no server" goal; only sensible if you already run a server |
| **GoatCounter** | Cookieless, no personal data, EU-friendly (made in NL) | **No** | **Free for personal use** (donations welcome) | Yes (tiny JS snippet, < 4 KB) | Shows country, referrer, top pages, device, browser, screen size — everything a CV site needs |

### Recommendation

**GoatCounter** (first choice) **or Cloudflare Web Analytics** (equally good,
especially if the DNS ever moves to Cloudflare). Both are free, cookieless,
GDPR-friendly, require **no consent banner**, and work on GitHub Pages with a
single small script tag.

Explicitly discouraged: StatCounter-style visitor-level tracking (exact
location, IP-based recent-visitor logs). Under the GDPR that is personal-data
processing that requires prior consent — meaning an ugly consent banner — and
it provides nothing a personal CV site actually needs. Aggregate,
cookieless analytics answer the real questions (how many visitors, from where,
which pages, which referrer) with zero legal overhead.

### Ready-to-paste GoatCounter snippet (currently NOT active anywhere)

When (and only when) you decide to enable analytics:

1. Sign up at https://www.goatcounter.com (free for personal use) and pick a
   code, e.g. `abolfazlsajadi` → your dashboard becomes
   `https://abolfazlsajadi.goatcounter.com`.
2. Replace `YOURCODE` below with that code.
3. Paste the snippet just before `</body>` in **all five** HTML pages
   (index + the four thesis pages) and remove the surrounding comment markers.

```html
<!-- GoatCounter — cookieless analytics, no consent banner needed.
     DISABLED by default. To enable: replace YOURCODE with your GoatCounter
     code and remove these comment markers.
<script data-goatcounter="https://YOURCODE.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
-->
```

For Cloudflare Web Analytics instead: create a site in the Cloudflare dashboard
(Analytics → Web Analytics), copy its beacon snippet, and paste it the same way.

### Privacy warnings

- **Never commit API keys, tokens, or credentials** to the (public) site repo —
  not GoatCounter API tokens, not Cloudflare API tokens, nothing. The
  GoatCounter site code in the snippet above is public by design and safe; API
  tokens are not.
- **Keep the analytics dashboard private.** GoatCounter dashboards can be made
  public — leave that OFF (Settings → "Allow adding visitors publicly" /
  public-dashboard options) so visitor statistics are visible only to you.
- Do not add any second tracker "just to compare" — every additional script is
  another third party seeing your visitors.
- If you ever switch to a tool that uses cookies or collects visitor-level
  data, you take on GDPR consent-banner obligations. Prefer not to.
