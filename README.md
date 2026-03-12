# Portfolio README Documentation

> [!NOTE]
> This repository contains the source code for the personal portfolio website of Shreyash Chaurasia, a Software Engineer and AI/ML enthusiast.

## Features
Designed with a focus on high-end aesthetics, interactivity, and performance.

- **Dynamic Code Particle Field**: A custom responsive HTML5 Canvas background rendering math and code syntax that reacts elastically to mouse movement and scroll depth.
- **Hacker-Glitch Typography**: Interacting with the hero text triggers localized, scrambled character rapid-fire animations.
- **Organic Code-Trail Cursor**: The default cursor is hidden and replaced by a custom syntax-trail `(e.g., {}, =>, <//>)` that organically trails the mouse interactions.
- **Water-Flow Theme Ripple**: Switching between Dark and Light mode triggers a full-screen, radial clipping-path animation transition.
- **CSS Aesthetic Project Cards**: Project thumbnails are built using pure CSS geometric and glowing patterns, avoiding generic AI-generated imagery for a cleaner developer aesthetic.
- **Magnetic Interactivity**: Buttons and social links utilize subtle, strength-based CSS transforms to "pull" toward the cursor on approach.
- **Typing Cursor**: Features an authentic terminal typing effect where the cursor `|` sticks to the end of the text and pauses blinking dynamically while characters render.

## Built With
This project relies on modern vanilla web technologies, optimized through a build tool for speed.
- **HTML5 & Vanilla CSS3**: Semantic structure and pure, utility-free custom styling.
- **Vanilla JavaScript (ES6+)**: Custom classes for all animations (Parallax, Typing, Particles, Glitch) without bulky third-party animation libraries.
- **Vite**: Next-generation frontend tooling used as the local dev server and optimized production bundler.
- **GitHub Actions**: Fully automated deployment pipeline to GitHub Pages.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/ShreyashChaurasia/Portfolio-website.git
   ```
2. Navigate into the project directory:
   ```bash
   cd Portfolio-website
   ```
3. Install the dependencies (Vite):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The application will typically map to `http://localhost:5173`.*

## Deployment
This portfolio is deployed automatically using GitHub Pages.

The deployment configuration is handled via GitHub Actions in the `.github/workflows/deploy.yml` file. Whenever changes are pushed to the `main` branch, the Action checks out the repository, installs Node, builds the Vite production bundle (`npm run build`), and pushes the static assets to the `gh-pages` environment.

---
*Designed & Built by [Shreyash Chaurasia](https://github.com/ShreyashChaurasia)*
