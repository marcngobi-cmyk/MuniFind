# MuniFind — Lost and Found Item Board & Claim Tracker

A front-end prototype for the Muni University community, built for ITM 1131 Web Application Development.

## Run the application
1. Extract `MuniFind.zip`.
2. Open the `MuniFind` folder in VS Code.
3. Open `index.html` in a browser (VS Code Live Server is recommended).
4. Internet is needed for the remote sample photographs and Google Fonts. The core interface and sample records still work without them; image placeholders appear if a sample photo cannot load.

## Features
- Three major sections: Home, Report an Item, and Claim Tracker.
- Eight fictional sample records covering lost, found and returned items.
- Keyword search across item name, description, reference, colour, category and location.
- Category, location and status filters, plus sorting.
- Validated lost-item and found-item report form.
- Automatic reference number generation.
- Optional image upload with file-type and 5 MB size checks and an image preview.
- Browser-local report storage using `localStorage`.
- Claim lookup, days-held calculation for found items, and possible-match suggestions based on shared category or location.
- Responsive layout for mobile, tablet and desktop; empty and error states.
- Semantic HTML, connected form labels, external CSS and JavaScript.

## Important prototype limitations
- This is a front-end classroom prototype only. It has no database, server, login, authentication, email/SMS notification or real claim verification.
- New reports and uploaded images are saved only in the browser/device that submitted them. They do not sync between students or devices.
- “Claim” is a guided tracking action, not proof of ownership or a real approval by university staff.
- Sample data and people are fictional. Do not enter confidential or sensitive personal information.
- Sample photos load from external image URLs and therefore require an internet connection.

## Suggested GitHub collaboration
- Coordinator / quality lead: project scope, task board, testing, README and deployment.
- HTML & CSS lead: semantic structure, content, forms, accessibility and responsive layouts.
- JavaScript lead: search, filters, reference generation, validation, calculations and feedback.
- Each team member should commit their own work and be ready to explain it during the demonstration.

## Suggested manual test checklist
- [ ] Search by an item name, category word and reference number.
- [ ] Filter by category, location and status; combine filters.
- [ ] Sort newest, oldest and A–Z.
- [ ] Submit a valid lost report and a valid found report.
- [ ] Try submitting with required fields missing.
- [ ] Upload a valid image, then test an unsupported or oversized file.
- [ ] Track a valid reference and an invalid reference.
- [ ] Check days held for a found sample item.
- [ ] Confirm a new report remains after refreshing the same browser.
- [ ] Test at mobile, tablet and desktop widths.
- [ ] Check keyboard navigation and visible focus on form controls.

## Files
- `index.html` — page structure and forms
- `styles.css` — visual design and responsive layouts
- `script.js` — sample data and application behaviour
