// ── Academics data ───────────────────────────────────────────────────────────

export const announcements = [
  {
    id: 1,
    title: 'First Semester Examination Timetable Released',
    date: '2026-01-15',
    type: 'exam',      // 'exam' | 'general' | 'deadline' | 'result'
    content: 'The 2025/2026 first semester examination timetable has been released. Please check the department notice board or contact your class rep for details.',
  },
  // Add more announcements below by copying the block above ↑
  // Types available: 'exam', 'general', 'deadline', 'result'
]

// ── Single Drive link for ALL course materials (until sorted by level) ────────
export const courseMaterialsLink = 'https://drive.google.com/drive/u/0/mobile/folders/1m8ujMpighwtyi_nBaC_iTKG58Br0X-gg'

// Individual materials per course/level — leave empty for now, fill later
export const courseMaterials = []

// ── Single Drive link for ALL past questions (until sorted by level) ──────────
export const pastQuestionsLink = ''  // paste your Google Drive link here

// Individual past questions per course/level — leave empty for now, fill later
export const pastQuestions = []

export const timetable = {
  semester: '',   // e.g. 'First Semester 2025/2026'
  image: '',      // e.g. '/images/timetable.jpg'
  pdf: '',        // e.g. '/timetable.pdf'
}
