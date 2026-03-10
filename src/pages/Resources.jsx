import { useState } from 'react'
import { GraduationCap, Briefcase, Building2, BookMarked, Calculator, Plus, Trash2, ExternalLink, ChevronDown, Target } from 'lucide-react'
import { scholarships, internships, jobs, handbook } from '../data/resources'

const TABS = [
  { id: 'cgpa',         label: 'CGPA Calculator', icon: Calculator },
  { id: 'scholarships', label: 'Scholarships',    icon: GraduationCap },
  { id: 'internships',  label: 'Internships',     icon: Building2 },
  { id: 'jobs',         label: 'Jobs',            icon: Briefcase },
  { id: 'handbook',     label: 'Handbook',        icon: BookMarked },
]

// Nigerian 5-point grading scale
const GRADE_POINTS = { A: 5.0, B: 4.0, C: 3.0, D: 2.0, E: 1.0, F: 0.0 }
const GRADES = Object.keys(GRADE_POINTS)

function GPACalculator() {
  const [courses, setCourses] = useState([{ id: 1, name: '', units: 3, grade: 'A' }])

  const addCourse = () => setCourses(c => [...c, { id: Date.now(), name: '', units: 3, grade: 'A' }])
  const removeCourse = (id) => setCourses(c => c.filter(x => x.id !== id))
  const update = (id, field, value) => setCourses(c => c.map(x => x.id === id ? { ...x, [field]: value } : x))

  const totalUnits  = courses.reduce((s, c) => s + Number(c.units), 0)
  const totalPoints = courses.reduce((s, c) => s + Number(c.units) * (GRADE_POINTS[c.grade] ?? 0), 0)
  const gpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00'

  const classification =
    gpa >= 4.5 ? { label: 'First Class',         color: 'text-green-600'  } :
    gpa >= 3.5 ? { label: 'Second Class Upper',   color: 'text-blue-600'   } :
    gpa >= 2.4 ? { label: 'Second Class Lower',   color: 'text-yellow-600' } :
    gpa >= 1.5 ? { label: 'Third Class',          color: 'text-orange-600' } :
                 { label: 'Pass / Below',          color: 'text-red-500'    }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 space-y-3">
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">
          <div className="col-span-5">Course (optional)</div>
          <div className="col-span-3">Units</div>
          <div className="col-span-3">Grade</div>
          <div className="col-span-1" />
        </div>
        {courses.map(course => (
          <div key={course.id} className="grid grid-cols-12 gap-2 items-center">
            <input type="text" placeholder="e.g. MTH 201" value={course.name} onChange={e => update(course.id, 'name', e.target.value)} className="col-span-5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30" />
            <input type="number" min={1} max={6} value={course.units} onChange={e => update(course.id, 'units', Math.min(6, Math.max(1, Number(e.target.value))))} className="col-span-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-blue/30" />
            <select value={course.grade} onChange={e => update(course.id, 'grade', e.target.value)} className="col-span-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30">
              {GRADES.map(g => <option key={g} value={g}>{g} ({GRADE_POINTS[g].toFixed(1)})</option>)}
            </select>
            <button onClick={() => removeCourse(course.id)} disabled={courses.length === 1} className="col-span-1 flex items-center justify-center text-gray-300 hover:text-red-500 disabled:opacity-20 transition-colors"><Trash2 size={15} /></button>
          </div>
        ))}
        <button onClick={addCourse} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-brand-orange text-gray-400 dark:text-gray-500 hover:text-brand-orange rounded-xl py-3 text-sm font-semibold transition-colors">
          <Plus size={15} /> Add Course
        </button>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">{totalUnits} Total Units</p>
          <p className={`text-lg font-bold ${classification.color}`}>{classification.label}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">GPA</p>
          <p className="text-4xl font-black text-brand-blueDark dark:text-white">{gpa}<span className="text-lg text-gray-400 dark:text-gray-500">/5.0</span></p>
        </div>
      </div>
      <GradeReference />
    </div>
  )
}

function FeasibilityChecker() {
  const [form, setForm] = useState({ currentCGPA: '', unitsDone: '', targetCGPA: '', unitsSem1: '', unitsSem2: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const c  = parseFloat(form.currentCGPA)
  const u  = parseFloat(form.unitsDone)
  const t  = parseFloat(form.targetCGPA)
  const n1 = parseFloat(form.unitsSem1)
  const n2 = parseFloat(form.unitsSem2) || 0

  const hasSem2  = form.unitsSem2.trim() !== ''
  const totalNew = n1 + (hasSem2 ? n2 : 0)
  const ready    = [c, u, t, n1].every(x => !isNaN(x) && x >= 0) && n1 > 0 && t <= 5 && (!hasSem2 || n2 > 0)

  const analyze = (units) => {
    const currentPoints  = c * u
    const requiredTotal  = t * (u + units)
    const requiredPoints = requiredTotal - currentPoints
    return requiredPoints / units
  }

  let result = null
  if (ready) {
    if (c >= t) {
      result = { type: 'already', msg: `You already have a CGPA of ${c.toFixed(2)}, above your target of ${t.toFixed(2)}. Keep it up!`, color: 'bg-green-50 border-green-200 text-green-700' }
    } else {
      const gpa1     = analyze(n1)
      const gpaTotal = analyze(totalNew)
      const cls = (g) =>
        g >= 4.5 ? 'First Class'       :
        g >= 3.5 ? 'Second Class Upper' :
        g >= 2.4 ? 'Second Class Lower' :
        g >= 1.5 ? 'Third Class'        : 'Pass'

      if (!hasSem2) {
        if (gpa1 > 5.0) {
          result = { type: 'impossible-1', gpa1: gpa1.toFixed(2), color: 'bg-red-50 border-red-200 text-red-700' }
        } else {
          result = { type: 'possible-1', gpa1: gpa1.toFixed(2), cls1: cls(gpa1), color: 'bg-blue-50 border-blue-200 text-brand-blueDark' }
        }
      } else {
        result = {
          type: 'two',
          gpa1: gpa1.toFixed(2), gpaTotal: gpaTotal.toFixed(2), clsTotal: cls(gpaTotal),
          sem1ok: gpa1 <= 5.0, bothok: gpaTotal <= 5.0,
          color: gpaTotal <= 5.0 ? 'bg-blue-50 border-blue-200 text-brand-blueDark' : 'bg-red-50 border-red-200 text-red-700',
        }
      }
    }
  }

  const field = (label, key, placeholder, max, optional = false) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
        {label}{optional && <span className="ml-1 normal-case font-normal text-gray-400">(optional)</span>}
      </label>
      <input
        type="number" step="0.01" min="0" max={max}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => set(key, e.target.value)}
        className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
      />
    </div>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Enter your current standing and target. Add second semester units to see if it's possible across both semesters.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {field('Current CGPA', 'currentCGPA', 'e.g. 3.20', 5)}
          {field('Total Units Completed', 'unitsDone', 'e.g. 60', 500)}
        </div>
        {field('Target CGPA', 'targetCGPA', 'e.g. 3.50', 5)}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-2">
          {field('Units — 1st Semester', 'unitsSem1', 'e.g. 18', 30)}
          {field('Units — 2nd Semester', 'unitsSem2', 'e.g. 16', 30, true)}
        </div>

        {result && (
          <div className={`rounded-xl border p-4 mt-4 ${result.color}`}>
            {result.type === 'already' && <p className="text-sm font-medium">{result.msg}</p>}
            {result.type === 'possible-1' && (
              <p className="text-sm font-medium">
                Achievable in 1st semester! You need a GPA of at least <span className="font-black text-base">{result.gpa1}/5.0</span> ({result.cls1} range).
              </p>
            )}
            {result.type === 'impossible-1' && (
              <div className="text-sm font-medium space-y-1">
                <p>Not achievable in 1 semester alone — you'd need <strong>{result.gpa1}/5.0</strong>, which exceeds the maximum.</p>
                <p className="text-xs opacity-80">Try adding 2nd semester units above to see if it's possible across both.</p>
              </div>
            )}
            {result.type === 'two' && (
              <div className="space-y-2 text-sm font-medium">
                {result.bothok ? (
                  <>
                    <p>Achievable across both semesters! You need an average GPA of at least <span className="font-black text-base">{result.gpaTotal}/5.0</span> ({result.clsTotal} range) across both semesters.</p>
                    {result.sem1ok
                      ? <p className="text-xs opacity-80">You could also hit it in 1st semester alone with a GPA of <strong>{result.gpa1}/5.0</strong>.</p>
                      : <p className="text-xs opacity-80">1st semester alone isn't enough (would need {result.gpa1}/5.0), but spreading across both works.</p>
                    }
                  </>
                ) : (
                  <p>Not achievable even across both semesters — you'd need an average GPA of <strong>{result.gpaTotal}/5.0</strong>, which exceeds 5.0. You'll need more time.</p>
                )}
              </div>
            )}
          </div>
        )}

        {!ready && (
          <p className="text-xs text-gray-400 text-center mt-3">Fill in Current CGPA, Units Completed, Target CGPA, and 1st Semester Units to see your result.</p>
        )}
      </div>
      <GradeReference />
    </div>
  )
}

function GradeReference() {
  return (
    <details className="border-t border-gray-100 dark:border-gray-700">
      <summary className="flex items-center gap-2 px-6 py-3 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 select-none">
        <ChevronDown size={14} /> Grade Reference
      </summary>
      <div className="px-6 pb-4 grid grid-cols-3 gap-2 text-xs text-center">
        {[['A', '70–100', '5.0'], ['B', '60–69', '4.0'], ['C', '50–59', '3.0'], ['D', '45–49', '2.0'], ['E', '40–44', '1.0'], ['F', '0–39', '0.0']].map(([g, r, p]) => (
          <div key={g} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <span className="font-black text-brand-blueDark dark:text-white">{g}</span>
            <p className="text-gray-400 dark:text-gray-500 mt-0.5">{r}</p>
            <p className="text-brand-orange font-semibold">{p} pts</p>
          </div>
        ))}
      </div>
    </details>
  )
}

function CGPACalculator() {
  const [mode, setMode] = useState('calculate') // 'calculate' | 'feasibility'

  return (
    <div className="max-w-2xl mx-auto">
      {/* Mode switcher */}
      <div className="flex rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 mb-6 shadow-sm">
        <button
          onClick={() => setMode('calculate')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${mode === 'calculate' ? 'bg-brand-blueDark text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-brand-blueDark dark:hover:text-white'}`}
        >
          <Calculator size={15} /> Calculate GPA
        </button>
        <button
          onClick={() => setMode('feasibility')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${mode === 'feasibility' ? 'bg-brand-blueDark text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-brand-blueDark dark:hover:text-white'}`}
        >
          <Target size={15} /> Is My Target Possible?
        </button>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blueDark to-brand-blue p-5 text-white rounded-t-2xl">
        <h3 className="font-bold text-lg mb-0.5">
          {mode === 'calculate' ? 'GPA Calculator' : 'CGPA Feasibility Checker'}
        </h3>
        <p className="text-blue-200 text-sm">
          {mode === 'calculate' ? 'Nigerian University 5.0 grading scale' : 'Find out if your target CGPA is achievable this semester'}
        </p>
      </div>

      {mode === 'calculate' ? <GPACalculator /> : <FeasibilityChecker />}
    </div>
  )
}

function OpportunityCard({ title, badge, deadline, description, link }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-bold text-brand-blueDark dark:text-white leading-snug">{title}</h4>
        {badge && (
          <span className="shrink-0 text-xs font-semibold bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {deadline && (
        <p className="text-xs text-red-500 font-semibold mb-2">
          Deadline: {new Date(deadline).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      )}
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-grow mb-4">{description}</p>
      {link && link !== '#' && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-brand-orange hover:text-brand-blue text-sm font-semibold transition-colors"
        >
          <ExternalLink size={13} /> Learn More
        </a>
      )}
    </div>
  )
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mb-4">
        <Icon size={36} className="text-brand-blue/40" />
      </div>
      <p className="text-gray-400 text-sm max-w-sm">{text}</p>
    </div>
  )
}

export default function Resources() {
  const [activeTab, setActiveTab] = useState('cgpa')

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Student Resources</h1>
        <p className="text-blue-100 max-w-xl mx-auto">
          Your toolkit for academic and career success — scholarships, internships, jobs, CGPA calculator and more.
        </p>
      </section>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto gap-1 py-1 scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === id
                  ? 'text-brand-orange bg-brand-orange/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-brand-blueDark dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4">

          {activeTab === 'cgpa' && <CGPACalculator />}

          {activeTab === 'scholarships' && (
            <div>
              <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-6">Scholarships</h2>
              {scholarships.length === 0 ? (
                <EmptyState icon={GraduationCap} text="No scholarships listed yet. Check back soon." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scholarships.map(s => (
                    <OpportunityCard key={s.id} title={s.title} deadline={s.deadline} description={s.description} link={s.link} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'internships' && (
            <div>
              <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-6">Internship Opportunities</h2>
              {internships.length === 0 ? (
                <EmptyState icon={Building2} text="No internship listings at the moment." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {internships.map(i => (
                    <OpportunityCard key={i.id} title={i.role} badge={i.type} deadline={i.deadline} description={`${i.company} — ${i.description}`} link={i.link} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div>
              <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-6">Job Board</h2>
              {jobs.length === 0 ? (
                <EmptyState icon={Briefcase} text="No job listings at the moment." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.map(j => (
                    <OpportunityCard key={j.id} title={j.role} badge={j.type} description={`${j.company} — ${j.description}`} link={j.link} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'handbook' && (
            <div className="max-w-lg mx-auto">
              <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-6">Student Handbook</h2>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                  <BookMarked size={36} className="text-brand-blue" />
                </div>
                <h3 className="font-bold text-brand-blueDark dark:text-white text-xl mb-2">{handbook.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{handbook.description}</p>
                {handbook.link ? (
                  <a
                    href={handbook.link}
                    download
                    className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white font-bold px-6 py-3 rounded-full transition-colors"
                  >
                    Download Handbook
                  </a>
                ) : (
                  <p className="text-gray-400 italic text-sm">Handbook coming soon.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
