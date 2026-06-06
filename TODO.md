# RedHat.AI — Project Status

**Projek:** C:\Users\AnasZakaria\OneDrive\Desktop\vexa.ai
**Dikemaskini:** 2026-06-06

---

## ✅ Selesai

- [x] Penukaran bahasa BM / EN di landing page
- [x] Butang "Mulakan Percuma" → signup.html → home.html
- [x] Pair trading XAUUSD & Nasdaq sahaja
- [x] Satu pelan langganan percuma sahaja
- [x] Organized folder structure (css/, pages/, screenshots/)
- [x] Extracted inline CSS into modular stylesheets
- [x] Fixed all internal links after reorganization
- [x] Created vercel.json for deployment

## 🔴 Perlu Diperbaiki

### [ ] 1. Text overlap — "No credit card. No monthly fees. Free forever."
- **Lokasi:** `index.html` — bahagian Pricing (section #pricing)
- **Masalah:** Teks `.price-note` bertindih / overlap dengan elemen lain di dalam `.price-card-free`
- **Fail:** `index.html`
- **Status:** Belum dibaiki

---

## 📁 Struktur Fail

```
vexa.ai/
├── index.html          # Landing page
├── vercel.json         # Vercel deployment config
├── .gitignore
├── TODO.md
├── css/
│   ├── variables.css   # Design tokens (colors, fonts)
│   ├── base.css        # Reset, base styles, scrollbar
│   ├── components.css  # Shared: header, nav, cards, badges
│   ├── landing.css     # Landing page specific
│   ├── signup.css      # Signup/login page
│   ├── mentor.css      # AI Mentor chat page
│   ├── profile.css     # Profile page
│   └── tools.css       # Tools: news, calculators, sessions
├── pages/
│   ├── signup.html
│   ├── home.html
│   ├── signals.html
│   ├── mentor.html
│   ├── tools.html
│   └── profile.html
└── screenshots/        # Reference screenshots (not used in code)
```
