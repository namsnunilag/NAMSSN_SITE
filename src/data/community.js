// ── Community data ───────────────────────────────────────────────────────────
// Each article can have an optional `references` array: { title, url }
// Copy any block below to add more articles.

export const articles = [
  {
    id: 1,
    title: 'The Beauty of Number Theory',
    author: 'Chidi Okonkwo',
    date: 'January 10, 2026',
    excerpt: 'An exploration of one of mathematics most fascinating branches — where simple questions lead to some of the deepest unsolved problems in all of science.',
    image: '',
    tags: ['Number Theory', 'Pure Math'],
    content: `Number theory is the study of integers and the relationships between them. It is one of the oldest branches of mathematics, yet it continues to surprise and challenge even the most brilliant minds alive today.

At its core, number theory asks deceptively simple questions: Which numbers are prime? How many prime numbers are there? Can every even number be written as the sum of two primes? These questions are easy to state but extraordinarily difficult to answer.

Prime numbers — numbers divisible only by 1 and themselves — are the building blocks of all integers. The Fundamental Theorem of Arithmetic tells us that every integer greater than 1 can be uniquely expressed as a product of primes. This makes primes the "atoms" of mathematics.

One of the most famous results in number theory is Euclid's proof that there are infinitely many primes, written over 2,000 years ago. His elegant argument remains a model of mathematical beauty: assume there are finitely many primes, multiply them all together and add 1, and you get a number not divisible by any of them — a contradiction.

Yet despite centuries of study, number theory still holds deep mysteries. The Goldbach Conjecture (every even number greater than 2 is the sum of two primes) has been verified for numbers up to 4 × 10¹⁸ but never proven. The Twin Prime Conjecture (there are infinitely many pairs of primes that differ by 2) remains open. The Riemann Hypothesis, which describes the distribution of prime numbers, is one of the Millennium Prize Problems worth $1 million.

For students of mathematical sciences, number theory is not just beautiful — it is enormously practical. Modern cryptography, the technology that secures your bank account and WhatsApp messages, is built almost entirely on number theory. RSA encryption relies on the fact that multiplying two large primes is easy, but factoring their product back into primes is computationally hard.

Number theory teaches us that mathematics is not just a tool for solving equations — it is a language for uncovering the deep structure of reality itself.`,
    references: [
      { title: 'Introduction to Number Theory — Khan Academy', url: 'https://www.khanacademy.org/computing/computer-science/cryptography/modarithmetic/a/what-is-modular-arithmetic' },
      { title: 'Number Theory — Brilliant.org', url: 'https://brilliant.org/wiki/number-theory/' },
      { title: 'Why do prime numbers make these spirals? — 3Blue1Brown', url: 'https://www.youtube.com/watch?v=EK32jo7i5LQ' },
      { title: 'Number Theory — Wolfram MathWorld', url: 'https://mathworld.wolfram.com/NumberTheory.html' },
    ],
  },
  {
    id: 2,
    title: 'The Fibonacci Sequence and the Golden Ratio',
    author: 'Amaka Nwosu',
    date: 'January 17, 2026',
    excerpt: 'How a sequence discovered in a rabbit problem over 800 years ago shows up in flowers, galaxies, art, and the stock market.',
    image: '',
    tags: ['Sequences', 'Nature of Math'],
    content: `In 1202, the Italian mathematician Leonardo of Pisa — known as Fibonacci — posed a puzzle about breeding rabbits. His solution produced a sequence that would go on to appear in places no one could have predicted: sunflowers, pinecones, hurricanes, galaxies, and the proportions of the human body.

The Fibonacci sequence is: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 ...

Each number is the sum of the two before it. Simple enough. But the magic begins when you divide consecutive terms: 2/1 = 2, 3/2 = 1.5, 5/3 = 1.667, 8/5 = 1.6, 13/8 = 1.625 ...

These ratios converge to approximately 1.618, a number known as the Golden Ratio (φ, phi). This number has the remarkable property that φ² = φ + 1, making it the only number whose square is exactly one more than itself.

The Golden Ratio appears throughout nature because it represents the most efficient way to pack objects. Sunflower seeds arrange themselves in spirals of consecutive Fibonacci numbers — typically 34 spirals one way and 55 the other. Pine cones, pineapples, and romanesco broccoli follow the same pattern.

In art and architecture, the Golden Ratio has been associated with aesthetically pleasing proportions. The Parthenon in Athens, Leonardo da Vinci's paintings, and many modern logos are said to incorporate it. Whether this is intentional design or human pattern-seeking is still debated, but the mathematics is real.

Perhaps most remarkably, the Fibonacci sequence appears in financial markets, where traders use Fibonacci retracement levels to predict price movements. Whether markets truly follow the sequence or traders create self-fulfilling patterns by believing they do is a fascinating open question.

For mathematics students, the Fibonacci sequence is a beautiful entry point into topics including recurrence relations, linear algebra (the sequence can be computed using matrix exponentiation), number theory (every third Fibonacci number is even), and analysis (the convergence of the ratio to φ).`,
    references: [
      { title: 'Fibonacci Numbers and the Golden Ratio — Coursera', url: 'https://www.coursera.org/learn/fibonacci' },
      { title: 'The Fibonacci Sequence — Numberphile', url: 'https://www.youtube.com/watch?v=kkGeOWYOFoA' },
      { title: 'Golden Ratio — Wolfram MathWorld', url: 'https://mathworld.wolfram.com/GoldenRatio.html' },
      { title: 'Fibonacci in nature — Brilliant.org', url: 'https://brilliant.org/wiki/fibonacci-series/' },
    ],
  },
  {
    id: 3,
    title: 'Calculus: The Mathematics of Change',
    author: 'Emeka Adeleke',
    date: 'January 24, 2026',
    excerpt: 'From Newton and Leibniz to modern physics and machine learning — why calculus is arguably the most powerful mathematical tool ever invented.',
    image: '',
    tags: ['Calculus', 'History of Math'],
    content: `Calculus is often described as the mathematics of change and accumulation. It is the tool that allowed Isaac Newton to describe gravity, enabled engineers to design bridges and aeroplanes, and powers the neural networks behind modern artificial intelligence.

The story of calculus is also a story of one of history's most bitter intellectual disputes. In the late 17th century, both Isaac Newton and Gottfried Wilhelm Leibniz independently developed calculus — Newton calling his version "the method of fluxions," Leibniz developing the notation we still use today (dy/dx, ∫). The resulting priority dispute poisoned relations between British and Continental mathematicians for decades.

Calculus has two main branches: differential calculus, which studies rates of change, and integral calculus, which studies accumulation. The Fundamental Theorem of Calculus reveals that these two operations are inverses of each other — differentiation and integration undo each other, just as multiplication and division do.

Differential calculus answers questions like: How fast is a car accelerating at this exact moment? What is the steepest point on this hill? At what angle should a projectile be launched to travel the furthest? These all reduce to finding derivatives — the instantaneous rate of change of a function.

Integral calculus answers questions like: What is the total distance travelled given a velocity function? What is the area under a curve? How much water fills this irregularly shaped container? These reduce to finding integrals — the accumulated sum of infinitely many infinitely small quantities.

In modern times, calculus underpins virtually every quantitative field. Physics uses it to describe motion, electricity, and quantum mechanics. Engineering uses it to model structures and systems. Economics uses it for optimization. And machine learning uses it at its very core — the backpropagation algorithm that trains neural networks is nothing more than repeated application of the chain rule of differentiation.

For students struggling with calculus, the key insight is this: a derivative is just a very precise way of asking "how much does the output change when I nudge the input slightly?" Once you hold that intuition, the formulas follow naturally.`,
    references: [
      { title: 'Calculus — Khan Academy (Full Course)', url: 'https://www.khanacademy.org/math/calculus-1' },
      { title: 'Essence of Calculus — 3Blue1Brown', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr' },
      { title: "Paul's Online Calculus Notes", url: 'https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx' },
      { title: 'MIT OpenCourseWare: Single Variable Calculus', url: 'https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/' },
    ],
  },
  {
    id: 4,
    title: 'The Riemann Hypothesis: A $1 Million Unsolved Problem',
    author: 'Tolu Fashola',
    date: 'January 31, 2026',
    excerpt: 'The most famous unsolved problem in mathematics has stood for over 160 years. Understanding it takes you to the frontier of human knowledge.',
    image: '',
    tags: ['Number Theory', 'Unsolved Problems'],
    content: `In 1859, the German mathematician Bernhard Riemann published a paper containing a hypothesis about the distribution of prime numbers. Over 160 years later, it remains unproven — and a $1 million prize from the Clay Mathematics Institute awaits whoever solves it.

The Riemann Hypothesis concerns the Riemann zeta function, which is a complex-valued function defined for complex numbers. The hypothesis states that all non-trivial zeros of the zeta function lie on the "critical line" — the line in the complex plane where the real part equals 1/2.

Why does this matter? Because the zeros of the Riemann zeta function control the distribution of prime numbers. Prime numbers appear to be randomly scattered among the integers, but there is deep structure underneath. The Riemann Hypothesis would give us the most precise possible description of how primes are distributed — it would tell us the margin of error in estimates like the Prime Number Theorem.

Mathematicians have verified that the first 10 trillion zeros all lie on the critical line. Every piece of numerical evidence supports the hypothesis. Yet no one has been able to prove it holds for all zeros.

The implications of a proof would be enormous. Many results in number theory and cryptography are currently stated as "true if the Riemann Hypothesis is true." A proof would validate all of these at once. A disproof — which almost no mathematician believes is possible — would shatter much of modern mathematics.

Approaching the Riemann Hypothesis requires deep knowledge of complex analysis, analytic number theory, and spectral theory. It is a problem that sits at the intersection of many branches of mathematics, which is part of why it has resisted solution for so long.

For undergraduate students, understanding the hypothesis at even a surface level is a worthy goal. It requires you to understand complex numbers, infinite series, and the distribution of primes — all fundamental topics that reward serious study.

The Riemann Hypothesis reminds us that mathematics is not a finished edifice. At its frontier, it is alive, mysterious, and humbling.`,
    references: [
      { title: 'The Riemann Hypothesis — Numberphile', url: 'https://www.youtube.com/watch?v=d6c6uIyieoo' },
      { title: 'Riemann Hypothesis — Clay Mathematics Institute', url: 'https://www.claymath.org/millennium/riemann-hypothesis/' },
      { title: 'Riemann Zeta Function — Wolfram MathWorld', url: 'https://mathworld.wolfram.com/RiemannZetaFunction.html' },
      { title: 'What is the Riemann Hypothesis? — Brilliant.org', url: 'https://brilliant.org/wiki/riemann-zeta-function/' },
    ],
  },
  {
    id: 5,
    title: 'Linear Algebra: The Mathematics Behind AI',
    author: 'Sola Adeyemi',
    date: 'February 7, 2026',
    excerpt: 'Vectors, matrices, and transformations — the tools that power machine learning, computer graphics, and quantum computing.',
    image: '',
    tags: ['Linear Algebra', 'Applied Math'],
    content: `If calculus is the mathematics of change, linear algebra is the mathematics of space and transformation. It is arguably the most practically important branch of mathematics for the 21st century — because it is the engine of artificial intelligence.

Linear algebra studies vectors, matrices, and linear transformations. A vector is simply an ordered list of numbers. A matrix is a rectangular array of numbers. And a linear transformation is a function that maps vectors to other vectors in a structured way.

These abstract objects turn out to describe an enormous range of real phenomena. In physics, forces and velocities are vectors. In computer graphics, rotating, scaling, and translating a 3D object is done by multiplying matrices. In economics, input-output models that describe how industries depend on each other are systems of linear equations.

But the most transformative application in recent decades is machine learning. A neural network, at its core, is a sequence of matrix multiplications interspersed with simple nonlinear functions. When you ask ChatGPT a question, your words are converted to vectors, multiplied by billions of matrix entries, and transformed into output vectors that represent the response. Every image-recognition system, recommendation algorithm, and language model depends on linear algebra.

Key concepts every mathematics student should master include:
- Vector spaces and subspaces
- Linear independence and bases
- Matrix multiplication and inverse matrices
- Determinants and what they mean geometrically
- Eigenvalues and eigenvectors — the "DNA" of a linear transformation
- Singular Value Decomposition — used in image compression and data analysis

The geometric intuition behind linear algebra is crucial. An eigenvector of a matrix is a vector that doesn't change direction when the matrix transformation is applied — it only gets scaled. This concept is central to understanding everything from quantum mechanics to the PageRank algorithm that Google uses to rank websites.

Linear algebra is a subject where visual intuition and abstract algebra reinforce each other beautifully. If you have only studied it as a sequence of row operations, you are missing most of its power.`,
    references: [
      { title: 'Essence of Linear Algebra — 3Blue1Brown', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab' },
      { title: 'Linear Algebra — Khan Academy', url: 'https://www.khanacademy.org/math/linear-algebra' },
      { title: 'MIT OpenCourseWare: Linear Algebra (Gilbert Strang)', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/' },
      { title: 'Linear Algebra — Brilliant.org', url: 'https://brilliant.org/courses/linear-algebra/' },
    ],
  },
  {
    id: 6,
    title: 'Probability: The Mathematics of Uncertainty',
    author: 'Ngozi Eze',
    date: 'February 14, 2026',
    excerpt: 'From coin flips to COVID vaccines — how probability theory lets us make rational decisions in an uncertain world.',
    image: '',
    tags: ['Probability', 'Statistics'],
    content: `We live in an uncertain world. Will it rain tomorrow? Will this medical treatment work? Should you take this investment opportunity? Probability theory is the mathematical framework for reasoning about uncertainty — and it is one of the most misunderstood subjects in all of mathematics.

Probability was born in the 17th century from gambling. The French mathematicians Blaise Pascal and Pierre de Fermat exchanged letters in 1654 about how to fairly divide stakes in an interrupted gambling game. Their correspondence laid the foundations of probability theory.

The core idea is simple: assign numbers between 0 and 1 to events, where 0 means impossible and 1 means certain, such that the probabilities of all possible outcomes sum to 1. But from this simple foundation grows a rich and powerful theory.

One of the most important results is Bayes' Theorem, which describes how to update beliefs when new evidence arrives. The formula seems straightforward: P(A|B) = P(B|A) × P(A) / P(B). But its implications are profound. It tells us that rational belief-updating requires not just looking at the evidence, but also considering how likely we thought the hypothesis was before we saw the evidence (the prior probability).

Bayes' Theorem is used in spam filters (which learn what spam looks like from examples), medical diagnosis (interpreting test results), courtroom evidence (understanding the "prosecutor's fallacy"), and even in understanding how our brains work (the brain as a Bayesian inference machine).

The Central Limit Theorem is another pillar of probability: no matter what distribution individual measurements follow, the average of a large sample will be approximately normally distributed (the famous bell curve). This is why the normal distribution appears everywhere from human heights to measurement errors.

In Nigeria and across Africa, probability literacy matters enormously. Understanding that a 99% accurate HIV test still produces many false positives in low-prevalence populations. Understanding that correlation is not causation. Understanding how to evaluate risk. These are not just academic concerns — they are tools for navigating life.

For statistics students: probability theory is not just a prerequisite to statistics. It is the conceptual foundation that makes statistical inference meaningful.`,
    references: [
      { title: 'Statistics and Probability — Khan Academy', url: 'https://www.khanacademy.org/math/statistics-probability' },
      { title: "Bayes Theorem — 3Blue1Brown", url: 'https://www.youtube.com/watch?v=HZGCoVF3YvM' },
      { title: 'Introduction to Probability — MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/' },
      { title: 'Probability — Brilliant.org', url: 'https://brilliant.org/courses/probability/' },
    ],
  },
  {
    id: 7,
    title: 'The Mathematics of Cryptography',
    author: 'Bayo Ogundimu',
    date: 'February 21, 2026',
    excerpt: 'Every time you make a bank transfer or send a WhatsApp message, number theory is protecting you. Here is how it works.',
    image: '',
    tags: ['Cryptography', 'Applied Math', 'Number Theory'],
    content: `Every time you visit a website with "https://", every time you send a WhatsApp message, every time you make a mobile bank transfer — your data is protected by mathematics. Specifically, by a branch of number theory that was considered purely academic just fifty years ago.

Modern cryptography rests on a beautiful mathematical idea: some operations are easy to do but hard to undo. Multiplication is easy; factoring is hard. Raising a number to a power is easy; finding the discrete logarithm is hard. These "one-way functions" are the foundation of public-key cryptography.

The RSA algorithm, invented in 1977 by Rivest, Shamir, and Adleman, was the first practical public-key cryptosystem. Here is the core idea:

1. Choose two large prime numbers p and q (each might be hundreds of digits long)
2. Compute n = p × q (easy)
3. Compute φ(n) = (p-1)(q-1) using Euler's totient function
4. Choose an encryption exponent e coprime to φ(n)
5. Compute the decryption exponent d such that e×d ≡ 1 (mod φ(n))

Your public key is (n, e) — shared with the world. Your private key is d — kept secret. Anyone can encrypt a message M as C = M^e mod n. Only you can decrypt it as M = C^d mod n.

The security rests on the fact that knowing n, it is computationally infeasible to find p and q — even with the most powerful computers on Earth. Factoring a 2048-bit number would take longer than the age of the universe with current algorithms.

Elliptic curve cryptography (ECC), now widely used in smartphones and modern security protocols, uses the mathematics of algebraic geometry. The "discrete logarithm problem" on an elliptic curve is even harder to crack than RSA, allowing for shorter keys and faster computations.

The threats on the horizon are real: quantum computers, using Shor's algorithm, could in principle factor large numbers efficiently, breaking RSA. This is why post-quantum cryptography is an active and urgent research area, and why mathematics students today are positioned at the forefront of one of the most important technological challenges of the coming decades.`,
    references: [
      { title: 'How RSA Encryption Works — Computerphile', url: 'https://www.youtube.com/watch?v=wXB-V_Keiu8' },
      { title: 'Cryptography — Khan Academy', url: 'https://www.khanacademy.org/computing/computer-science/cryptography' },
      { title: 'Introduction to Modern Cryptography — Brilliant.org', url: 'https://brilliant.org/courses/cryptography/' },
      { title: 'Post-Quantum Cryptography — NIST', url: 'https://www.nist.gov/programs-projects/post-quantum-cryptography' },
    ],
  },
  {
    id: 8,
    title: 'Game Theory: The Mathematics of Strategy',
    author: 'Kelechi Ibe',
    date: 'February 28, 2026',
    excerpt: 'How mathematics explains why countries build nuclear weapons they never use, why companies price-match their rivals, and how to win at auctions.',
    image: '',
    tags: ['Game Theory', 'Applied Math'],
    content: `Game theory is the mathematical study of strategic interaction — situations where the outcome for each participant depends not just on their own choices but on the choices of others. It is used to understand economics, politics, evolutionary biology, computer science, and even everyday social situations.

The field was founded by the mathematician John von Neumann and the economist Oskar Morgenstern in their 1944 book "Theory of Games and Economic Behavior." It was then extended by John Nash — whose story was told in the film A Beautiful Mind — who proved the existence of equilibrium solutions in general games.

The Prisoner's Dilemma is game theory's most famous thought experiment. Two suspects are held separately by the police. Each can either cooperate (stay silent) or defect (betray the other). If both cooperate, both get light sentences. If both defect, both get heavy sentences. If one defects and the other cooperates, the defector goes free and the cooperator gets the heaviest sentence.

The rational choice for each individual is to defect — regardless of what the other does. Yet when both defect, the outcome is worse for both than if both had cooperated. This paradox — individual rationality leading to collective irrationality — explains arms races, environmental destruction, and why competing companies often end up in price wars that hurt everyone.

A Nash Equilibrium is a state where no player can improve their outcome by unilaterally changing strategy, given what others are doing. Every finite game has at least one Nash Equilibrium (Nash's great theorem). Finding these equilibria helps predict how rational agents will behave.

Game theory has practical applications in Nigeria and beyond:
- Auction design: How should the government auction telecommunications spectrum to maximise revenue fairly?
- Bargaining: What is the mathematically fair way to split profits in a business partnership?
- Voting systems: Can a voting system be designed to make strategic voting irrational?

For mathematics students, game theory is a gateway to operations research, economics, and computer science, and it demonstrates how abstract mathematics can describe and predict human behaviour.`,
    references: [
      { title: 'Game Theory — Yale Open Courses (Ben Polak)', url: 'https://oyc.yale.edu/economics/econ-159' },
      { title: 'Game Theory — Brilliant.org', url: 'https://brilliant.org/courses/game-theory/' },
      { title: "The Prisoner's Dilemma — Numberphile", url: 'https://www.youtube.com/watch?v=t9Lo2fgxWHw' },
      { title: 'Game Theory — Stanford & UBC (Coursera)', url: 'https://www.coursera.org/learn/game-theory-1' },
    ],
  },
  {
    id: 9,
    title: 'Topology: The Mathematics of Shape Without Distance',
    author: 'Adaeze Obi',
    date: 'March 7, 2026',
    excerpt: 'In topology, a coffee mug and a donut are the same object. A strange and beautiful field that studies properties preserved under continuous deformation.',
    image: '',
    tags: ['Topology', 'Pure Math'],
    content: `Topology is one of the most abstract and counterintuitive branches of mathematics — and also one of the most beautiful. It studies properties of shapes that are preserved when the shape is stretched, twisted, or bent, but not torn or glued.

The classic joke captures the spirit of the subject: to a topologist, a coffee mug and a donut are the same object. Both have exactly one hole. You can continuously deform one into the other without tearing or gluing — which means, topologically, they are equivalent.

Topology grew out of geometry in the 19th and 20th centuries. While geometry cares about distances and angles — the circumference of a circle, the area of a triangle — topology cares only about connectedness and continuity. Two spaces are "topologically equivalent" (homeomorphic) if one can be continuously deformed into the other.

Some of the most famous results in topology are genuinely mind-bending:

The Möbius Strip has only one side and one edge. Take a strip of paper, give it a half-twist, and tape the ends together. An ant walking along the "outside" surface will find itself on the "inside" without ever crossing an edge.

The Hairy Ball Theorem states that you cannot comb a hairy ball flat without creating at least one cowlick. More precisely: there is no continuous non-vanishing tangent vector field on a sphere. This has a beautiful meteorological consequence — there is always at least one point on Earth where the wind speed is exactly zero.

The Four Colour Theorem states that any map can be coloured using at most four colours such that no two adjacent regions share a colour. This was famously the first major theorem proved with the help of a computer, in 1976.

In recent decades, topology has found profound applications in physics. Topological quantum field theories, topological insulators in condensed matter physics, and the mathematics of string theory all rely on deep topological ideas. The 2016 Nobel Prize in Physics was awarded for discoveries of topological phase transitions in materials.

For mathematics students, topology offers a different way of thinking about space and continuity — one that challenges intuitions built up from Euclidean geometry and opens new ways of seeing the mathematical world.`,
    references: [
      { title: 'Introduction to Topology — MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/18-901-introduction-to-topology-fall-2004/' },
      { title: 'Topology — Brilliant.org', url: 'https://brilliant.org/wiki/topology/' },
      { title: 'The Möbius Strip — Numberphile', url: 'https://www.youtube.com/watch?v=4mdEsouIXGM' },
      { title: 'Topology & Geometry — Dr Tadashi Tokieda (YouTube)', url: 'https://www.youtube.com/playlist?list=PLTBqohhFNBE_09L0i-lf3fYXF5woAbrzJ' },
    ],
  },
]
