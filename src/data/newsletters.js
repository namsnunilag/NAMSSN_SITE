// ── Newsletter data ──────────────────────────────────────────────────────────
// To add a new newsletter:
//  1. Drop the image(s) in public/images/newsletters/
//  2. Add an entry below (newest first)
//
// `images` is always an array:
//   Front only:    images: ['/images/newsletters/week2.jpg']
//   Front + back:  images: ['/images/newsletters/week1-front.jpg', '/images/newsletters/week1-back.jpg']

export const archivedNewsletters = [
  {
    id: 1,
    title: 'NAMSSN Weekly Digest',
    week: 'Week 1',
    date: 'January 5, 2026',
    images: [
      '/images/newsletters/FRONT.png',
      '/images/newsletters/back.png',
    ],
    description: 'Latest happenings in NAMSSN UNILAG.',
  },
  {
    id: 2,
    title: 'NAMSSN Weekly Digest',
    week: 'Week 2',
    date: 'January 19, 2026',
    images: ['/images/newsletters/2.png'],
    description: 'Latest happenings in NAMSSN UNILAG.',
  },
  {
    id: 3,
    title: 'NAMSSN Weekly Digest',
    week: 'Week 3',
    date: 'February 2, 2026',
    images: ['/images/newsletters/3.jpg'],
    description: 'Latest happenings in NAMSSN UNILAG.',
  },
  {
    id: 4,
    title: 'NAMSSN Weekly Digest',
    week: 'Week 4',
    date: 'February 12, 2026',
    images: ['/images/newsletters/4.jpg'],
    description: 'Latest happenings in NAMSSN UNILAG.',
  },
  {
    id: 5,
    title: 'NAMSSN Weekly Digest',
    week: 'Week 5',
    date: 'February 16, 2026',
    images: ['/images/newsletters/5.jpg'],
    description: 'Latest happenings in NAMSSN UNILAG.',
  },
  {
    id: 6,
    title: 'NAMSSN Weekly Digest',
    week: 'Week 6',
    date: 'February 23, 2026',
    images: ['/images/newsletters/6.jpg'],
    description: 'Latest happenings in NAMSSN UNILAG.',
  },
  {
    id: 7,
    title: 'NAMSSN Weekly Digest',
    week: 'Week 7',
    date: 'March 3, 2026',
    images: ['/images/newsletters/7.jpg'],
    description: 'Latest happenings in NAMSSN UNILAG.',
  },
  {
    id: 8,
    title: 'NAMSSN Weekly Digest',
    week: 'Week 8',
    date: 'March 9, 2026',
    images: ['/images/newsletters/8.jpg'],
    description: 'Latest happenings in NAMSSN UNILAG.',
  },
]

export const newsletters = [
  {
    id: 1,
    title: 'The Upper Echelon: NAMSSN UNILAG Welcomes a New Session!',
    week: 'Vol 1, No. 1',
    date: 'October 26, 2026',
    images: [
      '/images/newsletters/26_OCT_2026_FRONT.jpeg',
      '/images/newsletters/26_OCT_2026_BACK.jpeg',
    ],
    imagePosition: 'center 28%',
    description: 'A new session, fresh energy, and another opportunity to grow together! NAMSSN UNILAG unveils its executive team for the 2026/2027 session.',
  },
]
