# St. Duke's Montessori School — Website

A fast, mobile-first, conversion-focused school website built with plain HTML, CSS and
vanilla JavaScript — no build step and no external dependencies.

## Pages

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Hero, stats, why-choose-us, programs preview, success stories, testimonials slider, news, tour/apply CTAs |
| About | `about.html` | Mission, values, 35-year history timeline, accreditations, principal's message |
| Programs | `programs.html` | Age-by-age curriculum (18m–12y), skills checklists, clubs, a typical day |
| Admissions | `admissions.html` | 4-step enrollment, key dates, fee table, application form, FAQ, deadline countdown |
| Campus | `facilities.html` | Photo gallery with lightbox, campus stats, safety & wellbeing details |
| Team | `team.html` | Principal, program leads, teacher-quality standards, staff stats |
| News & Events | `events.html` | Upcoming events list with RSVP links, news cards, newsletter signup |
| Contact | `contact.html` | Call/email/WhatsApp/visit cards, tour-booking form, hours, map, directions |

## Features

- Responsive mobile-first layout (hamburger nav, touch-friendly CTAs)
- Conversion elements everywhere: persistent "Enroll" CTA, urgency banner,
  countdown to the application deadline, social proof, click-to-call and
  WhatsApp links on mobile
- Built-in chat assistant ("Duke") that answers questions about fees,
  programs, tours and admissions
- Form validation + success states (leads are stored in `localStorage` for demo
  purposes — wire `data-form` handlers in `js/main.js` to a real backend or a
  form service such as Formspree to make them live)
- SEO: semantic HTML, meta/OpenGraph tags, JSON-LD `School` schema,
  `sitemap.xml`, `robots.txt`
- Zero-dependency: images are self-hosted and optimized, icons are inline SVG

## Running locally

Any static file server works. For example:

```bash
python3 -m http.server 8080 --bind 0.0.0.0
# then open http://localhost:8080
```

## Structure

```
├── *.html            # 8 pages
├── css/styles.css    # Design system (colors, components, responsive rules)
├── js/main.js        # Nav, sliders, counters, countdown, lightbox, chat, forms
├── assets/img/       # Optimized photography
└── favicon.svg       # School crest
```

*School details (address, phone, fees, staff) are sample content and can be
replaced with the school's real information.*
