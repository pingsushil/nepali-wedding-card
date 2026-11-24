/**
 * Centralized Wedding Configuration
 * ---------------------------------
 * Update every detail of the Royal Nepali Wedding Invitation from this single file.
 * All components, timelines, Sagan details, default wishes, and Share Studio templates
 * pull directly from `weddingConfig`.
 */

export const weddingConfig = {
  // Core Nepali & English ceremony titles
  ceremonyHeader: {
    nepaliTitle: 'शुभ विवाह',
    nepaliSubtitle: 'मङ्गलमय निमन्त्रणा',
    englishEyebrow: 'Shubha Biwaha • Royal Wedding Invitation',
    mantra: '॥ श्री गणेशाय नमः ॥',
    blessingVerse: 'Two souls united by tradition, blessed by elders, bound forever in love.',
  },

  // Couple details
  couple: {
    groomFirst: 'Aarav',
    groomFull: 'Aarav Bikram Shah',
    groomNepali: 'आरव विक्रम शाह',
    brideFirst: 'Prisha',
    brideFull: 'Prisha Rajbhandari',
    brideNepali: 'प्रिशा राजभण्डारी',
    monogram: 'A & P',
    hashtag: '#AaravWedsPrisha',
    city: 'Kathmandu, Nepal',
  },

  // Primary Wedding Date & Live Countdown Target (Nepal Standard Time +05:45)
  weddingDate: {
    isoTarget: '2027-02-19T10:30:00+05:45',
    bsFull: 'Falgun 7, 2083 BS',
    bsNepali: 'फाल्गुन ७, २०८३',
    adFull: 'Friday, February 19, 2027',
    dateRangeSummary: 'Falgun 5 – 8, 2083 BS  •  Feb 17 – 20, 2027',
  },

  // Formal Family Lineages
  families: {
    groomSide: {
      badge: "Groom's Family",
      nepaliBadge: 'वर पक्ष',
      parentsLabel: 'Eldest Son of',
      parents: 'Shri Rajendra Bikram Shah & Smt. Sunita Devi Shah',
      grandparents: 'Grandson of Late Maj. Gen. Narendra Bikram Shah & Smt. Indira Shah',
      residence: 'Lazimpat, Kathmandu',
    },
    brideSide: {
      badge: "Bride's Family",
      nepaliBadge: 'वधू पक्ष',
      parentsLabel: 'Beloved Daughter of',
      parents: 'Dr. Prakash Man Rajbhandari & Smt. Meera Rajbhandari',
      grandparents: 'Granddaughter of Shri Keshav Man Rajbhandari & Smt. Sarita Rajbhandari',
      residence: 'Jhamsikhel, Lalitpur',
    },
    formalInvitationLine:
      'Together with our elders and loved ones, we joyfully solicit the honor of your presence and blessings as our two families unite in sacred matrimony.',
  },

  // Entrance Doors & Guest Defaults
  entrance: {
    defaultGuestName: 'Dear Family & Friends',
    nepaliGreeting: 'नमस्ते',
    salutationPrefix: 'Namaste,',
    salutationSuffix: 'You Are Cordially Invited',
    sealCtaPrimary: 'Tap to Open',
    sealCtaSecondary: 'Invitation',
  },

  // Optional Audio Atmosphere
  audio: {
    src: '/wedding-theme.mp3',
    title: 'Mangal Dhun — Shehnai & Sarangi',
  },

  // 4 Wedding Ceremonies & Events Timeline
  events: [
    {
      id: 'mehndi',
      title: 'Mehndi Ceremony',
      nepaliTitle: 'मेहन्दी उत्सव',
      subtitle: 'Henna, Folk Songs & Courtyard Tea',
      moodKey: 'emerald',
      accentHex: '#1B7F5C',
      bgTint: 'rgba(13, 74, 54, 0.34)',
      borderTint: 'rgba(65, 196, 148, 0.32)',
      badgeText: '#A7F3D0',
      bsDate: 'Falgun 5, 2083 BS',
      adDate: 'Wednesday, Feb 17, 2027',
      time: '2:00 PM – 6:30 PM',
      dressCode: 'Emerald Green, Sage, or Floral Pastels',
      venueName: 'Garden Terrace, Hotel Yak & Yeti',
      venueAddress: 'Durbar Marg, Kathmandu',
      mapsUrl: 'https://maps.google.com/?q=Hotel+Yak+%26+Yeti+Kathmandu',
      highlights: [
        'Live Rajasthani & Nepali henna artists for all guests',
        'Acoustic Madal & folk melodies beneath the heritage garden canopy',
        'Artisanal Nepali chiya, sel roti bites, and festive chaat counter',
      ],
      note: 'An intimate sunlit afternoon celebrating artistry, laughter, and the first colors of the wedding week.',
    },
    {
      id: 'haldi-sangeet',
      title: 'Haldi & Sangeet',
      nepaliTitle: 'हल्दी तथा संगीत सन्ध्या',
      subtitle: 'Sayapatri Blessings & Starlit Dance Night',
      moodKey: 'marigold',
      accentHex: '#E09119',
      bgTint: 'rgba(146, 72, 10, 0.30)',
      borderTint: 'rgba(245, 185, 66, 0.36)',
      badgeText: '#FDE68A',
      bsDate: 'Falgun 6, 2083 BS',
      adDate: 'Thursday, Feb 18, 2027',
      time: '11:30 AM (Haldi) • 6:30 PM (Sangeet)',
      dressCode: 'Marigold Yellow for Haldi • Shimmering Gold & Jewel Tones for Sangeet',
      venueName: "Courtyard Pavilion, Dwarika's Hotel",
      venueAddress: 'Battisputali, Kathmandu',
      mapsUrl: "https://maps.google.com/?q=Dwarika's+Hotel+Kathmandu",
      highlights: [
        'Traditional turmeric & marigold petal shower in the heritage brick courtyard',
        'Family dance performances, Panche Baja fusion, and celebratory cocktails',
        'Authentic Newari & Thakali evening feast under carved wooden balconies',
      ],
      note: 'Come ready with joyful hearts and dancing feet as both families light up the evening together.',
    },
    {
      id: 'shubha-biwaha',
      title: 'Shubha Biwaha',
      nepaliTitle: 'शुभ विवाह समारोह',
      subtitle: 'Janti Procession, Swayamvar & Sacred Agni',
      moodKey: 'crimson',
      accentHex: '#B81D30',
      bgTint: 'rgba(107, 15, 26, 0.45)',
      borderTint: 'rgba(212, 175, 55, 0.45)',
      badgeText: '#F7E7CE',
      bsDate: 'Falgun 7, 2083 BS',
      adDate: 'Friday, Feb 19, 2027',
      time: '9:30 AM (Janti) • 10:30 AM (Lagan & Mandap)',
      dressCode: 'Traditional Nepali Attire — Red/Crimson Saree, Daura Suruwal & Dhaka Topi',
      venueName: 'Mandap Lawn & Regency Ballroom, Hyatt Regency',
      venueAddress: 'Taragaon, Boudha, Kathmandu',
      mapsUrl: 'https://maps.google.com/?q=Hyatt+Regency+Kathmandu',
      highlights: [
        'Grand Janti arrival accompanied by traditional Panche Baja ensemble',
        'Swayamvar Dubo Mala exchange, Kanyadaan, Sindoor Daan & Saptapadi',
        'Auspicious midday wedding feast following the sacred vows',
      ],
      note: 'The heart of our celebration—witnessing the sacred vows around the ceremonial fire.',
    },
    {
      id: 'reception-bhoj',
      title: 'Reception & Preeti Bhoj',
      nepaliTitle: 'प्रीतिभोज तथा स्वागत समारोह',
      subtitle: 'Royal Banquet & Evening of Gratitude',
      moodKey: 'champagne',
      accentHex: '#D4AF37',
      bgTint: 'rgba(74, 18, 36, 0.44)',
      borderTint: 'rgba(247, 231, 206, 0.34)',
      badgeText: '#F7E7CE',
      bsDate: 'Falgun 8, 2083 BS',
      adDate: 'Saturday, Feb 20, 2027',
      time: '6:00 PM Onwards',
      dressCode: 'Royal Velvet, Formal Saree, Lehenga, Bandhgala, or Black-Tie Suit',
      venueName: 'Grand Durbar Hall, The Soaltee Kathmandu',
      venueAddress: 'Tahachal, Kathmandu',
      mapsUrl: 'https://maps.google.com/?q=The+Soaltee+Kathmandu',
      highlights: [
        'Warm welcome of the newlyweds with live Sarangi & symphony quartet',
        'Royal multi-course Nepali & continental Preeti Bhoj dinner',
        'Family portraits, toasts, and blessings under golden chandeliers',
      ],
      note: 'Join us for an unforgettable evening of warmth, fine dining, and cherished company.',
    },
  ],

  // Animated Bangkok Honeymoon Fund (Digital Sagan)
  sagan: {
    sectionEyebrow: 'Digital Sagan • Honeymoon Blessings',
    nepaliTitle: 'सगुन तथा आशीर्वाद',
    title: 'Our Bangkok Honeymoon Fund',
    route: {
      originCode: 'KTM',
      originCity: 'Kathmandu',
      destinationCode: 'BKK',
      destinationCity: 'Bangkok',
      flightLabel: 'Honeymoon Chapter • 2027',
    },
    messageNepali: 'हजुरहरूको उपस्थिति र आशीर्वाद नै हाम्रो लागि सबैभन्दा अमूल्य उपहार हो।',
    messageEnglish:
      'Your presence, warm smiles, and heartfelt blessings are truly the greatest gift we could ever ask for. For loved ones who wish to offer traditional Sagan digitally toward our Bangkok honeymoon adventures, we accept it with deep gratitude.',
    qrImagePath: '/qr-honeymoon.png',
    qrDownloadFilename: 'Aarav-Prisha-Bangkok-Sagan-QR.png',
    paymentProviderLabel: 'eSewa / Fonepay / Khalti',
    paymentId: '9841028492',
    accountHolder: 'Aarav Bikram Shah & Prisha Rajbhandari',
    bankNote: 'Fonepay & eSewa Verified • Mention your name in remarks',
    blessingTags: [
      {
        id: 'dinner',
        label: 'Romantic Dinner in Bangkok',
        emoji: '🕯️',
        note: 'Enjoy a candlelit Chao Phraya riverside dinner on us!',
      },
      {
        id: 'boat',
        label: 'Island Boat Ride',
        emoji: '⛵',
        note: 'Wishing you sun-kissed waves & golden horizons!',
      },
      {
        id: 'flight',
        label: 'Flight Upgrade',
        emoji: '✈️',
        note: 'Fly in comfort as you begin your forever journey!',
      },
      {
        id: 'blessings',
        label: 'Pure Blessings',
        emoji: '🙏',
        note: 'Sending boundless love, harmony & lifelong happiness.',
      },
    ],
  },

  // Initial Default Wishes for the Interactive Blessing Wall
  defaultBlessings: [
    {
      id: 'wish-1',
      name: 'Thulo Buwa & Thuli Ama',
      relation: 'Patan, Lalitpur',
      message:
        'May Lord Pashupatinath shower endless prosperity, peace, and lifelong devotion upon Aarav & Prisha. Shubha Ashirwad!',
      tag: 'Pure Blessings',
      createdAt: '2026-11-18T10:15:00+05:45',
    },
    {
      id: 'wish-2',
      name: 'Rohan & Ananya Adhikari',
      relation: 'Kathmandu',
      message:
        'Counting down the days to dance at your Sangeet! Wishing you both a magical wedding week and the dreamiest Bangkok getaway.',
      tag: 'Romantic Dinner in Bangkok',
      createdAt: '2026-11-19T18:40:00+05:45',
    },
    {
      id: 'wish-3',
      name: 'Dr. Mahesh Pokharel & Family',
      relation: 'Pokhara',
      message:
        'Such a graceful union of two wonderful families. Looking forward to celebrating your Shubha Biwaha in Kathmandu!',
      tag: 'Pure Blessings',
      createdAt: '2026-11-20T09:20:00+05:45',
    },
    {
      id: 'wish-4',
      name: 'Srijana Didi & Family',
      relation: 'Sydney, Australia',
      message:
        'Flying home just for your Panche Baja and Preeti Bhoj! May your home always glow with laughter and warmth.',
      tag: 'Island Boat Ride',
      createdAt: '2026-11-21T14:05:00+05:45',
    },
    {
      id: 'wish-5',
      name: 'Kiran & Nisha Gurung',
      relation: 'Bhaktapur',
      message:
        'Here is to a lifetime of partnership, adventure, and endless cups of morning chiya together. Badhai cha!',
      tag: 'Flight Upgrade',
      createdAt: '2026-11-22T20:10:00+05:45',
    },
  ],

  // Host Share Studio WhatsApp Template
  shareStudio: {
    sampleNames: [
      'Suman Thapa & Family',
      'Dr. Bikash Shrestha & Family',
      'Nabin Karki & Family',
      'Anjali Malla',
    ],
    buildWhatsAppMessage: (guestName, inviteUrl) =>
      `नमस्ते ${guestName} 🙏✨\n\n` +
      `With the blessings of our elders, the Shah & Rajbhandari families warmly invite you to celebrate the *Shubha Biwaha (शुभ विवाह)* of *Aarav & Prisha* in Kathmandu.\n\n` +
      `📅 Falgun 5–8, 2083 BS (Feb 17–20, 2027)\n` +
      `💌 Tap to open your personalized invitation:\n${inviteUrl}\n\n` +
      `We eagerly look forward to welcoming you with warmth and gratitude. 🌺`,
  },

  // Footer Hospitality & Contact
  footer: {
    nepaliClosing: 'हार्दिक धन्यवाद तथा सादर निमन्त्रणा',
    englishClosing: 'With Love, Warmth & Gratitude',
    hostsLine: 'The Shah & Rajbhandari Families • Kathmandu, Nepal',
    rsvpNote: 'For travel assistance or hospitality inquiries, please reach out to our family hosts.',
  },
};
