# ✦ AFESTRA

> **Open-source app platform. Yours to modify, yours to own.**

AFESTRA is an open-source brand and app scaffold designed so anyone can take the base and build *anything* out of it — a calculator, a notes app, a finance tracker, a game. The code is clean, the design is intentional, and everything is modular.

---

## 🚀 Getting Started

```bash
# Clone the repo (replace with your real GitHub URL once you've created one)
git clone https://github.com/Afestra/afestra.git
cd afestra

# Open index.html in your browser — no build step needed!
start index.html
```

---

## 🛠 How to Build Your Own App

AFESTRA ships with a **Calculator** as the default app. To replace it with your own:

1. Open `src/app/app.js` — this is where your app logic lives.
2. Open `src/app/app.css` — style your app here.
3. Open `src/app/app.html` — define your app's UI markup.
4. Update `afestra.config.js` with your app name, description, and accent color.

The shell (`src/shell/`) handles the branded header, theme, and layout. You never need to touch it.

---

## 📁 Project Structure

```
AFESTRA/
├── index.html              ← Entry point
├── afestra.config.js       ← Brand + app config (edit this!)
├── src/
│   ├── shell/              ← AFESTRA shell (header, theme, layout)
│   │   ├── shell.css
│   │   └── shell.js
│   └── app/                ← YOUR APP LIVES HERE
│       ├── app.html        ← App UI markup
│       ├── app.css         ← App styles
│       └── app.js          ← App logic
└── assets/
    └── logo.svg            ← AFESTRA logo
```

---

## 🎨 Customizing the Brand

In `afestra.config.js`:

```js
export default {
  name: "MyApp",           // Your app name
  tagline: "Built on AFESTRA",
  accentColor: "#6C63FF",  // Any hex color
  darkMode: true,          // true | false
};
```

---

## 📜 License

**MIT** — Use it, fork it, sell it, ship it. Credit is appreciated but not required.

---

## ✦ Built with AFESTRA

| App | Creator | Link |
|-----|---------|------|
| Calculator | AFESTRA Team | [github.com/Afestra/afestra](https://github.com/Afestra/afestra) |
| *Your app here* | You | — |

Made with ♥ by the AFESTRA community.
