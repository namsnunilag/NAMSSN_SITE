// ── Site-wide announcements ──────────────────────────────────────────────────
// Set active: false to hide an announcement without deleting it.

export const siteAnnouncements = [
  {
    id: 4,
    message: '🏆 Decagon 5.0 — 2nd Stage done! Results are live. Next: Quarter Final.',
    type: 'info',
    href: '/decagon',
    linkText: 'View Leaderboard',
    active: true,
  },
  {
    id: 3,
    message: '🌙 Eid Mubarak to all our Muslim faithfuls! Wishing you peace, joy, and blessings.',
    type: 'info',
    href: '/eid',
    linkText: 'View Celebration',
    active: false,
  },
  {
    id: 2,
    message: '🥧 Happy Pi Day! The NAMSSN Academic Team presents: Five Integrals Converging to π',
    type: 'info',
    href: '/celebration/pi-day',
    linkText: 'Read & Download',
    active: false,
  },
  {
    id: 1,
    message: '⚠️ UNILAG ASUU has commenced an indefinite strike over unpaid January & February 2026 salaries.',
    type: 'warning',
    href: 'https://www.nasowsunilag.com/events/newss/unilag-lecturers-begin-indefinite-strike-over-amputated-january-february-salaries',
    linkText: 'Read Full Update',
    active: false,
  },
]
