# 🌸 RABI — THE BEAUTIFUL BIRTHDAY GIFT ♡
### A Luxury Soft Pastel Digital Experience Crafted Especially For Rabiya

---

## 🌟 Creative Direction
A soft pastel luxury digital gift box. Warm, romantic, personal, and heartwarming — designed like a high-end floral editorial scrapbook where every section celebrates Rabi.

- **Palette**: Soft Creams (`#FFF9F5`), Warm White (`#FFFCFA`), Blush (`#F6D6D8`), Soft Pink (`#EFC3CC`), Dusty Rose (`#DFA3AF`), Lavender (`#DDD4F3`), Soft Lilac (`#EEE9FA`), Peach (`#F8DDC8`), Sage (`#DDE6DA`), with Burgundy (`#7D3042`) and Rose Red (`#B94B61`) accents.
- **Typography**: Playfair Display, Cormorant Garamond, Plus Jakarta Sans, and Caveat Script.
- **Experience**: Fast, smooth scrolling navigation, sticky glass navbar, digital gift envelope modal, magazine editorial about section, 6 interactive reason cards, 10-memory lightbox gallery, video album, luxury bouquet floral notes, interactive birthday cake with candle blowout & confetti, 2 sweet mini-games, heartfelt stationery letter, glowing wish reveal, and final surprise.

---

## 🚀 How to Run Locally

### Option 1: Direct File Opening
Double-click `index.html` in your browser (Google Chrome, Microsoft Edge, Safari, Firefox).

### Option 2: Local HTTP Server (Recommended)
```bash
# Using Python
cd "rabi-birthday"
python -m http.server 8080
# Open http://localhost:8080
```
```bash
# Using Node / NPX
npx -y serve .
```

---

## 📂 EXACT ASSET FILE STRUCTURE

Drop your photos, videos, and music into the `assets/` folder using the exact filenames below. If any file is missing, the website displays an elegant floral placeholder so nothing looks broken!

```
assets/
│
├── images/
│   ├── hero/
│   │   └── rabi-hero.jpg              ← Main hero portrait
│   │
│   ├── about/
│   │   ├── about-01.jpg               ← Editorial portrait 1
│   │   └── about-02.jpg               ← Editorial portrait 2
│   │
│   ├── memories/
│   │   ├── memory-01.jpg              ← Memory gallery photo 1
│   │   ├── memory-02.jpg              ← Memory gallery photo 2
│   │   ├── memory-03.jpg              ← Memory gallery photo 3
│   │   ├── memory-04.jpg              ← Memory gallery photo 4
│   │   ├── memory-05.jpg              ← Memory gallery photo 5
│   │   ├── memory-06.jpg              ← Memory gallery photo 6
│   │   ├── memory-07.jpg              ← Memory gallery photo 7
│   │   ├── memory-08.jpg              ← Memory gallery photo 8
│   │   ├── memory-09.jpg              ← Memory gallery photo 9
│   │   └── memory-10.jpg              ← Memory gallery photo 10
│   │
│   ├── bouquet/
│   │   ├── bouquet-main.jpg           ← Luxury flower bouquet
│   │   └── bouquet-detail.jpg         ← Bouquet detail shot
│   │
│   └── special/
│       ├── final-photo.jpg            ← Final heartfelt photo
│       └── surprise-photo.jpg         ← Surprise celebration photo
│
├── videos/
│   ├── video-01.mp4                   ← Memory video clip 1
│   ├── video-02.mp4                   ← Memory video clip 2
│   ├── video-03.mp4                   ← Memory video clip 3
│   ├── video-04.mp4                   ← Memory video clip 4
│   ├── video-05.mp4                   ← Memory video clip 5
│   ├── cake-cutting.mp4               ← Birthday cake celebration video
│   └── final-surprise.mp4             ← Special final video message
│
└── audio/
    ├── background-music.mp3           ← Soft ambient background track
    ├── birthday-song.mp3              ← Birthday song for cake celebration
    └── surprise-audio.mp3             ← Optional surprise voice note / audio
```

---

## ✍️ How to Personalize Content

All editable text, reasons, captions, traits, letters, wishes, and game messages are centralized in:

📁 `data/content.js`

Open `data/content.js` in any text editor to customize:
- `person`: Name, Nickname, Birthday date, Favorite colors & flowers.
- `hero`: Title, Subtitle, Gift card welcome note.
- `about`: Story, Description, Traits list, Quote.
- `reasons`: 6 heartfelt reasons why she is special.
- `memories`: 10 image paths, titles, and romantic captions.
- `videos`: 7 video paths, titles, and captions.
- `bouquet`: Flower names and secret micro-messages.
- `birthday`: Celebration messages and cake wish note.
- `games`: Flower catching & Gift finder win messages.
- `letter`: Personal letter paragraphs, closing, and signature.
- `wish`: Heart-catching birthday wish.
- `surprise`: Final closing quote.

---

## 🌐 Deploy to GitHub Pages / Netlify / Vercel

### GitHub Pages (Instant Free Hosting)
1. Push this project to GitHub.
2. Go to **Settings** → **Pages**.
3. Under **Branch**, select `main` and `/ (root)`.
4. Click **Save**. The website will be live in 1 minute at `https://<your-username>.github.io/rabi-birthday/`.

### Netlify (Drag & Drop)
1. Go to [netlify.com](https://netlify.com).
2. Drag the entire `rabi-birthday` folder into Netlify Drop.
3. Your live link is ready instantly.

---

*Crafted with love, soft petals, and lavender blooms for Rabiya ♡*
