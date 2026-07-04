# StratoTech Aerospace & Defence — website

A fully static site. No backend, no database, no forms, no analytics,
no third-party requests of any kind. Every font, icon and image is
bundled inside this folder and served from your own domain.

```
stratotech-site/
├── index.html
├── about.html
├── leadership.html
├── solutions.html
├── contact.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── products/
│   ├── stealthtex.html
│   ├── composites.html
│   ├── ais-nsm.html
│   └── uav-systems.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── fonts/   (self-hosted IBM Plex Serif/Sans/Mono, .woff2)
    └── images/  (favicon + leadership photos)
```

## 1. Running it locally

Don't open the HTML files by double-clicking them — some things (like
the active-nav-link script) behave oddly over `file://`. Instead, serve
the folder over `http://localhost` with any of these:

**Easiest — VS Code**
1. Install the free "Live Server" extension.
2. Open this folder in VS Code, right-click `index.html` → *Open with
   Live Server*. It reloads automatically every time you save a file.

**Or — one terminal command** (no install needed if you have Python):
```bash
cd stratotech-site
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

Edit any `.html` file in a text editor, save, refresh the browser —
that's the whole workflow. The CSS lives in one place
(`assets/css/style.css`) and is shared by every page, so a style change
there updates the whole site at once.

## 2. Editing content

- Text: open the relevant `.html` file and edit directly. Section
  boundaries are marked with HTML comments and CSS classes like
  `class="hero"`, `class="section"` — the layout won't break as long as
  you edit text between existing tags rather than deleting tags.
- **Phone number**: `contact.html` currently has a placeholder
  (`+91 00000 00000`) marked `<!-- TODO: replace with your real number -->`.
  Find and replace it before going live — the deck didn't include a
  phone number, only `info@stratotech.co`.
- Colors/fonts/spacing: all in `assets/css/style.css`, under
  `:root { ... }` at the top for the color and font tokens.
- Adding a page: copy an existing page closest in structure, keep the
  same `<head>` block and header/footer, change the `<main>` content.

## 3. Security checklist (why this setup is already low-risk)

- **No data collection.** There is no form, no database, no cookies, no
  analytics script, no third-party embed anywhere in this build. The
  contact page uses plain `mailto:` and `tel:` links — clicking one
  opens the visitor's own email or phone app; nothing is transmitted to
  or stored on your site.
- **No third-party network requests.** Fonts are bundled as local
  `.woff2` files instead of pulling from Google Fonts or any CDN, so
  visiting the site makes zero calls to anyone but your own host.
- **A Content-Security-Policy is already set** (see the `<meta
  http-equiv="Content-Security-Policy">` tag in every page's `<head>`)
  restricting the page to only load its own scripts/styles/fonts/images.
  This is defense-in-depth on top of the fact there's nothing risky to
  load in the first place.
- **Before going live, also do this at the hosting level** (the meta
  tag above can't do everything a real HTTP header can):
  - Turn on **HTTPS/SSL** — see step 4 below.
  - If your host lets you add an `.htaccess` file (Network Solutions'
    shared Linux hosting does), add these headers for extra protection:
    ```apache
    <IfModule mod_headers.c>
      Header always set X-Content-Type-Options "nosniff"
      Header always set X-Frame-Options "DENY"
      Header always set Referrer-Policy "no-referrer-when-downgrade"
      Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    </IfModule>
    ```
  - Keep FTP/File Manager credentials private and use SFTP over plain
    FTP if your host offers it (Network Solutions supports both).

## 4. Deploying to Network Solutions hosting

You bought the domain at Network Solutions; if you host there too,
everything lives under one account.

1. **Confirm you have a hosting plan** (domain registration alone
   doesn't include hosting/file storage — it's usually a separate
   add-on/purchase in your Network Solutions account).
2. **Find your web root.** Log in → hosting control panel → *File
   Manager*. Your site's files belong in the `public_html` folder (some
   older Windows plans use `htdocs` instead — the File Manager will
   show whichever one is yours).
3. **Upload the files.** Two options:
   - *File Manager* (browser-based, fine for this site's size): open
     `public_html`, use *Upload*, and upload everything inside
     `stratotech-site/` — keep the folder structure (`assets/`,
     `products/` etc.) intact.
   - *FTP client* (e.g. FileZilla — steadier for uploading many files
     at once): connect to host `ftp.yourdomain.com` with your hosting
     username/password, then drag the contents of `stratotech-site/`
     into `public_html`.
4. **Enable HTTPS.** Network Solutions sells/issues SSL certificates
   through the same control panel (*Security → SSL*), and shared
   hosting plans typically walk you through installing it in a few
   clicks once issued. If you're unsure whether your specific plan
   includes a free certificate or requires purchasing one, that's worth
   a quick check with their support chat before launch — don't publish
   the real site over plain HTTP.
5. **Point the domain**, if it isn't already: in Network Solutions'
   *Domain* dashboard, make sure the domain's nameservers/DNS point at
   your Network Solutions hosting (this is usually automatic if you
   bought hosting and domain together).
6. **Test the live site** the same way you tested locally: click every
   nav link, check the mobile menu on your phone, confirm the padlock
   shows in the address bar.

### Alternative: free modern hosting
If you'd rather not manage FTP/File Manager at all, this site (being
plain static files) also deploys by drag-and-drop to Netlify or
Cloudflare Pages — both give you automatic HTTPS and a CDN for free —
and you'd then just point your Network Solutions domain's DNS at
whichever one you pick. Only worth mentioning if File Manager/FTP ever
feels like a hassle; Network Solutions hosting works fine on its own.

## 5. Before you tell people it's live

- Replace the placeholder phone number in `contact.html`.
- Swap the domain placeholder in `sitemap.xml` for your real one.
- Double-check the UAV comparison table figures in
  `products/uav-systems.html` — a couple of numbers in the original
  spec sheet had inconsistent units and are worth a sanity check with
  your engineering team before they're quoted to a customer.
- Run a quick link check (click every link once) — nothing calls out
  to an external service, so a broken link is the only likely failure
  mode.
