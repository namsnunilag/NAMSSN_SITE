// ── Research Papers by Lecturers ─────────────────────────────────────────────
// Each paper: { id, title, authors, field, journal, year, abstract, link }
// link is optional — set to null if no public URL available

export const mathFields = [
  'All',
  'Analysis',
  'Algebra',
  'Applied Mathematics',
  'Statistics & Probability',
  'Topology',
  'Differential Equations',
]

export const papers = [
  // ── Analysis ──────────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'On the Convergence of Fourier Series in Banach Spaces',
    authors: ['Dr. A. Adeyemi'],
    field: 'Analysis',
    journal: 'Journal of Mathematical Analysis and Applications',
    year: 2022,
    abstract:
      'This paper investigates the convergence properties of Fourier series for functions defined on Banach spaces, extending classical results to abstract settings with applications to functional analysis.',
    link: null,
  },
  {
    id: 2,
    title: 'Fixed Point Theorems for Nonlinear Operators in Hilbert Spaces',
    authors: ['Prof. B. Ojo', 'Dr. A. Adeyemi'],
    field: 'Analysis',
    journal: 'Nonlinear Analysis: Theory, Methods & Applications',
    year: 2021,
    abstract:
      'We establish new fixed point results for a class of nonlinear operators acting on Hilbert spaces, with implications for the solvability of operator equations.',
    link: null,
  },

  // ── Algebra ───────────────────────────────────────────────────────────────
  {
    id: 3,
    title: 'Group Rings and Their Representations Over Finite Fields',
    authors: ['Dr. C. Nwosu'],
    field: 'Algebra',
    journal: 'Algebra and Its Applications',
    year: 2023,
    abstract:
      'A study of group ring structures and associated representations, focusing on finite fields and their combinatorial properties relevant to coding theory.',
    link: null,
  },
  {
    id: 4,
    title: 'On Lie Algebras Arising from Nilpotent Groups',
    authors: ['Prof. D. Fashola'],
    field: 'Algebra',
    journal: 'Communications in Algebra',
    year: 2020,
    abstract:
      'This paper explores the construction of Lie algebras associated with nilpotent groups and examines structural properties such as derived length and central series.',
    link: null,
  },

  // ── Applied Mathematics ───────────────────────────────────────────────────
  {
    id: 5,
    title: 'Mathematical Modelling of Fluid Flow Through Porous Media',
    authors: ['Dr. E. Balogun'],
    field: 'Applied Mathematics',
    journal: 'Applied Mathematical Modelling',
    year: 2022,
    abstract:
      'A mathematical framework is developed to model viscous fluid flow through heterogeneous porous media, incorporating non-Darcy effects and variable permeability.',
    link: null,
  },
  {
    id: 6,
    title: 'Numerical Methods for Solving Nonlinear Boundary Value Problems',
    authors: ['Dr. E. Balogun', 'Dr. F. Okonkwo'],
    field: 'Applied Mathematics',
    journal: 'Journal of Computational and Applied Mathematics',
    year: 2021,
    abstract:
      'Novel iterative numerical schemes are proposed for nonlinear boundary value problems, with convergence analysis and comparative performance benchmarks.',
    link: null,
  },

  // ── Statistics & Probability ──────────────────────────────────────────────
  {
    id: 7,
    title: 'Bayesian Estimation in Stochastic Differential Equations',
    authors: ['Prof. G. Akinwande'],
    field: 'Statistics & Probability',
    journal: 'Statistical Methodology',
    year: 2023,
    abstract:
      'Bayesian inference techniques are applied to parameter estimation problems arising from stochastic differential equations driven by Brownian motion.',
    link: null,
  },
  {
    id: 8,
    title: 'Extreme Value Theory and Risk Analysis in Financial Mathematics',
    authors: ['Dr. H. Salami'],
    field: 'Statistics & Probability',
    journal: 'Insurance: Mathematics and Economics',
    year: 2022,
    abstract:
      'Using extreme value theory, this paper quantifies tail risks in financial portfolios, with simulation studies illustrating practical risk management strategies.',
    link: null,
  },

  // ── Topology ──────────────────────────────────────────────────────────────
  {
    id: 9,
    title: 'Compactness and Connectedness in Generalized Topological Spaces',
    authors: ['Dr. I. Taiwo'],
    field: 'Topology',
    journal: 'Topology and Its Applications',
    year: 2020,
    abstract:
      'This paper extends classical compactness and connectedness results to the setting of generalized topological spaces, providing new characterisation theorems.',
    link: null,
  },

  // ── Differential Equations ────────────────────────────────────────────────
  {
    id: 10,
    title: 'Stability Analysis of Delay Differential Equations with Applications',
    authors: ['Prof. J. Raji'],
    field: 'Differential Equations',
    journal: 'Journal of Differential Equations',
    year: 2023,
    abstract:
      'We analyse the stability of a class of delay differential equations using Lyapunov functionals and apply the results to population dynamics models.',
    link: null,
  },
  {
    id: 11,
    title: 'Existence and Uniqueness of Solutions for Fractional Differential Equations',
    authors: ['Prof. J. Raji', 'Dr. F. Okonkwo'],
    field: 'Differential Equations',
    journal: 'Fractional Calculus and Applied Analysis',
    year: 2021,
    abstract:
      'Sufficient conditions for existence and uniqueness of solutions to a family of fractional differential equations are established via Banach contraction principles.',
    link: null,
  },
]
