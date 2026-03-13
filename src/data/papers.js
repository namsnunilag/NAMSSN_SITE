// ── Research Papers by Lecturers ─────────────────────────────────────────────
// Real published papers by UNILAG Mathematics Department lecturers.
// Sources: Google Scholar, ResearchGate, Springer, Elsevier, AJOL, arXiv

export const mathFields = [
  'All',
  'Analysis',
  'Algebra',
  'Topology',
  'Differential Equations',
  'Applied Mathematics',
]

export const papers = [

  // ── Prof. Akewe H ── Analysis / Fixed Point Theory ─────────────────────────
  {
    id: 1,
    title: 'Strong Convergence and Stability of Kirk-Multistep-Type Iterative Schemes for Contractive-Type Operators',
    authors: ['Prof. Akewe H', 'Godwin Amechi Okeke', 'Adekunle F. Olayiwola'],
    field: 'Analysis',
    journal: 'Fixed Point Theory and Applications',
    year: 2014,
    abstract:
      'This paper investigates strong convergence and stability of Kirk-multistep-type iterative schemes applied to contractive-type operators, extending classical fixed point iteration results.',
    link: 'https://link.springer.com/article/10.1186/1687-1812-2014-45',
  },
  {
    id: 2,
    title: 'On the Equivalence of Stochastic Fixed Point Iterations for Generalized φ-Contractive-Like Operators',
    authors: ['Prof. Akewe H', 'Dr. EKE K', 'Victoria Olisama'],
    field: 'Analysis',
    journal: 'International Journal of Analysis',
    year: 2018,
    abstract:
      'Equivalence results for stochastic fixed point iterations are established for a class of generalized φ-contractive-like operators, with applications to random operator equations.',
    link: 'https://onlinelibrary.wiley.com/doi/10.1155/2018/9576137',
  },
  {
    id: 3,
    title: 'Common Fixed Point of Jungck-Kirk-Type Iterations for Non-Self Operators in Normed Linear Spaces',
    authors: ['Prof. Akewe H', 'Prof. MOGBADEMU A.A'],
    field: 'Analysis',
    journal: 'Fasciculi Mathematici',
    year: 2016,
    abstract:
      'Common fixed point theorems are proved for non-self operators via Jungck-Kirk-type iterative schemes in the setting of normed linear spaces.',
    link: 'https://www.semanticscholar.org/paper/Hudson-Akewe-and-Adesanmi-Mogbademu-COMMON-FIXED-OF-Akewe-Mogbademu/ecbdf71dd85529f5cb703cf22fad5c196373d0a9',
  },

  // ── Prof. Olaleru J.O ── Topology / Fixed Point Theory ─────────────────────
  {
    id: 4,
    title: 'Some Fixed Point Results of Ciric-Type Contraction Mappings on Ordered G-Partial Metric Spaces',
    authors: ['Prof. Olaleru J.O', 'Dr. EKE K', 'Dr. Olaoluwa Hallowed Oluwadara'],
    field: 'Topology',
    journal: 'Applied Mathematics',
    year: 2014,
    abstract:
      'Fixed point theorems for Ciric-type contractions are established on ordered G-partial metric spaces, generalising earlier results in partial metric and G-metric space settings.',
    link: 'https://www.scirp.org/pdf/am_2014040817092145.pdf',
  },
  {
    id: 5,
    title: 'Some Fixed Points of Multivalued Maps in Multiplicative Metric Spaces',
    authors: ['Aminat O. Ige', 'Dr. Olaoluwa Hallowed Oluwadara', 'Prof. Olaleru J.O'],
    field: 'Topology',
    journal: 'Heliyon',
    year: 2022,
    abstract:
      'Fixed point results for multivalued contractive mappings are derived in the framework of multiplicative metric spaces, with illustrative examples confirming the theoretical findings.',
    link: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9791866/',
  },

  // ── Prof. MOGBADEMU A.A ── Analysis ─────────────────────────────────────────
  {
    id: 6,
    title: 'A Note on Generalization of Classical Jensen\'s Inequality',
    authors: ['P.O. Olanipekun', 'Prof. MOGBADEMU A.A'],
    field: 'Analysis',
    journal: 'Journal of Mathematics and Computer Science',
    year: 2014,
    abstract:
      'A generalisation of the classical Jensen inequality is presented, extending its applicability to a broader class of convex functions with potential use in information theory and inequalities.',
    link: 'https://www.isr-publications.com/jmcs/articles-541-a-note-on-generalization-of-classical-jensens-inequality',
  },

  // ── Dr. AKINFENWA O.A ── Differential Equations / Numerical Analysis ────────
  {
    id: 7,
    title: 'Continuous Block Backward Differentiation Formula for Solving Stiff Ordinary Differential Equations',
    authors: ['Dr. AKINFENWA O.A', 'S.N. Jator', 'N.M. Yao'],
    field: 'Differential Equations',
    journal: 'Computers & Mathematics with Applications',
    year: 2013,
    abstract:
      'A continuous block backward differentiation formula is developed and analysed for the numerical solution of stiff systems of ordinary differential equations, demonstrating A-stability and improved efficiency.',
    link: 'https://www.sciencedirect.com/science/article/pii/S0898122113000564',
  },
  {
    id: 8,
    title: 'Simpson\'s 3/8-Type Block Method for Stiff Systems of Ordinary Differential Equations',
    authors: ['Dr. AKINFENWA O.A', 'R.I. Abdulganiy', 'Prof. OKUNUGA S.A'],
    field: 'Differential Equations',
    journal: 'Journal of the Nigerian Mathematical Society',
    year: 2017,
    abstract:
      'A Simpson\'s 3/8-type block method is formulated for the direct numerical integration of stiff systems of ODEs, with stability analysis and performance comparisons against existing methods.',
    link: 'https://ojs.ictp.it/jnms/index.php/jnms/article/view/242',
  },
  {
    id: 9,
    title: 'Seventh Order Hybrid Block Method for Solution of First Order Stiff Systems of Initial Value Problems',
    authors: ['Dr. AKINFENWA O.A', 'R.I. Abdulganiy', 'Dr. AKINNUKAWE B', 'Prof. OKUNUGA S.A'],
    field: 'Differential Equations',
    journal: 'Journal of the Egyptian Mathematical Society',
    year: 2020,
    abstract:
      'A seventh-order hybrid block method is proposed for solving first-order stiff initial value problems, combining multiple integration points to achieve accuracy and A-stability.',
    link: 'https://joems.springeropen.com/articles/10.1186/s42787-020-00095-3',
  },

  // ── Dr. EHIGIE J.O ── Differential Equations ────────────────────────────────
  {
    id: 10,
    title: 'Exponentially Fitted Two-Derivative DIRK Methods for Oscillatory Differential Equations',
    authors: ['Dr. EHIGIE J.O', 'Vu Thai Luan', 'Prof. OKUNUGA S.A', 'Xiong You'],
    field: 'Differential Equations',
    journal: 'Applied Mathematics and Computation',
    year: 2021,
    abstract:
      'Exponentially fitted two-derivative diagonally implicit Runge-Kutta (DIRK) methods are constructed for numerically integrating oscillatory differential equations, with theoretical order conditions and numerical experiments.',
    link: 'https://www.sciencedirect.com/science/article/abs/pii/S0096300321008523',
  },

  // ── Dr. ABOLARINWA A ── Analysis / Geometric PDEs ───────────────────────────
  {
    id: 11,
    title: 'Monotonicity Formulas for the First Eigenvalue of the Weighted p-Laplacian Under the Ricci-Harmonic Flow',
    authors: ['Dr. ABOLARINWA A', 'O. Adebimpe', 'E.A. Bakare'],
    field: 'Analysis',
    journal: 'Journal of Inequalities and Applications',
    year: 2019,
    abstract:
      'Monotonicity formulas are derived for the first eigenvalue of the weighted p-Laplacian along the Ricci-harmonic flow, with applications to geometric and analytic properties of Riemannian manifolds.',
    link: 'https://link.springer.com/article/10.1186/s13660-019-1961-6',
  },
  {
    id: 12,
    title: 'On the Spectrum of the Weighted p-Laplacian Under the Ricci-Harmonic Flow',
    authors: ['Dr. ABOLARINWA A'],
    field: 'Analysis',
    journal: 'Journal of Inequalities and Applications',
    year: 2020,
    abstract:
      'The spectral behaviour of the weighted p-Laplacian is studied along the Ricci-harmonic flow on complete Riemannian manifolds, establishing estimates on eigenvalue evolution.',
    link: 'https://link.springer.com/article/10.1186/s13660-020-02322-y',
  },
  {
    id: 13,
    title: 'Sobolev-Type Inequalities and Heat Kernel Bounds Along the Geometric Flow',
    authors: ['Dr. ABOLARINWA A'],
    field: 'Analysis',
    journal: 'Afrika Matematika',
    year: 2016,
    abstract:
      'Sobolev-type inequalities are established along a general geometric flow and used to derive heat kernel upper bounds, contributing to the analysis of parabolic equations on manifolds.',
    link: 'https://link.springer.com/article/10.1007/s13370-015-0335-6',
  },

  // ── Dr. ADETUNJI P ── Applied Mathematics / Fluid Mechanics ─────────────────
  {
    id: 14,
    title: 'Mixed Convection Flow and Heat Transfer of Chemically Reactive Drilling Liquids with Clay Nanoparticles Subject to Radiation Absorption',
    authors: ['Dr. Hamzat A.I', 'Dr. ADETUNJI P'],
    field: 'Applied Mathematics',
    journal: 'Ain Shams Engineering Journal',
    year: 2021,
    abstract:
      'A mathematical model for mixed convection flow and heat transfer of chemically reactive drilling mud with clay nanoparticles is analysed under radiation absorption effects, with numerical solutions presented.',
    link: 'https://www.sciencedirect.com/science/article/pii/S2090447921002197',
  },
  {
    id: 15,
    title: 'Transient MHD Boundary-Layer Slip-Flow of Heat and Mass Transfer Over a Stretching Surface Embedded in Porous Medium with Convective Boundary Conditions',
    authors: ['Dr. ADETUNJI P', 'Joshua Aanuoluwapo Adigun'],
    field: 'Applied Mathematics',
    journal: 'Applied and Computational Mathematics',
    year: 2014,
    abstract:
      'Transient magnetohydrodynamic boundary-layer flow with heat and mass transfer over a stretching porous surface is investigated with slip and convective boundary conditions, solved via numerical methods.',
    link: 'https://www.sciencepublishinggroup.com/article/10.11648/j.acm.20140305.19',
  },

  // ── Dr. AKINNUKAWE B ── Differential Equations / Numerical Analysis ──────────
  {
    id: 16,
    title: 'L-Stable Block Hybrid Numerical Algorithm for First-Order Ordinary Differential Equations',
    authors: ['Dr. AKINNUKAWE B', 'K.O. Muka'],
    field: 'Differential Equations',
    journal: 'Journal of the Nigerian Society of Physical Sciences',
    year: 2020,
    abstract:
      'An L-stable block hybrid numerical algorithm is derived and implemented for the integration of first-order ODEs, demonstrating superior stability properties for stiff problems.',
    link: 'https://journal.nsps.org.ng/index.php/jnsps/article/view/108',
  },
  {
    id: 17,
    title: 'L-Stable Block Backward Differentiation Formula for Parabolic Partial Differential Equations',
    authors: ['Dr. AKINNUKAWE B', 'Dr. AKINFENWA O.A', 'Prof. OKUNUGA S.A'],
    field: 'Differential Equations',
    journal: 'Ain Shams Engineering Journal',
    year: 2016,
    abstract:
      'A new L-stable block backward differentiation formula is developed for the numerical solution of parabolic PDEs, with analysis confirming consistency, zero-stability, and convergence.',
    link: 'https://www.sciencedirect.com/science/article/pii/S2090447916000228',
  },

  // ── Dr. AYOADE A ── Applied Mathematics / Mathematical Modelling ─────────────
  {
    id: 18,
    title: 'Sensitivity Analysis of the Parameters of a Cholera Model',
    authors: ['O.J. Peter', 'Dr. AYOADE A', 'A.I. Abioye', 'A.A. Victor', 'C.E. Akpan'],
    field: 'Applied Mathematics',
    journal: 'Journal of Applied Sciences and Environmental Management',
    year: 2018,
    abstract:
      'A sensitivity analysis is performed on the parameters of a compartmental cholera transmission model to identify which parameters most significantly drive the epidemic dynamics.',
    link: 'https://www.ajol.info/index.php/jasem/article/view/170464',
  },
  {
    id: 19,
    title: 'Modeling and Analysis of the Impact of Vocational Education on the Unemployment Rate in Nigeria',
    authors: ['Dr. AYOADE A', 'Opeyemi Odetunde', 'Bidemi Falodun'],
    field: 'Applied Mathematics',
    journal: 'Applications and Applied Mathematics: An International Journal',
    year: 2020,
    abstract:
      'A mathematical model is formulated to assess the impact of vocational education on reducing the unemployment rate in Nigeria, with equilibrium analysis and numerical simulations.',
    link: 'https://digitalcommons.pvamu.edu/aam/vol15/iss1/32/',
  },

  // ── Dr. EKE K ── Analysis / Stochastic Fixed Point Theory ───────────────────
  {
    id: 20,
    title: 'On Random Fixed Point Theorems with Applications to Integral Equations',
    authors: ['Dr. EKE K', 'Prof. Akewe H', 'Sheila Amina Bishop'],
    field: 'Analysis',
    journal: 'Heliyon',
    year: 2019,
    abstract:
      'Random fixed point theorems are established for stochastic operators in separable Banach spaces, and the results are applied to prove the existence of random solutions to integral equations.',
    link: 'https://www.sciencedirect.com/science/article/pii/S2405844018367653',
  },

  // ── Dr. Olaoluwa Hallowed Oluwadara ── Topology / Fixed Point Theory ─────────
  {
    id: 21,
    title: 'Fixed Points of Generalized Contractions on O-Metric Spaces',
    authors: ['Dr. Olaoluwa Hallowed Oluwadara', 'Aminat O. Ige', 'Prof. Olaleru J.O'],
    field: 'Topology',
    journal: 'arXiv Preprint',
    year: 2024,
    abstract:
      'New fixed point results are proved for generalised contractions defined on O-metric spaces, extending the framework of ordered metric spaces and unifying several existing results in the literature.',
    link: 'https://arxiv.org/abs/2403.09655',
  },

  // ── Dr. George O.O ── Algebra (Loop Theory, Quasigroups, BCI Algebras) ───────
  {
    id: 22,
    title: 'On a Class of Power Associative LCC-Loops',
    authors: ['Dr. George O.O', 'Prof. Olaleru J.O', 'J.O. Adéniran', 'T.G. Jaiyéolá'],
    field: 'Algebra',
    journal: 'Extracta Mathematicae',
    year: 2022,
    abstract:
      'A class of power associative left conjugacy closed (LCC) loops is studied, with characterisation theorems and structural results that extend known results in loop theory.',
    link: 'https://dialnet.unirioja.es/servlet/articulo?codigo=8682593',
  },
  {
    id: 23,
    title: 'Nuclear Identification of Some New Loop Identities of Length Five',
    authors: ['Dr. George O.O', 'T.G. Jaiyéolá'],
    field: 'Algebra',
    journal: 'Bulletin of the Academy of Sciences of Moldova, Mathematics',
    year: 2022,
    abstract:
      'New loop identities of length five are identified and classified using nuclear methods, contributing to the systematic study of loop identities and their algebraic significance.',
    link: 'https://www.researchgate.net/publication/367979377_Nuclear_Identification_of_Some_New_Loop_Identities_of_Length_Five',
  },
  {
    id: 24,
    title: 'On the Universality and Isotopy-Isomorphy of (r, s, t)-Inverse Quasigroups and Loops with Applications to Cryptography',
    authors: ['R. Ilemobade', 'Dr. George O.O', 'T.G. Jaiyéolá'],
    field: 'Algebra',
    journal: 'Quasigroups and Related Systems',
    year: 2023,
    abstract:
      'The universality and isotopy-isomorphy properties of (r, s, t)-inverse quasigroups and loops are investigated, with cryptographic applications demonstrated through encoding schemes.',
    link: 'http://www.quasigroups.eu/',
  },
  {
    id: 25,
    title: 'Nuclear Identification of Extra Loop Identities of Second Bol-Moufang Type with Applications to Secure Information Encoding',
    authors: ['Dr. George O.O'],
    field: 'Algebra',
    journal: 'Unilag Journal of Mathematics and Applications (LAGJMA)',
    year: 2026,
    abstract:
      'Extra loop identities of the second Bol-Moufang type are identified via nuclear analysis, and their application to secure information encoding is demonstrated.',
    link: 'https://lagjma.unilag.edu.ng/article/view/2868',
  },
  {
    id: 26,
    title: 'Bivariate BCI Algebras',
    authors: ['E. Ilojide', 'Dr. George O.O'],
    field: 'Algebra',
    journal: 'International Journal of Mathematical Sciences and Optimization: Theory and Applications',
    year: 2025,
    abstract:
      'The concept of bivariate BCI algebras is introduced and studied, establishing foundational properties and structural theorems that extend the classical theory of BCI algebras.',
    link: 'https://ijmso.unilag.edu.ng/article/view/2455',
  },
]
