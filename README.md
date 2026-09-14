# cvedeck-site

The static site behind [cvedeck.com](https://cvedeck.com). The application
itself lives at [reprodev/cvedeck](https://github.com/reprodev/cvedeck).

Plain HTML and CSS with no build step. The only JavaScript is
`assets/copy.js`, which adds copy buttons to code blocks. Served by GitHub Pages
from `main`.

| Path | Page |
| --- | --- |
| `index.html` | Overview |
| `prioritisation/` | KEV, then EPSS, then CVSS |
| `honest-reporting/` | Partial, stale, never-scanned and unknown results |
| `distributions/` | Supported distributions and how matching works |
| `self-host/` | Demo mode, install, feeds and security notes |
| `404.html` | Not found (uses root-absolute paths) |

Every page repeats the same `<header>` and `<footer>`. Only the `aria-current`
on the nav link differs, so change them everywhere at once. Pages use
root-absolute links (`/assets/...`), so preview through a local server rather
than opening files directly. When adding a page, also add it to `sitemap.xml`.

Every capability claim should trace to the application's README,
DEPLOYMENT.md or docs/SCANNING_PROVENANCE_AND_METHODOLOGY.md.

## Rules this site keeps

- **No third-party requests.** Fonts are vendored in `assets/fonts/` (SIL OFL,
  licence alongside), and every page carries a Content-Security-Policy that
  allows only same-origin styles, fonts and images.
- **JavaScript only where it earns its place.** A page with `.code` blocks loads
  `/assets/copy.js` and adds `script-src 'self'` to its CSP. Other pages allow
  no script at all. The script creates the buttons itself, so without
  JavaScript the page simply has no buttons. No inline scripts, and nothing
  from another origin.
- **Screenshots come from demo mode only** (`CVEDECK_DEMO_MODE=true`, a
  fictional `*.lan` fleet). Never from a real dashboard: hostnames inside an
  image can't be caught by any text check. The current set was taken from the
  published 0.7.1 image on localhost, before and after **Refresh intel**, and
  checked by eye before cropping.
- **The logo** in `assets/img/logo-*.svg` is copied unchanged from the app
  repo's `docs/assets/`, and `favicon.svg` is its icon tile. Neither is covered
  by the site licences (see LICENSE-CONTENT).
- **Placeholders only:** `192.168.1.50`, `192.0.2.0/24` (RFC 5737),
  `example.com`.
- **Copy doesn't overclaim.** Linux over SSH only. Windows hosts can be
  enrolled but not scanned. A partial scan is partial and unknown is unknown.
- **Red is for exploitation alone.**

## Preview locally

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000/>.

## Licence

Site code is MIT, and written text and images are CC BY 4.0. The CveDeck name
and logo aren't covered, the fonts stay under the SIL OFL, and the application
itself is AGPL-3.0. See [LICENSE](LICENSE) for the MIT text and
[LICENSE-CONTENT](LICENSE-CONTENT) for the content licence and exclusions.

## security.txt

[`.well-known/security.txt`](.well-known/security.txt) (RFC 9116) lists the
reporting contacts. Its `Expires` field must stay in the future and should be
less than a year ahead, so move it forward before 2027-09-01.

## Hooks

`.githooks/` holds the same commit and push checks as the application repo
(secrets, credential-like files, force-added ignored files). Enable them with:

```sh
git config core.hooksPath .githooks
```

An optional, never-committed `.githooks/local-denylist` adds personal patterns.
