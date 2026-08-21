/* ═══════════════════════════════════════════════════════════════════════════
   RABI — THE BEAUTIFUL BIRTHDAY GIFT
   data/content.js — Central Editable Content System
   
   Everything the owner wants to edit is configured here.
   Changes here will immediately update across all sections of the website.
   ═══════════════════════════════════════════════════════════════════════════ */

const CONTENT = {
  person: {
    name: "Rabiya",
    nickname: "Rabi",
    birthday: {
      day: 6,
      month: 9,
      monthName: "September"
    },
    favoriteColor: "Soft Lavender & Purple",
    favoriteFlower: "Blush Roses & Red Roses"
  },

  hero: {
    title: "Happy Birthday, Rabi ♡",
    subtitle: "Today is all about celebrating someone truly special.",
    primaryBtn: "Open Your Gift 🎁",
    secondaryBtn: "Explore Our Memories 🌸",
    giftMessage: `Dear Rabi,

I wanted to give you something different this year.
So instead of just sending you a wish…
I made you a little place on the internet that belongs only to you. ♡

Every flower, every memory, and every little detail here was crafted to remind you of how appreciated and special you are.

Happy Birthday, Rabiya. ✨`
  },

  about: {
    tag: "A Little About Her",
    title: "The Girl Who Brings Light Everywhere",
    subtitle: "Warmth, grace, and an effortless way of making people smile.",
    description: "Some people have a quiet magic about them. Rabi is thoughtful, deeply caring, and brings a gentle warmth that makes any ordinary day feel special. She loves sweet conversations, beautiful flower bouquets, soft colors, and making everyone around her feel valued.",
    quote: "“You don't just exist in the world; you make it a softer, brighter, and kinder place.”",
    traits: [
      { label: "Full Name", value: "Rabiya" },
      { label: "Lovingly Called", value: "Rabi ♡" },
      { label: "Special Day", value: "06 September" },
      { label: "Favorite Colors", value: "Lavender, Lilac & Purple 💜" },
      { label: "Favorite Flowers", value: "Blush Roses & Red Roses 🌹" },
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

  memories: [
    {
      id: 1,
      image: "assets/images/memories/memory-01.jpg",
      title: "Sweet Beginning",
      caption: "The start of so many beautiful conversations and shared laughs.",
      alt: "Memory photo 1 of Rabi"
    },
    {
      id: 2,
      image: "assets/images/memories/memory-02.jpg",
      title: "Pure Smiles",
      caption: "A day filled with genuine happiness and that radiant smile.",
      alt: "Memory photo 2 of Rabi"
    },
    {
      id: 3,
      image: "assets/images/memories/memory-03.jpg",
      title: "Candid Grace",
      caption: "One of my absolute favorite candid photos of you.",
      alt: "Memory photo 3 of Rabi"
    },
    {
      id: 4,
      image: "assets/images/memories/memory-04.jpg",
      title: "Peaceful Days",
      caption: "The kind of peaceful, soft afternoon you wish could last forever.",
      alt: "Memory photo 4 of Rabi"
    },
    {
      id: 5,
      image: "assets/images/memories/memory-05.jpg",
      title: "Effortless Radiance",
      caption: "Just you being your effortless, graceful, and stunning self.",
      alt: "Memory photo 5 of Rabi"
    },
    {
      id: 6,
      image: "assets/images/memories/memory-06.jpg",
      title: "Unforgettable Laughs",
      caption: "A moment that will always bring an instant smile whenever I look at it.",
      alt: "Memory photo 6 of Rabi"
    },
    {
      id: 7,
      image: "assets/images/memories/memory-07.jpg",
      title: "Soft Golden Hour",
      caption: "That gentle glow and quiet charm that is so uniquely yours.",
      alt: "Memory photo 7 of Rabi"
    },
    {
      id: 8,
      image: "assets/images/memories/memory-08.jpg",
      title: "Special Days",
      caption: "A sweet reminder of how lucky I am to celebrate you today.",
      alt: "Memory photo 8 of Rabi"
    },
    {
      id: 9,
      image: "assets/images/memories/memory-09.jpg",
      title: "Cherished Memories",
      caption: "One of the softest, warmest memories we've ever shared.",
      alt: "Memory photo 9 of Rabi"
    },
    {
      id: 10,
      image: "assets/images/memories/memory-10.jpg",
      title: "Always In My Heart",
      caption: "A moment to keep close to the heart forever.",
      alt: "Memory photo 10 of Rabi"
    }
  ],

  videos: [
    {
      id: 1,
      video: "assets/videos/video-01.mp4",
      poster: "assets/images/memories/memory-01.jpg",
      title: "A Sweet Memory",
      caption: "Little clips that hold big smiles."
    },
    {
      id: 2,
      video: "assets/videos/video-02.mp4",
      poster: "assets/images/memories/memory-02.jpg",
      title: "Pure Joy",
      caption: "Moments of unfiltered happiness and soft giggles."
    },
    {
      id: 3,
      video: "assets/videos/video-03.mp4",
      poster: "assets/images/memories/memory-03.jpg",
      title: "Candid Moments",
      caption: "Just living in the moment and enjoying the day."
    },
    {
      id: 4,
      video: "assets/videos/video-04.mp4",
      poster: "assets/images/memories/memory-04.jpg",
      title: "Laughter in Motion",
      caption: "The kind of laughter that brightens an entire room."
    },
    {
      id: 5,
      video: "assets/videos/video-05.mp4",
      poster: "assets/images/memories/memory-05.jpg",
      title: "Quiet Magic",
      caption: "Soft moments, sweet memories, and happy days."
    },
    {
      id: 6,
      video: "assets/videos/cake-cutting.mp4",
      poster: "assets/images/special/surprise-photo.jpg",
      title: "Cake Cutting Memory 🎂",
      caption: "The sweetest celebration of the year."
    },
    {
      id: 7,
      video: "assets/videos/final-surprise.mp4",
      poster: "assets/images/special/final-photo.jpg",
      title: "Special Birthday Surprise ✨",
      caption: "A heartfelt message made especially for Rabi."
    }
  ],

  bouquet: {
    tag: "Floral Arrangement",
    title: "A Bouquet For Someone Special",
    subtitle: "Some flowers are beautiful for a day. Some memories stay forever.",
    description: "Every bloom in this arrangement was chosen with thought. Tap any flower below to reveal its secret message for you.",
    flowerMessages: [
      {
        id: 1,
        flower: "Blush Rose",
        color: "#F6D6D8",
        message: "To the gentlest soul I know — may your days always bloom with calm, beauty, and kindness. 🌸"
      },
      {
        id: 2,
        flower: "Red Rose",
        color: "#B94B61",
        message: "A symbol of deep care, admiration, and how much you truly mean to the people around you. 🌹"
      },
      {
        id: 3,
        flower: "Lavender Blossom",
        color: "#DDD4F3",
        message: "For your soothing presence and the comforting peace you bring into every conversation. 💜"
      },
      {
        id: 4,
        flower: "White Lily",
        color: "#FFFCFA",
        message: "Pure, elegant, and timeless — just like the genuine grace in your heart. 🤍"
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

  games: {
    flowerGame: {
      tag: "Mini Game 01",
      title: "Catch the Falling Flowers 🌸",
      subtitle: "Collect 10 soft blooms to weave a custom birthday bouquet for Rabi!",
      target: 10,
      completionMessage: "You just collected a bouquet made especially for Rabi! 💐✨ May your year be as colorful and soft as these flowers."
    },
    giftGame: {
      tag: "Mini Game 02",
      title: "Find Rabi's Surprise Gift 🎁",
      subtitle: "One of these pastel gift boxes holds a hidden birthday note. Pick one!",
      giftMessage: "Of course you found it! Good things have a way of finding you. ♡ You deserve all the sweetest surprises in life."
    }
  },

  letter: {
    tag: "From The Heart",
    title: "A Letter For You",
    date: "06 September",
    salutation: "Dear Rabi,",
    paragraphs: [
      "Happy Birthday. I wanted to create something genuinely personal for you this year — something that wouldn't just disappear after today, but remain as a gentle reminder of how appreciated you are.",
      "You have this rare and effortless ability to make everyone around you feel valued. Your kindness isn't loud or demanding; it is gentle, constant, and incredibly comforting.",
      "Thank you for being someone so wonderful to talk to, for the shared laughs, the sweet check-ins, and for simply being the radiant, thoughtful person that you are.",
      "I hope this year showers you with endless happiness, good health, exciting new adventures, and peace in every single step you take.",
      "Never forget how special you are, and how much happiness you bring into the world."
    ],
    closing: "With all my warmest wishes and deepest care,",
    signature: "Always, for you ♡"
  },

  wish: {
    tag: "Heart-Catching Moment",
    title: "Make A Wish ♡",
    prompt: "Close your eyes, think of something your heart quietly desires, and tap the glowing star.",
    message: "“I hope this year brings you more reasons to smile, more beautiful memories, and everything your heart quietly wishes for.” ✨"
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

// Export to window for vanilla JS access
if (typeof window !== "undefined") {
  window.CONTENT = CONTENT;
}
