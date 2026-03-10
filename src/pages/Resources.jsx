import { useState } from 'react'
import { GraduationCap, Briefcase, BookMarked, Calculator, Plus, Trash2, ExternalLink, ChevronDown, Target } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'
import { scholarships, internships, jobs, jobPlatforms, handbook } from '../data/resources'

const TABS = [
  { id: 'cgpa',         label: 'CGPA Calculator', icon: Calculator },
  { id: 'scholarships', label: 'Scholarships',    icon: GraduationCap },
  { id: 'jobs',         label: 'Jobs & Internships', icon: Briefcase },
  { id: 'handbook',     label: 'Handbook',        icon: BookMarked },
]

// Nigerian 5-point grading scale
const GRADE_POINTS = { A: 5.0, B: 4.0, C: 3.0, D: 2.0, E: 1.0, F: 0.0 }
const GRADES = Object.keys(GRADE_POINTS)

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

function CGPACalc() {
  const [prev, setPrev] = useState({ cgpa: '', units: '' })
  const [courses, setCourses] = useState([{ id: 1, name: '', units: 3, grade: 'A' }])

  const addCourse = () => setCourses(c => [...c, { id: Date.now(), name: '', units: 3, grade: 'A' }])
  const removeCourse = (id) => setCourses(c => c.filter(x => x.id !== id))
  const update = (id, field, value) => setCourses(c => c.map(x => x.id === id ? { ...x, [field]: value } : x))

  const prevCGPA  = parseFloat(prev.cgpa)
  const prevUnits = parseFloat(prev.units)

  const semUnits  = courses.reduce((s, c) => s + Number(c.units), 0)
  const semPoints = courses.reduce((s, c) => s + Number(c.units) * (GRADE_POINTS[c.grade] ?? 0), 0)
  const semGPA    = semUnits > 0 ? semPoints / semUnits : 0

  const hasPrev   = !isNaN(prevCGPA) && !isNaN(prevUnits) && prevUnits >= 0
  const totalUnits  = hasPrev ? prevUnits + semUnits : semUnits
  const totalPoints = hasPrev ? (prevCGPA * prevUnits) + semPoints : semPoints
  const newCGPA     = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00'
  const displayGPA  = semUnits > 0 ? semGPA.toFixed(2) : '0.00'

  const cls = (g) =>
    g >= 4.5 ? { label: 'First Class',         color: 'text-green-600'  } :
    g >= 3.5 ? { label: 'Second Class Upper',   color: 'text-blue-600'   } :
    g >= 2.4 ? { label: 'Second Class Lower',   color: 'text-yellow-600' } :
    g >= 1.5 ? { label: 'Third Class',          color: 'text-orange-600' } :
               { label: 'Pass / Below',          color: 'text-red-500'    }

  const cgpaClass = cls(parseFloat(newCGPA))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Previous CGPA inputs */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Previous Academic Record (optional)</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Current CGPA</label>
            <input
              type="number" step="0.01" min="0" max="5"
              placeholder="e.g. 3.50"
              value={prev.cgpa}
              onChange={e => setPrev(p => ({ ...p, cgpa: e.target.value }))}
              className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Total Units Completed</label>
            <input
              type="number" min="0"
              placeholder="e.g. 60"
              value={prev.units}
              onChange={e => setPrev(p => ({ ...p, units: e.target.value }))}
              className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
          </div>
        </div>
      </div>

      {/* Current semester courses */}
      <div className="p-6 space-y-3">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">This Semester's Courses</p>
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">
          <div className="col-span-5">Course (optional)</div>
          <div className="col-span-3">Units</div>
          <div className="col-span-3">Grade</div>
          <div className="col-span-1" />
        </div>
        {courses.map(course => (
          <div key={course.id} className="grid grid-cols-12 gap-2 items-center">
            <input type="text" placeholder="e.g. MTH 301" value={course.name} onChange={e => update(course.id, 'name', e.target.value)} className="col-span-5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30" />
            <select value={course.units} onChange={e => update(course.id, 'units', Number(e.target.value))} className="col-span-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-blue/30">
              {[1,2,3,4,5,6].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
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

      {/* Results */}
      <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">Sem GPA</p>
            <p className="text-2xl font-black text-brand-blueDark dark:text-white">{displayGPA}<span className="text-sm text-gray-400">/5.0</span></p>
          </div>
          <div className="border-x border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">New CGPA</p>
            <p className="text-3xl font-black text-brand-orange">{newCGPA}<span className="text-sm text-gray-400">/5.0</span></p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Units</p>
            <p className="text-2xl font-black text-brand-blueDark dark:text-white">{totalUnits}</p>
          </div>
        </div>
        <p className={`text-center font-bold mt-3 ${cgpaClass.color}`}>{cgpaClass.label}</p>
      </div>

      <GradeReference />
    </div>
  )
}

function CGPACalculator() {
  const [mode, setMode] = useState('cgpa') // 'cgpa' | 'feasibility'

  const headers = {
    cgpa:        { title: 'CGPA Calculator',         sub: 'Compute your cumulative GPA including this semester' },
    feasibility: { title: 'CGPA Feasibility Checker', sub: 'Find out if your target CGPA is achievable' },
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Mode switcher */}
      <div className="flex rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 mb-6 shadow-sm">
        {[
          { id: 'cgpa',        icon: GraduationCap, label: 'CGPA' },
          { id: 'feasibility', icon: Target,         label: 'Target?' },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${mode === id ? 'bg-brand-blueDark text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-brand-blueDark dark:hover:text-white'}`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blueDark to-brand-blue p-5 text-white rounded-t-2xl">
        <h3 className="font-bold text-lg mb-0.5">{headers[mode].title}</h3>
        <p className="text-blue-200 text-sm">{headers[mode].sub}</p>
      </div>

      {mode === 'cgpa'        && <CGPACalc />}
      {mode === 'feasibility' && <FeasibilityChecker />}
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

function PlatformCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobPlatforms.map(p => (
        <a
          key={p.id}
          href={p.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 hover:border-brand-blue/30 transition-all duration-200 flex flex-col group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={p.logo}
                alt={p.name}
                className="w-7 h-7 object-contain"
                onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
              />
              <span style={{ display: 'none' }} className="w-full h-full items-center justify-center text-brand-blue font-black text-lg">
                {p.name[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-brand-blueDark dark:text-white group-hover:text-brand-blue transition-colors truncate">{p.name}</h4>
              <span className="text-xs font-semibold bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full">{p.badge}</span>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-grow">{p.description}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-brand-orange text-sm font-semibold group-hover:gap-2 transition-all">
            Visit Platform <ExternalLink size={12} />
          </span>
        </a>
      ))}
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
  usePageTitle('Student Resources')
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
              <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-2">Scholarships</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Recurring scholarships available to Nigerian university students. Deadlines vary yearly — visit each link for the latest dates.</p>
              {scholarships.length === 0 ? (
                <EmptyState icon={GraduationCap} text="No scholarships listed yet. Check back soon." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scholarships.map(s => (
                    <OpportunityCard key={s.id} title={s.title} badge={s.badge} deadline={s.deadline} description={s.description} link={s.link} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div>
              <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-2">Jobs & Internships</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Use these trusted platforms to find jobs and internship opportunities in Nigeria and beyond.</p>
              <PlatformCards />
              {(jobs.length > 0 || internships.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {internships.map(i => (
                    <OpportunityCard key={i.id} title={i.role} badge={i.type} deadline={i.deadline} description={`${i.company} — ${i.description}`} link={i.link} />
                  ))}
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
