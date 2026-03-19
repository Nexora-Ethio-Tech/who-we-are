# Nexora Technology PLC Website

Modern, modular single-page website for Nexora Technology PLC.

## Structure

- `index.html` - app entry
- `work-with-us.html` - inquiry page for project requests
- `src/main.js` - app composition and reveal animations
- `src/work-with-us.js` - inquiry form to email composer flow
- `src/data/content.js` - central editable content source
- `src/components/` - reusable UI sections
- `src/styles/main.css` - full visual system and responsive styles

## Run Locally

Because this is a static modular site, you can run it with any static server.

Example using Python:

```bash
cd /workspaces/who-we-are
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Content Updates

To update website text, edit only `src/data/content.js`.

For the inquiry form:

- Set `contact.inboxEmail` for the fallback mail recipient.
- Set `contact.inquiryEndpoint` to your API/form endpoint for direct submission.