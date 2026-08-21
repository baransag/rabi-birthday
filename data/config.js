/**
 * ════════════════════════════════════════════════════════════════════════════
 * RABI — The Bouquet That Never Fades
 * Central Configuration File
 *
 * ✦ This is the ONLY file you need to edit to personalize the experience.
 * ✦ No HTML. No other JS files. Everything lives here.
 * ════════════════════════════════════════════════════════════════════════════
 */

const CONFIG = {

  // ──────────────────────────────────────────────────────────────────────────
  // IDENTITY
  // ──────────────────────────────────────────────────────────────────────────
  name:     'Rabiya',
  nickname: 'Rabi',

  birthday: {
    month: 9,   // 1-indexed  (9 = September)
    day:   6,
  },

  showAge: false,   // Never display age


  // ──────────────────────────────────────────────────────────────────────────
  // SCENE 01 — OPENING
  // ──────────────────────────────────────────────────────────────────────────
  opening: {
    dateDisplay:  '06.09',
    preQuote:     'Someone once said...',
    quote:        '"I like flowers."',
    soText:       'So...',
    revealMain:   'I built you a bouquet.',
    revealSub:    'But this one never fades. 🌹',
  },


  // ──────────────────────────────────────────────────────────────────────────
  // SCENE 02 — DEVELOPER REVEAL
  // ──────────────────────────────────────────────────────────────────────────
  developer: {
    windowTitle: 'rabi.js — birthday universe',
    codeLines: [
      'const rabi = {',
      '    name: "Rabiya",',
      '    nickname: "Rabi",',
      '    birthday: "06 September",',
      '    favoriteColor: "Purple",',
      '    favoriteFlower: "Red Roses"',
      '};',
      '',
      'const reason = "You are special.";',
      '',
      'function createBirthdayGift() {',
      '    return {',
      '        flowers: Infinity,',
      '        memories: "ours",',
      '        love: "always"',
      '    };',
      '}',
      '',
      'createBirthdayGift();',
    ],
    executeLabel:  'EXECUTE',
    successLabel:  'BUILD COMPLETE ✓',
    successSub:    'Dissolving into petals...',
  },


  // ──────────────────────────────────────────────────────────────────────────
  // SCENE 03 — THE DIGITAL BOUQUET
  // ──────────────────────────────────────────────────────────────────────────
  bouquet: {
    title: 'For Rabi 💜',
    introLines: [
      '«One rose would have been too simple.»',
      '«So I made you a bouquet.»',
      '«And because you\'re Rabi...»',
      'It had to be beautiful.',
    ],
    pickHint:  'Each rose holds a message',
    pickLabel: 'PICK A ROSE 🌹',

    // 7 roses — last one (isFinal: true) triggers the petal explosion
    roses: [
      { message: '«For your smile.»',                                                            isFinal: false },
      { message: '«For every little thing that makes you, you.»',                               isFinal: false },
      { message: '«For all the moments that became memories.»',                                 isFinal: false },
      { message: '«For the days you made brighter.»',                                           isFinal: false },
      { message: '«For the person behind the name Rabiya.»',                                    isFinal: false },
      { message: '«Because one rose was never enough.»',                                        isFinal: false },
      { message: '«This one is simply because I love giving you reasons to smile. ❤️»',         isFinal: true  },
    ],

    finalRoseHint: 'One rose remains...',
    allPickedText: 'You held the whole bouquet. 💜',
  },


  // ──────────────────────────────────────────────────────────────────────────
  // SCENE 04 — GALAXY / TWO SOULS
  // ──────────────────────────────────────────────────────────────────────────
  galaxy: {
    leftLabel:    'YOU',
    rightLabel:   'RABI',
    centerText:   'two souls. one universe.',
    mergeButton:  'Bring us together',
    mergeMessages: [
      'Some people become memories.',
      'Some become your universe.',
      'You became mine. 💜',
    ],
  },


  // ──────────────────────────────────────────────────────────────────────────
  // SCENE 05 — MEMORY GARDEN
  // ──────────────────────────────────────────────────────────────────────────
  memory: {
    title:           'Every memory deserves a flower. 🌹',
    missingCaption:  'A memory waiting to be added.',
    secretTriggerTaps: 7,   // How many times to tap secret flower for egg #1
  },


  // ──────────────────────────────────────────────────────────────────────────
  // SCENE 05B — THE SECRET GARDEN
  // ──────────────────────────────────────────────────────────────────────────
  secret: {
    found:   'You found something I didn\'t tell you about...',
    reveal:  'RABI FOUND THE SECRET 💜',

    // ↓ Edit this freely — it's your private message
    message: `Some things I never say out loud.

But I built them into every corner of this.

Every particle. Every rose. Every star.

All of it — quietly — for you.

💜`,
  },


  // ──────────────────────────────────────────────────────────────────────────
  // SCENE 06 — PURPLE DREAM ROOM
  // ──────────────────────────────────────────────────────────────────────────
  dreamRoom: {
    quote: '«Somewhere between the stars,\nI kept a little place for you.»',
  },


  // ──────────────────────────────────────────────────────────────────────────
  // SCENE 07 — THE DAY
  // ──────────────────────────────────────────────────────────────────────────
  theDay: {
    dayNumber:      '06',
    monthName:      'SEPTEMBER',
    bornText:       'THE DAY RABI WAS BORN',
    onBirthday:     'TODAY IS RABI DAY 💜',
    afterBirthday:  'RABI DAY WILL ALWAYS BE SPECIAL',
    countdownSuffix: 'days until Rabi Day 💜',
  },


  // ──────────────────────────────────────────────────────────────────────────
  // SCENE 08 — BIRTHDAY TABLE
  // ──────────────────────────────────────────────────────────────────────────
  birthday: {
    heading:     'Happy Birthday, Rabiya',
    subheading:  '06 • 09',
    candleHint:  'Tap the candles... ✨',
    afterCandles: '💜',
  },


  // ──────────────────────────────────────────────────────────────────────────
  // SCENE 09 — FINAL LETTER
  // ──────────────────────────────────────────────────────────────────────────
  letter: {
    salutation: 'Dear Rabi,',

    // ↓ Edit freely — each paragraph is a new line
    body: [
      'You asked me for a website.',
      '',
      'I could have made you a normal one.',
      '',
      'But you\'re not a normal person to me.',
      '',
      'So I wanted to make something that felt a little more like you.',
      '',
      'A little purple.',
      '',
      'A little beautiful.',
      '',
      'A little crazy.',
      '',
      'And full of roses.',
      '',
      'Just like the things you love.',
      '',
      'Happy Birthday, Rabi. 💜',
      '',
      '06 September',
    ],

    closing:      '— From someone who wanted to give you more than flowers.',
    finalRoseTag: '🌹 RABI',
    neverFades:   'A bouquet that never fades.',
    finalCaption: '06 • 09 • forever memorable',
    continueLabel: 'The flowers are waiting...',
  },


  // ──────────────────────────────────────────────────────────────────────────
  // SCENE 10 — EPILOGUE
  // ──────────────────────────────────────────────────────────────────────────
  epilogue: {
    title:     'The Bouquet That Never Fades',
    finalLine: 'Whenever you come back, the flowers will still be here.',
  },


  // ──────────────────────────────────────────────────────────────────────────
  // REVISIT STATE (second+ visit)
  // ──────────────────────────────────────────────────────────────────────────
  revisit: {
    greeting:      'Welcome back, Rabi.',
    subtitle:      'The flowers are still here.',
    enterBouquet:  'Enter the bouquet',
    replayJourney: 'Replay the journey',
  },


  // ──────────────────────────────────────────────────────────────────────────
  // IMAGE PATHS
  // ──────────────────────────────────────────────────────────────────────────
  images: {
    portraits: [
      'assets/images/portraits/rabi-01.jpg',
      'assets/images/portraits/rabi-02.jpg',
      'assets/images/portraits/rabi-03.jpg',
      'assets/images/portraits/rabi-04.jpg',
    ],
    special: {
      favorite: 'assets/images/special/favorite-photo.jpg',
      birthday: 'assets/images/special/birthday-photo.jpg',
      special:  'assets/images/special/special-memory.jpg',
      final:    'assets/images/special/final-photo.jpg',
    },
  },


  // ──────────────────────────────────────────────────────────────────────────
  // AUDIO
  // ──────────────────────────────────────────────────────────────────────────
  audio: {
    ambientSrc: 'assets/audio/ambient.mp3',
    volume:     0.30,
    fadeMs:     2000,
  },


  // ──────────────────────────────────────────────────────────────────────────
  // EASTER EGGS
  // ──────────────────────────────────────────────────────────────────────────
  easterEggs: {
    enabled: true,

    // Egg 1 — tap secret flower N times
    egg1TapsRequired: 7,
    egg1Message: 'ACCESS GRANTED\n\nYou found the thing I hid for you. 💜',

    // Egg 2 — tap the moon in dream room
    egg2Message: 'Even the moon knows your name.',

    // Egg 3 — tap "RABI" text N times in epilogue
    egg3TapsRequired: 5,
    egg3Message: 'System warning:\n\nRABI.exe is too beautiful.\nSystem unable to continue normally. ❤️',
  },


  // ──────────────────────────────────────────────────────────────────────────
  // PERFORMANCE
  // ──────────────────────────────────────────────────────────────────────────
  performance: {
    // Override quality: null = auto-detect | 'HIGH' | 'MEDIUM' | 'LOW' | 'REDUCED'
    forceQuality: null,
  },

};
