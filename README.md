# RABI — The Bouquet That Never Fades 🌹💜
### A Cinematic Interactive Birthday Experience

---

## How to Run

**Option 1 — Open directly in browser**
Simply double-click `index.html` and open it in Chrome, Edge, or Firefox.

> **Note**: Some browsers block local audio. If music doesn't play, use Option 2.

**Option 2 — Local server (recommended for full features)**

If you have Python installed:
```bash
# Navigate to the rabi-birthday folder
cd "rabi-birthday"
python -m http.server 8080
# Then open: http://localhost:8080
```

If you have Node.js:
```bash
npx -y serve .
# Then open the URL it shows
```

---

## How to Test on Android

1. Run the local server (Option 2 above)
2. Find your computer's IP address (e.g. `192.168.1.5`)
3. On your Android phone, open Chrome and go to: `http://192.168.1.5:8080`
4. The site is fully mobile-optimized for 360px+ screens

---

## Where to Put Rabi's Photos

All photos go inside the `assets/images/` folder. The website **gracefully skips** any missing images — nothing will break.

---

## 📸 PHOTO CHECKLIST

### Portraits (floating in Dream Room)
```
assets/images/portraits/
```
| File | What to put here |
|------|-----------------|
| `rabi-01.jpg` | Her favorite/best portrait |
| `rabi-02.jpg` | Another beautiful portrait |
| `rabi-03.jpg` | A candid photo |
| `rabi-04.jpg` | A special photo |

### Memories (Memory Garden flowers)
```
assets/images/memories/
```
| File | What to put here |
|------|-----------------|
| `memory-01.jpg` | First memorable photo |
| `memory-02.jpg` | A funny moment |
| `memory-03.jpg` | Your favorite memory together |
| `memory-04.jpg` | A beautiful moment |
| `memory-05.jpg` | A casual photo |
| `memory-06.jpg` | A special day |
| `memory-07.jpg` | Her favorite selfie/photo |
| `memory-08.jpg` | Another meaningful memory |
| `memory-09.jpg` | Optional |
| `memory-10.jpg` | Optional |

### Special Photos
```
assets/images/special/
```
| File | What to put here |
|------|-----------------|
| `favorite-photo.jpg` | The photo you personally love most |
| `birthday-photo.jpg` | A birthday-related photo (optional) |
| `special-memory.jpg` | The most emotionally important photo |
| `final-photo.jpg` | ⭐ **The final photo — shown at the very end** |

---

## ✅ Complete Photo Checklist

```
[ ] assets/images/portraits/rabi-01.jpg
[ ] assets/images/portraits/rabi-02.jpg
[ ] assets/images/portraits/rabi-03.jpg
[ ] assets/images/portraits/rabi-04.jpg

[ ] assets/images/memories/memory-01.jpg
[ ] assets/images/memories/memory-02.jpg
[ ] assets/images/memories/memory-03.jpg
[ ] assets/images/memories/memory-04.jpg
[ ] assets/images/memories/memory-05.jpg
[ ] assets/images/memories/memory-06.jpg
[ ] assets/images/memories/memory-07.jpg
[ ] assets/images/memories/memory-08.jpg
[ ] assets/images/memories/memory-09.jpg  (optional)
[ ] assets/images/memories/memory-10.jpg  (optional)

[ ] assets/images/special/favorite-photo.jpg
[ ] assets/images/special/birthday-photo.jpg  (optional)
[ ] assets/images/special/special-memory.jpg
[ ] assets/images/special/final-photo.jpg  ← most important
```

---

## How to Add More Memories

Open `data/memories.js` and add a new entry to the array:

```js
{
  image:      'assets/images/memories/memory-11.jpg',
  caption:    'Your caption here.',
  flowerType: 'rose',   // rose | tulip | daisy | lily | orchid
  alt:        'Description for screen readers',
},
```

The garden **automatically layouts** however many memories you add. No HTML changes needed.

---

## How to Change the Final Letter

Open `data/config.js` and find the `letter` section:

```js
letter: {
  salutation: 'Dear Rabi,',
  body: [
    'Your first paragraph.',
    '',              // empty string = blank line
    'Your second paragraph.',
    ...
  ],
  closing: '— From someone who wanted to give you more than flowers.',
  ...
}
```

Each string in `body` is one line. An empty string `''` creates a blank line between paragraphs.

---

## How to Change the Secret Message

Open `data/config.js` and find:

```js
secret: {
  message: `Your secret message here.`,
}
```

Edit the text between the backtick characters. Line breaks are preserved.

---

## How to Add Music

1. Find a royalty-free ambient track you like. Suggested sources:
   - [Pixabay](https://pixabay.com/music/) — search "romantic ambient" or "cinematic"
   - [Free Music Archive](https://freemusicarchive.org/)
   - [Bensound](https://www.bensound.com/)

2. Download as MP3 format.

3. Rename it to `ambient.mp3`.

4. Place it at: `assets/audio/ambient.mp3`

5. Adjust volume in `data/config.js`:
```js
audio: {
  ambientSrc: 'assets/audio/ambient.mp3',
  volume: 0.30,  // 0 = silent, 1 = full volume
}
```

> **Note**: The experience works perfectly without music. Sound effects are synthesized in code.

---

## How to Change the Final Photo

Replace the file at:
```
assets/images/special/final-photo.jpg
```

Keep the exact filename. Any photo format works (jpg, jpeg, png, webp).

---

## How to Disable Easter Eggs

Open `data/config.js` and set:

```js
easterEggs: {
  enabled: false,
  ...
}
```

---

## How to Change Rose Messages

Open `data/config.js` and find the `bouquet.roses` array:

```js
roses: [
  { message: '«Your first rose message.»', isFinal: false },
  { message: '«Your second rose message.»', isFinal: false },
  ...
  { message: '«Your final rose message.»', isFinal: true },  // ← last one triggers the galaxy
],
```

> **Important**: Keep exactly one rose with `isFinal: true`. It triggers the petal explosion and the galaxy transition.

---

## How to Deploy

### Free hosting options:

**Netlify (simplest)**
1. Go to [netlify.com](https://www.netlify.com/)
2. Drag the entire `rabi-birthday` folder into the deploy area
3. Get a shareable URL instantly

**GitHub Pages**
1. Create a new GitHub repository
2. Upload all project files
3. Go to Settings → Pages → Deploy from branch
4. Share the generated URL

**Vercel**
```bash
npm install -g vercel
cd rabi-birthday
vercel
```

---

## Project Structure

```
rabi-birthday/
│
├── index.html              ← Main entry point
├── README.md               ← This guide
│
├── data/
│   ├── config.js           ← ✦ ALL personalization lives here
│   └── memories.js         ← Memory garden photos + captions
│
├── css/
│   ├── style.css           ← Complete design system
│   ├── animations.css      ← All cinematic keyframes
│   └── responsive.css      ← Mobile-first overrides
│
├── js/
│   ├── main.js             ← Scene manager + all scene logic
│   ├── particles.js        ← Adaptive particle system
│   ├── audio.js            ← Sound management
│   ├── memories.js         ← Memory garden engine
│   └── easter-eggs.js      ← 3 hidden surprises
│
└── assets/
    ├── images/
    │   ├── memories/       ← memory-01.jpg ... memory-10.jpg
    │   ├── portraits/      ← rabi-01.jpg ... rabi-04.jpg
    │   ├── flowers/        ← (optional decorative assets)
    │   └── special/        ← final-photo.jpg etc.
    └── audio/
        └── ambient.mp3     ← (you supply this — optional)
```

---

## The 10-Chapter Journey

| # | Chapter | Description |
|---|---------|-------------|
| 00 | Loading | "Preparing something for Rabi..." |
| 01 | The Opening | Darkness → date → rose grows |
| 02 | Developer Reveal | Code types itself → executes → dissolves |
| 03 | The Digital Bouquet | 7 interactive roses, each with a message |
| 04 | Galaxy — Two Souls | Stars merge, universe forms |
| 05 | Memory Garden | Flowers open into photos |
| 06 | Purple Dream Room | Parallax room, floating portraits, moon |
| 07 | The Day | Cinematic 06 SEPTEMBER sequence |
| 08 | Birthday Table | Interactive candles, fireworks |
| 09 | Final Letter | Typewriter letter, rose, final photo |
| 10 | Epilogue | The eternal bouquet — "The flowers are still here." |

---

## Easter Eggs (Don't Spoil)

There are 3 hidden surprises. She has to find them.

- **#1** — In the Memory Garden. Tap the mysterious glowing flower 7 times.
- **#2** — In the Dream Room. Look at the moon.
- **#3** — In the Epilogue. Be persistent.

---

*Made with code, roses, and a lot of purple. 🌹💜*
