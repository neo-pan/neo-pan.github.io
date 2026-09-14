# Xuanhao Pan — Academic Homepage

Source code for [neo-pan.github.io](https://neo-pan.github.io), a concise academic homepage covering research interests, publications, and curriculum vitae.

## Local development

```bash
npm install
npm run dev
```

Production builds are generated with `npm run build` and deployed to GitHub Pages through GitHub Actions.

Pull requests run `npm run lint` and `npm run build`; deployment runs only on `main`.
Edit `content/cv.md` to update the CV. Its **Print / Save PDF** button exports the current page through the browser print dialog, so there is no separate PDF to keep in sync.

This site is adapted from [PRISM](https://github.com/xyjoey/PRISM) and retains its MIT license.
