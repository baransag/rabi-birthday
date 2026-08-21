/* ═══════════════════════════════════════════════════════════════════════════
   RABI — THE BEAUTIFUL BIRTHDAY GIFT
   data/content.js — Central Editable Content System
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

  journey: {
    title: "Birthday Journey",
    steps: [
      { id: "hero", label: "Welcome", num: "01" },
      { id: "about", label: "About Rabi", num: "02" },
      { id: "memories", label: "Memories", num: "03" },
      { id: "souls", label: "Two Souls", num: "04" },
      { id: "moments", label: "Moments", num: "05" },
      { id: "birthday", label: "Birthday", num: "06" },
      { id: "letter", label: "Letter", num: "07" },
      { id: "surprise", label: "Surprise", num: "08" }
    ]
  },

  hero: {
    title: "Happy Birthday, Rabi ♡",
    subtitle: "Today is all about celebrating someone truly special.",
    primaryBtn: "Slide to Open Gift 💌",
    secondaryBtn: "Explore Our Memories 🌸",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    localImage: "assets/images/hero/rabi-hero.jpg",
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
    photo1: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    photo1Local: "assets/images/about/about-01.jpg",
    photo2: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    photo2Local: "assets/images/about/about-02.jpg",
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
      image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80",
      localImage: "assets/images/memories/memory-01.jpg",
      title: "Sweet Beginning",
      caption: "The start of so many beautiful conversations and shared laughs.",
      alt: "Memory photo 1 of Rabi"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
      localImage: "assets/images/memories/memory-02.jpg",
      title: "Pure Smiles",
      caption: "A day filled with genuine happiness and that radiant smile.",
      alt: "Memory photo 2 of Rabi"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&w=600&q=80",
      localImage: "assets/images/memories/memory-03.jpg",
      title: "Candid Grace",
      caption: "One of my absolute favorite candid moments.",
      alt: "Memory photo 3 of Rabi"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80",
      localImage: "assets/images/memories/memory-04.jpg",
      title: "Peaceful Days",
      caption: "The kind of peaceful, soft afternoon you wish could last forever.",
      alt: "Memory photo 4 of Rabi"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
      localImage: "assets/images/memories/memory-05.jpg",
      title: "Effortless Radiance",
      caption: "Just you being your effortless, graceful, and stunning self.",
      alt: "Memory photo 5 of Rabi"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      localImage: "assets/images/memories/memory-06.jpg",
      title: "Unforgettable Laughs",
      caption: "A moment that will always bring an instant smile whenever I look at it.",
      alt: "Memory photo 6 of Rabi"
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      localImage: "assets/images/memories/memory-07.jpg",
      title: "Soft Golden Hour",
      caption: "That gentle glow and quiet charm that is so uniquely yours.",
      alt: "Memory photo 7 of Rabi"
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
      localImage: "assets/images/memories/memory-08.jpg",
      title: "Special Days",
      caption: "A sweet reminder of how lucky I am to celebrate you today.",
      alt: "Memory photo 8 of Rabi"
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
      localImage: "assets/images/memories/memory-09.jpg",
      title: "Cherished Moments",
      caption: "One of the softest, warmest memories we've ever shared.",
      alt: "Memory photo 9 of Rabi"
    },
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
      localImage: "assets/images/memories/memory-10.jpg",
      title: "Always In My Heart",
      caption: "A moment to keep close to the heart forever.",
      alt: "Memory photo 10 of Rabi"
    }
  ],

  memoryBloom: {
    intro: "And somehow… all these little moments became memories.",
    button: "Bloom Our Memories 🌸",
    outro: "And there are still so many more memories waiting to happen. ♡"
  },

  souls: {
    tag: "Interactive Romantic Canvas",
    title: "Two Souls. One Universe. ✨",
    subtitle: "Drag the two glowing souls together across the cosmos to unite them.",
    label1: "YOU 💜",
    label2: "RABI 🌹",
    mergedTitle: "When Two Souls Connect ♡",
    mergedText: "“Out of 8 billion people in this universe, finding you was the most beautiful thing that ever happened.” ✨"
  },

  videos: [
    {
      id: 1,
      video: "assets/videos/video-01.mp4",
      poster: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80",
      localPoster: "assets/images/memories/memory-01.jpg",
      title: "A Sweet Memory",
      caption: "Little clips that hold big smiles."
    },
    {
      id: 2,
      video: "assets/videos/video-02.mp4",
      poster: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
      localPoster: "assets/images/memories/memory-02.jpg",
      title: "Pure Joy",
      caption: "Moments of unfiltered happiness and soft giggles."
    },
    {
      id: 3,
      video: "assets/videos/video-03.mp4",
      poster: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&w=600&q=80",
      localPoster: "assets/images/memories/memory-03.jpg",
      title: "Candid Moments",
      caption: "Just living in the moment and enjoying the day."
    },
    {
      id: 4,
      video: "assets/videos/video-04.mp4",
      poster: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80",
      localPoster: "assets/images/memories/memory-04.jpg",
      title: "Laughter in Motion",
      caption: "The kind of laughter that brightens an entire room."
    },
    {
      id: 5,
      video: "assets/videos/video-05.mp4",
      poster: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
      localPoster: "assets/images/memories/memory-05.jpg",
      title: "Quiet Magic",
      caption: "Soft moments, sweet memories, and happy days."
    },
    {
      id: 6,
      video: "assets/videos/cake-cutting.mp4",
      poster: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80",
      localPoster: "assets/images/special/surprise-photo.jpg",
      title: "Cake Cutting Memory 🎂",
      caption: "The sweetest celebration of the year."
    },
    {
      id: 7,
      video: "assets/videos/final-surprise.mp4",
      poster: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      localPoster: "assets/images/special/final-photo.jpg",
      title: "Special Birthday Surprise ✨",
      caption: "A heartfelt message made especially for Rabi."
    }
  ],

  bouquet: {
    tag: "Floral Arrangement",
    title: "A Bouquet For Someone Special",
    subtitle: "Some flowers are beautiful for a day. Some memories stay forever.",
    description: "Every bloom in this arrangement was chosen with thought. Tap any flower below to reveal its secret message for you.",
    mainImage: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=80",
    localMainImage: "assets/images/bouquet/bouquet-main.jpg",
    detailImage: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80",
    localDetailImage: "assets/images/bouquet/bouquet-detail.jpg",
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
      counterLabel: "Flowers collected for Rabi",
      target: 10,
      completionMessage: "Your bouquet is complete 💐✨ May your year be as colorful, soft, and fragrant as these flowers."
    },
    giftGame: {
      tag: "Mini Game 02",
      title: "Find Rabi's Surprise Gift 🎁",
      subtitle: "One of these pastel gift boxes holds a hidden birthday note. Pick one!",
      wrongMessage: "Almost… try another one ♡",
      giftMessage: "Of course you found it! Good things have a way of finding you. ♡ You deserve all the sweetest surprises in life."
    },
    trustNoButton: {
      tag: "Mini Game 03",
      title: "A Very Important Question 🙈",
      question: "Will you promise to smile, stay this radiant, and be happy every single day? ♡",
      yesBtn: "Yes, I Promise! 💖",
      noBtn: "No 😜",
      dodges: [
        "Nope, not an option! 😂",
        "The 'No' button has trust issues! 🙈",
        "Try clicking Yes instead! 💖",
        "Nice try, but you have to say Yes! 🌸",
        "Never allowed to say no to happiness! ✨"
      ],
      yesResponse: "Yay! Promise sealed forever! You deserve all the happiness in the universe, Rabi! 🎉💜"
    }
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
        signature: "Always, for you ♡"
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
        signature: "From someone who admires you ♡"
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
        signature: "Happy Birthday, Rabi! 🌸"
      }
    ]
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
    finalPhoto: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    localFinalPhoto: "assets/images/special/final-photo.jpg",
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
