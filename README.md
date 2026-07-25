# Ahmed Mahmoud — Portfolio Site

## What changed

The old export was a WordPress theme mirror (65 files just in the theme folder, plus
plugins, wp-includes, xmlrpc endpoints, RSD/oEmbed links, a Pinegrow backup folder,
and a full duplicate copy of the entire site nested inside itself). Checking what
`index.html` actually loaded turned up:

- Only 2 of 14 theme CSS files were linked, the rest (owl carousel, bxslider,
  colorbox, superfish, nivo-lightbox, isotope, odometer, stellar) were dead weight.
- Two different jQuery builds loaded on the same page (a slim build and a full
  build), which is a bug, not a feature.
- Four inline `<style>` blocks totaling over 100 KB of WooCommerce, blog, and
  portfolio selectors, none of which apply to a one-page resume site.
- A broken favicon tag and a broken Font Awesome script path (relative path to a
  CDN URL, which can't resolve).
- Two duplicated Google Fonts requests pulling in ~25 unused font families.
- Testimonial cards using the theme's demo photos and demo review text (about a
  restaurant website and "Luzuk themes"), not anything related to Ahmed.
- `xmlrpc.php`, `wp-json` feed links, `wlwmanifest.xml`: WordPress admin/API
  plumbing with no purpose on a static export.

This version is a clean rebuild: one HTML file, one CSS file, one JS file, your
real photo, and your CV. Total site weight went from 27 MB to about 1.1 MB
(870 KB of that is the CV itself).

## What's inside

```
index.html              the whole page
assets/css/style.css    all styling, dark/light theme included
assets/js/main.js       all interactivity (vanilla JS, no jQuery)
assets/img/profile.jpg  your photo, used as headshot and favicon source
assets/img/favicon.png  generated favicon
cv.pdf                  your resume, linked from the download buttons
```

## Content changes worth knowing about

- Replaced the demo testimonial cards with a real **Awards & Achievements**
  section using your three actual recognitions (LG MEA Idea Competition 2016,
  Axiom Thanking Letter 2009, RAYA Best Team Leader 2005).
- Added the Egyptian Naval Forces entry (2001–2004) to the experience timeline,
  since it was present in your file but missing from the live site.
- Fixed the WhatsApp link (`http://whatsapp.com/` didn't go anywhere) to a direct
  `wa.me` chat link using your phone number.
- Kept the Google Form for the contact section, but it now loads only when you
  click "Open contact form" instead of loading on every visit.

## Effects included

Sticky nav that condenses on scroll, animated gradient hero background with a
lightweight particle network, typewriter role text, scroll-reveal animations,
animated counters and skill bars, a mobile slide-in menu, an awards grid with
hover lift, a scroll-progress bar, a back-to-top button, and a dark/light theme
toggle that remembers your choice.

## Deploying

**Cloudflare Pages**: unzip, then either drag the folder into the Pages dashboard
(Direct Upload) or push it to the GitHub repo connected to your
`ahmedmahmoud.pages.dev` project. No build command needed, it's static files.

**GitHub Pages** (`ahmedmmahmoud.github.io`): unzip and push the contents to the
root of that repo's default branch, or to `/docs` if that's what Pages is
configured to serve.

Either way, the whole folder (`index.html`, `assets/`, `cv.pdf`) needs to stay
together with the same relative paths.
