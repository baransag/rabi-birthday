/* ═══════════════════════════════════════════════════════════════════════════
   RABI — THE BEAUTIFUL BIRTHDAY GIFT
   data/content.js — Central Editable Content System (5-Photo Dedicated Edition)
   ═══════════════════════════════════════════════════════════════════════════ */

const CONTENT = {
  person: {
    name: "Rabiya",
    nickname: "Rabi",
    sender: "Husnain",
    birthday: {
      day: 6,
      month: 9,
      monthName: "September"
    },
    favoriteColor: "Soft Lavender & Dusty Rose",
    favoriteFlower: "Velvety Red Roses & Blush Roses 🌹"
  },

  /* ─── EXACT 5 PHOTOS CONFIGURATION ─────────────────────────────────────── */
  /* Drop your 5 photos in the `assets/images/` folder as photo1.jpg to photo5.jpg */
  photos: {
    photo1: {
      src: "assets/images/photo1.jpg",
      fallbackPng: "assets/images/photo1.png",
      label: "Hero Welcome Portrait",
      alt: "Rabiya - Welcome Portrait"
    },
    photo2: {
      src: "assets/images/photo2.jpg",
      fallbackPng: "assets/images/photo2.png",
      label: "About Rabiya",
      alt: "Rabiya - Radiant Smile"
    },
    photo3: {
      src: "assets/images/photo3.jpg",
      fallbackPng: "assets/images/photo3.png",
      label: "Cherished Memory #1",
      title: "Sweetest Conversations",
      date: "Cherished Moments",
      caption: "The start of so many beautiful conversations, shared smiles, and quiet laughs.",
      backNote: "“You make ordinary moments feel like poetry, Rabiya.” ♡",
      alt: "Memory Photo 1 of Rabi"
    },
    photo4: {
      src: "assets/images/photo4.jpg",
      fallbackPng: "assets/images/photo4.png",
      label: "Cherished Memory #2",
      title: "Golden Hour Grace",
      date: "Unforgettable Days",
      caption: "That gentle glow and quiet charm that is so uniquely yours.",
      backNote: "“Never stop shining, because your happiness is genuinely contagious.” ✨",
      alt: "Memory Photo 2 of Rabi"
    },
    photo5: {
      src: "assets/images/photo5.jpg",
      fallbackPng: "assets/images/photo5.png",
      label: "Grand Finale Surprise",
      alt: "Rabiya - Forever Cherished"
    }
  },

  journey: {
    title: "Birthday Journey",
    steps: [
      { id: "hero", label: "Welcome", num: "01" },
      { id: "about", label: "About Rabi", num: "02" },
      { id: "particle-heart", label: "Particle Heart", num: "03" },
      { id: "memories", label: "Memories", num: "04" },
      { id: "aim-heart", label: "Aim For Heart", num: "05" },
      { id: "popup-card", label: "3D Birthday Card", num: "06" },
      { id: "souls", label: "Two Souls", num: "07" },
      { id: "star-map", label: "Star Map", num: "08" },
      { id: "moments", label: "The Bouquet", num: "09" },
      { id: "vip-coupons", label: "VIP Coupons", num: "10" },
      { id: "open-when", label: "Mood Notes", num: "11" },
      { id: "birthday", label: "Birthday Cake", num: "12" },
      { id: "letter", label: "Love Letters", num: "13" },
      { id: "surprise", label: "Surprise", num: "14" }
    ]
  },

  hero: {
    title: "Happy Birthday, Rabi ♡",
    subtitle: "Today is all about celebrating someone truly special. A digital universe filled with glowing embers, memories, stars, and endless appreciation.",
    primaryBtn: "Slide to Open Gift 💌",
    secondaryBtn: "Explore Our Memories 🌸",
    giftMessage: `Dear Rabi,

I wanted to give you something different this year.
So instead of just sending you a wish…
I made you a little place on the internet that belongs only to you. ♡

Every flower, every memory, every particle of light, and every little detail here was crafted to remind you of how deeply appreciated and special you are.

Happy Birthday, Rabiya. ✨
— Husnain 💜`
  },

  about: {
    tag: "A Little About Her",
    title: "The Girl Who Brings Light Everywhere",
    subtitle: "Warmth, grace, and an effortless way of making people smile.",
    description: "Some people have a quiet magic about them. Rabi is thoughtful, deeply caring, and brings a gentle warmth that makes any ordinary day feel special. She loves sweet conversations, beautiful flowers, soft colors, and making everyone around her feel valued.",
    quote: "“You don't just exist in the world; you make it a softer, brighter, and kinder place.”",
    traits: [
      { label: "Full Name", value: "Rabiya" },
      { label: "Lovingly Called", value: "Rabi ♡" },
      { label: "Special Day", value: "06 September" },
      { label: "Favorite Colors", value: "Lavender, Peri & Peach 💜" },
      { label: "Favorite Flowers", value: "Velvet Red Roses & Blush Roses 🌹" },
      { label: "Superpower", value: "Turning ordinary days into memories" }
    ]
  },

  reasons: [
    {
      id: 1,
      tag: "Reason 01",
      title: "Your Radiant Smile",
      front: "Tap to reveal ♡",
      text: "Your smile has this effortless way of lighting up everything around you. It's genuinely infectious."
    },
    {
      id: 2,
      tag: "Reason 02",
      title: "The Little Moments",
      front: "Tap to reveal ♡",
      text: "You make ordinary conversations feel special. Even simple chats with you turn into cherished memories."
    },
    {
      id: 3,
      tag: "Reason 03",
      title: "Your Caring Heart",
      front: "Tap to reveal ♡",
      text: "You have a way of truly listening and making people feel heard, appreciated, and safe."
    },
    {
      id: 4,
      tag: "Reason 04",
      title: "Completely Irreplaceable",
      front: "Tap to reveal ♡",
      text: "There is literally no one else like you in this entire world. You are truly one of one."
    },
    {
      id: 5,
      tag: "Reason 05",
      title: "Your Pure Energy",
      front: "Tap to reveal ♡",
      text: "Your presence brings a quiet calm and positivity that makes everything feel a little more peaceful."
    },
    {
      id: 6,
      tag: "Reason 06",
      title: "Simply Because You're Rabi",
      front: "Tap to reveal ♡",
      text: "And honestly… because you are you. Unapologetically kind, authentic, and wonderfully unique."
    }
  ],

  /* ─── NEW FEATURE 1: ✨ GLOWING PARTICLE HEART ─────────────────────────── */
  particleHeart: {
    tag: "Interactive Light Poetry",
    title: "Particle Heart Symphony ✨💖",
    subtitle: "Move your cursor or touch to ripple thousands of glowing embers forming a beating heart.",
    quote: "“Even in code and algorithms, every spark finds its way to your heart.”",
    author: "— Handcrafted with code by Husnain 💜"
  },

  /* ─── NEW FEATURE 2: 🏹 BOW & ARROW: AIM FOR THE HEART ─────────────────── */
  aimHeart: {
    tag: "Interactive Cupid Quest",
    title: "Aim For The Heart ♡",
    subtitle: "Pull back the bow and hit the beating heart on the envelope!",
    povQuote: "“I never knew home could be a person until you.”",
    subPovQuote: "One year. One you. That's all I ever needed.",
    instruction: "🎯 Drag the arrow backward, aim for the heart, and release!",
    unlockedTitle: "Bullseye! Secret Love Note Unlocked 💌✨",
    unlockedMessage: `Dear Rabiya,
You hit the exact center of my heart! 
Thank you for being my peace, my happiest notification, and the sweetest person in my universe. 
Happy Birthday, my favorite person. ♡
— Husnain 💜`
  },

  /* ─── NEW FEATURE 3: 🎂 3D POP-UP BIRTHDAY CELEBRATION CARD ────────────── */
  popUpCard: {
    tag: "Foldable Keepsake",
    title: "She Smiled. I Just Wrote Some Code. 🎂",
    subtitle: "Tap the card to fold it open into 3D celebration with party balloons & confetti!",
    bannerText: "Happy Birthday Rabiya ♡",
    cardInsideHeading: "To The Queen Of 06 September 👑",
    cardInsideText: "May your day be filled with warm laughter, soft flowers, sweet cake, and every wish of yours turning into reality. You deserve all the magic in this world! ✨",
    cardSignature: "Always with you, Husnain 💜"
  },

  souls: {
    tag: "Interactive Cosmic Experience",
    title: "Two Souls. One Universe. ✨",
    subtitle: "Drag Husnain 💜 and Rabi 🌹 together to trigger the Galaxy Supernova!",
    label1: "HUSNAIN 💜",
    label2: "RABI 🌹",
    mergedTitle: "When Husnain & Rabi Connect ♡",
    mergedText: "“Out of 8 billion people in this universe, finding you was the most beautiful thing that ever happened.” ✨",
    gameInstruction: "Catch the falling cosmic flowers & gifts to unlock Husnain's secret wishes and cute surprises for Rabi!",
    targetSurprises: 4,
    surprises: [
      {
        type: "wish",
        icon: "🌹",
        title: "A Crimson Rose Wish ✨",
        text: "May every quiet dream in your heart bloom into something breathtaking this year. Happy Birthday Rabiya! 💖"
      },
      {
        type: "funny",
        icon: "🙈",
        title: "Cute Fact 😜",
        text: "Warning: Unprecedented levels of cuteness and sweetness detected in Rabi! Certified 100% irreplaceable. 💜"
      },
      {
        type: "wish",
        icon: "⭐",
        title: "Husnain's Promise 💌",
        text: "I promise to always celebrate you, root for your happiness, and remind you how extraordinary you are. ♡"
      },
      {
        type: "funny",
        icon: "🍰",
        title: "Cake Protocol 🎂",
        text: "Rule #1: Rabi gets the biggest slice of birthday cake today without sharing! 😂✨"
      }
    ],
    completionTitle: "Galaxy Surprises Collected! 💐✨",
    completionMessage: "You caught all of Husnain's cosmic surprises! May your birthday and your entire year be as magical as this universe. 💜🌹"
  },

  starMap: {
    tag: "Celestial Keepsake",
    title: "Rabi’s Birthday Star Map (06 Sept Sky) 🌌⭐",
    subtitle: "The exact night sky on 06 September. Tap Rabi’s Star to reveal its golden cosmic certificate!",
    certificateTitle: "OFFICIAL COSMIC CERTIFICATE ⭐✨",
    certificateLine1: "This certifies that out of all 100 billion stars in the galaxy...",
    certificateLine2: "“Rabi’s Birthday Star” shines brightest for Rabiya on 06 September.",
    certificateSender: "Registered with endless love by Husnain 💜"
  },

  bouquet: {
    tag: "Floral Arrangement",
    title: "A Bouquet For Someone Special",
    subtitle: "Some flowers are beautiful for a day. Some memories stay forever.",
    description: "Every bloom in this arrangement was chosen with thought. Tap any flower below to reveal its secret message for you.",
    flowerMessages: [
      {
        id: 1,
        flower: "Velvet Red Rose 🌹",
        color: "#B94B61",
        message: "A symbol of deep care, admiration, and how much you truly mean to Husnain. 🌹"
      },
      {
        id: 2,
        flower: "Blush Pink Rose 🌸",
        color: "#F6D6D8",
        message: "To the gentlest soul I know — may your days always bloom with calm, beauty, and kindness. 🌸"
      },
      {
        id: 3,
        flower: "Lavender Blossom 💜",
        color: "#DDD4F3",
        message: "For your soothing presence and the comforting peace you bring into every conversation. 💜"
      },
      {
        id: 4,
        flower: "White Lily 🤍",
        color: "#FFFCFA",
        message: "Pure, elegant, and timeless — just like the genuine grace in your heart. 🤍"
      }
    ]
  },

  eternalRose: {
    tag: "Enchanted Keepsake",
    title: "Husnain’s Eternal Red Rose 🥀✨",
    subtitle: "Protected inside crystal glass — tap the dome to release its magic stardust.",
    message: "“Real flowers fade in seven days, but this red rose will bloom forever on this website made especially for you.” ♡",
    senderNote: "— Handcrafted with love by Husnain 💜"
  },

  vipCoupons: {
    tag: "Exclusive Golden Vouchers",
    title: "Husnain’s VIP Birthday Coupons 🎟️✨",
    subtitle: "Tap any coupon to redeem it — stamped exclusively for Rabiya!",
    coupons: [
      {
        id: 1,
        icon: "☕",
        title: "Late-Night Coffee / Treat",
        desc: "One late-night coffee or favorite dessert of your choice — on Husnain!",
        badge: "Valid Anytime 🎟️"
      },
      {
        id: 2,
        icon: "👑",
        title: "Win Any Argument Instantly",
        desc: "Play this coupon whenever we disagree to win instantly. No questions asked!",
        badge: "24/7 Immunity 🛡️"
      },
      {
        id: 3,
        icon: "🎧",
        title: "Husnain Listens Interrupt-Free",
        desc: "Husnain will sit, listen, and pay 100% attention to anything you want to vent about.",
        badge: "VIP Attention 💜"
      },
      {
        id: 4,
        icon: "🤗",
        title: "Unlimited Hugs & Sweet Words",
        desc: "Redeemable for infinite warm hugs, wholesome care, and sweet compliments.",
        badge: "No Expiry Date 🌸"
      },
      {
        id: 5,
        icon: "🎬",
        title: "Pick Favorite Movie / Outing",
        desc: "You get full control to pick whatever movie, plan, or outing we do next!",
        badge: "Rabi's Choice ✨"
      }
    ]
  },

  openWhen: {
    tag: "Personal Comfort Notes",
    title: "“Open When...” Mood Envelopes 💌",
    subtitle: "Whatever you're feeling today, tap an envelope for a sweet note from Husnain.",
    notes: [
      {
        id: 1,
        mood: "Open when you need a big smile 😊",
        icon: "💖",
        title: "A Gentle Reminder",
        text: "Whenever you feel down, remember that your smile brightens Husnain's entire world. You are so genuinely loved, appreciated, and cherished. Keep smiling, Rabiya! ✨"
      },
      {
        id: 2,
        mood: "Open on a quiet or rainy day 🌧️",
        icon: "☕",
        title: "Cozy Warmth",
        text: "Pour yourself a warm cup of coffee or tea, wrap up in a blanket, and take a deep breath. You are doing amazing, and everything will always turn out beautifully."
      },
      {
        id: 3,
        mood: "Open late at night when you miss Husnain 🌙",
        icon: "💜",
        title: "Under The Same Stars",
        text: "No matter how far apart or busy days get, we are looking at the exact same moon and stars. Husnain is always just a message away. ♡"
      },
      {
        id: 4,
        mood: "Open when you need confidence ✨",
        icon: "👑",
        title: "You Are Extraordinary",
        text: "Never doubt how smart, capable, and graceful you are. You have a heart of gold and a quiet strength that inspires everyone around you."
      }
    ]
  },

  birthday: {
    tag: "Celebrate Rabi",
    heading: "Happy Birthday, Rabi 🎂",
    subheading: "06 September • A day worth celebrating every single year",
    cakeMessage: "Tap the candles to make a wish and blow them out! ✨",
    blownMessage: "May every single wish you made today come true in the sweetest way. Happy Birthday, Rabiya! 💖🎉"
  },

  letter: {
    tag: "From The Heart",
    title: "Interactive Love Letters & Notes 💌",
    subtitle: "Tap the arrows to browse through the envelopes and slide them open to read!",
    envelopes: [
      {
        id: 1,
        title: "To The Birthday Girl",
        date: "06 September",
        salutation: "Dear Rabi,",
        paragraphs: [
          "Happy Birthday. I wanted to create something genuinely personal for you this year — something that wouldn't just disappear after today, but remain as a gentle reminder of how appreciated you are.",
          "You have this rare and effortless ability to make everyone around you feel valued. Your kindness isn't loud or demanding; it is gentle, constant, and incredibly comforting.",
          "Thank you for being someone so wonderful to talk to, for the shared laughs, the sweet check-ins, and for simply being the radiant, thoughtful person that you are."
        ],
        closing: "With all my warmest wishes and deepest care,",
        signature: "Always, Husnain ♡"
      },
      {
        id: 2,
        title: "A Note On Your Kindness",
        date: "A Gentle Reminder",
        salutation: "Dearest Rabiya,",
        paragraphs: [
          "I hope you always remember how much positive energy you bring into the lives of people around you.",
          "Even on days when you might feel tired or uncertain, you still manage to be gentle, patient, and full of grace.",
          "May this new year of your life bring you the exact same peace and kindness that you give so freely to others."
        ],
        closing: "Wishing you infinite happiness,",
        signature: "Husnain ♡"
      },
      {
        id: 3,
        title: "A Wish For Your Future",
        date: "Today & Always",
        salutation: "Sweet Rabi,",
        paragraphs: [
          "May every door you hope to open swing wide for you this year.",
          "May your paths be surrounded by soft flowers, warm friendships, wonderful adventures, and dreams coming true one by one.",
          "Never stop smiling, because your smile is genuinely one of the most beautiful things in this world."
        ],
        closing: "Forever rooting for you,",
        signature: "Happy Birthday, Rabi! 🌸 — Husnain"
      }
    ]
  },

  surprise: {
    tag: "Forever With You",
    title: "For Rabi ♡",
    subtitle: "I hope this little place made you smile today.",
    finalLine: "Some gifts get old. This one will always be here.",
    replayBtn: "Experience It Again 🌸"
  },

  audio: {
    backgroundMusic: "assets/audio/background-music.mp3",
    birthdaySong: "assets/audio/birthday-song.mp3",
    surpriseAudio: "assets/audio/surprise-audio.mp3"
  }
};

if (typeof window !== "undefined") {
  window.CONTENT = CONTENT;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONTENT;
}
