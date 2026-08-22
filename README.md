# MATSCI 323

Course website for **MATSCI 323**, Stanford University.

Live site: <https://ophusgroup.github.io/matsci323/>

## Building the site

The site is built with [MyST Markdown](https://mystmd.org/):

```bash
npm install -g mystmd   # or: pip install mystmd
myst start              # local dev server with live reload
myst build --html       # static site in _build/html
```

For the flat top-bar search locally,
run the theme patch once after the template has been downloaded (any
`myst build`/`myst start` downloads it), then restart the dev server:

```bash
myst build && python3 scripts/patch_theme.py && myst start
```

Re-run the patch whenever `_build/` is cleared.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow in
`.github/workflows/deploy.yml`, which fetches the theme, applies
`scripts/patch_theme.py` (flat search bar), builds
the site, and publishes it to GitHub Pages. One-time setup on GitHub:
repository **Settings → Pages → Source → GitHub Actions**.

## Layout

- `index.md`: landing page
- `myst.yml`: site config, navigation, and table of contents
- `assets/`: images and figures
- `style.css`: theme overrides for the MyST book-theme
- `scripts/patch_theme.py`: theme patch (flat top-bar search)
