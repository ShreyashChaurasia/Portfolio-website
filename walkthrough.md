# Portfolio Website — Walkthrough

## What Was Built
A dark-themed, immersive portfolio website inspired by **igloo.inc** and **antigravity.google**, tailored for a Software Engineer & AI/ML Engineer. Features a fully interactive particle background with mouse-reactive physics, custom cursor, and rich micro-interactions.

**Stack**: Vite + Vanilla JS + CSS (no frameworks)

## Sections & Screenshots

````carousel
![Hero — Full-page particle canvas, floating parallax shapes, custom cursor](C:/Users/shrey/.gemini/antigravity/brain/d887e49e-4c60-4dc4-afb1-1c3facc09c8b/particle_interaction_test_1772774725961.png)
<!-- slide -->
![Skills — Staggered tag cascade reveals, 3D tilt on skill cards](C:/Users/shrey/.gemini/antigravity/brain/d887e49e-4c60-4dc4-afb1-1c3facc09c8b/skills_section_1772774803289.png)
<!-- slide -->
![Projects — 3D perspective tilt on hover, particle network visible](C:/Users/shrey/.gemini/antigravity/brain/d887e49e-4c60-4dc4-afb1-1c3facc09c8b/project_hover_tilt_1772774822713.png)
<!-- slide -->
![Contact — Magnetic hover buttons, glowing social links](C:/Users/shrey/.gemini/antigravity/brain/d887e49e-4c60-4dc4-afb1-1c3facc09c8b/contact_section_1772774830977.png)
````

## Key Design Features
- **Deep dark base** (`#0a0a0f`) with cyan/purple glow accents
- **JetBrains Mono** + **Inter** typography
- **Full-page interactive particle canvas** — covers entire site, not just hero
- **Mouse-repel physics** — particles push away from cursor with elastic spring-back
- **Custom glowing cursor** — cyan dot + outer ring with smooth lag animation
- **Floating parallax elements** — geometric shapes drifting across all sections
- **3D tilt on cards** — project cards, skill cards, and terminal tilt toward mouse
- **Magnetic hover buttons** — buttons pull toward cursor on hover
- **Staggered skill tag reveals** — tags cascade in one-by-one with 60ms delays
- **Section mouse glow** — subtle radial glow follows cursor in each section
- **Scroll-triggered reveals** via `IntersectionObserver`
- **Typing animation** cycling through roles
- **Glassmorphism** cards with `backdrop-filter: blur`
- **Elastic animated counters** with overshoot easing
- **Responsive** down to mobile with hamburger menu
- **Touch device fallback** — custom cursor and parallax shapes hidden on touch screens

## Interactive Demo Recording
![Full interactive demo — particles, cursor, parallax, tilt effects](C:/Users/shrey/.gemini/antigravity/brain/d887e49e-4c60-4dc4-afb1-1c3facc09c8b/testing_interactive_portfolio_1772774687908.webp)

## Files Modified

| File | Purpose |
|------|---------|
| [index.html](file:///c:/Users/shrey/OneDrive/Documents/Coding/Portfolio-website/index.html) | HTML structure — added full-page canvas, cursor elements, parallax shapes |
| [style.css](file:///c:/Users/shrey/OneDrive/Documents/Coding/Portfolio-website/src/style.css) | Design system — added cursor, parallax, glow, tilt, and animation styles |
| [main.js](file:///c:/Users/shrey/OneDrive/Documents/Coding/Portfolio-website/src/main.js) | Interactive systems — particle field, cursor, parallax, magnetic, tilt |

## Running Locally
```
npm run dev
```
Dev server at **http://localhost:5173/**.
