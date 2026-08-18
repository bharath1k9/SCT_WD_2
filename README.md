# SCT_WD_2 — Stopwatch Web Application

Task 2 of the Web Development Internship at **SkillCraft Technology**.

## 🔗 Live Demo
_Add your GitHub Pages link here after deploying, e.g._
`https://<your-username>.github.io/SCT_WD_2/`

## 📌 Task Objective
Build an interactive, user-friendly stopwatch that supports:
- **Start** / **Pause** / **Resume**
- **Reset** back to zero
- **Lap** tracking — record split times without stopping the main timer

## 🛠️ Built With
- HTML5
- CSS3 (circular SVG progress ring, responsive layout)
- Vanilla JavaScript (`Date.now()` based timing, `setInterval`)

## ✨ Features
- Accurate timing using timestamp differences (not just interval counting, so it stays accurate even if the tab is throttled)
- Circular progress ring that fills up every 60 seconds
- Lap list showing each split time, with the fastest lap highlighted green and slowest highlighted orange
- Keyboard shortcuts: `Space` = start/pause, `L` = lap, `R` = reset
- Buttons disable automatically when an action isn't valid (e.g. Lap is disabled until the stopwatch is running)

## 📂 File Structure
```
SCT_WD_2/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 How to Run Locally
1. Clone this repo
   ```
   git clone https://github.com/<your-username>/SCT_WD_2.git
   ```
2. Open `index.html` in your browser — no build tools required.

## 📚 What I Learned
- Using `Date.now()` timestamps instead of just counting `setInterval` ticks, to avoid time drift
- Managing multiple UI states (ready / running / paused) and syncing button behavior to each
- Working with SVG `stroke-dasharray` / `stroke-dashoffset` to build a circular progress indicator
- Handling keyboard events alongside click events for the same actions

---
**Internship:** Web Development Intern @ SkillCraft Technology
