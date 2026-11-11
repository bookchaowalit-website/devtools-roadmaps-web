// Fixtures for the Reference / Rail stories. Values for the three authored roadmaps are generated from
// content/roadmaps/*.mdx with the same parsing rules as lib/mdx.ts (title, metadata, stages, prerequisites,
// body). Edge-case fixtures are hand-written. This file must not import lib/mdx or anything that uses fs.

// Mirrors the Roadmap interface in lib/mdx.ts. Kept local so the story graph never touches the file system.
export type RoadmapStage = { name: string; items: string[] };
export type Roadmap = {
  title: string;
  category: string;
  progress: string;
  difficulty: string;
  estimated_time: string;
  prerequisites: string[];
  stages: RoadmapStage[];
  slug: string;
  content: string;
};

// content/roadmaps/product-manager.mdx
export const productManager: Roadmap = {
  "title": "Product Manager Roadmap",
  "category": "management",
  "progress": "85",
  "difficulty": "intermediate",
  "estimated_time": "3-6 months",
  "prerequisites": [
    "Basic business knowledge"
  ],
  "stages": [
    {
      "name": "Stage 1: Product Management Fundamentals",
      "items": [
        "Core Concepts",
        "Product lifecycle",
        "User stories & personas",
        "Product metrics",
        "Business Strategy",
        "Market analysis",
        "Competitive research",
        "Business model canvas",
        "User Research",
        "User interviews",
        "Surveys",
        "Analytics"
      ]
    },
    {
      "name": "Stage 2: Product Planning",
      "items": [
        "Product Strategy",
        "Vision & mission",
        "Roadmap planning",
        "Prioritization frameworks",
        "Requirements Gathering",
        "Feature specifications",
        "Acceptance criteria",
        "User acceptance testing",
        "Design Principles",
        "User experience",
        "Interface design",
        "Accessibility"
      ]
    },
    {
      "name": "Stage 3: Execution & Delivery",
      "items": [
        "Agile Methodology",
        "Scrum framework",
        "Sprint planning",
        "Retrospectives",
        "Stakeholder Management",
        "Communication plans",
        "Presentations",
        "Negotiation",
        "Technical Understanding",
        "Software development basics",
        "Technical constraints",
        "API concepts"
      ]
    },
    {
      "name": "Stage 4: Growth & Optimization",
      "items": [
        "Data Analysis",
        "Product analytics",
        "A/B testing",
        "KPI tracking",
        "Product Optimization",
        "Iteration cycles",
        "Feature updates",
        "Monetization",
        "Leadership",
        "Team building",
        "Mentorship",
        "Strategic thinking"
      ]
    }
  ],
  "slug": "product-manager",
  "content": "*Progress: 85% complete*\n\nA comprehensive roadmap for aspiring product managers, covering strategy, execution, and leadership skills."
};

// content/roadmaps/web-developer.mdx
export const webDeveloper: Roadmap = {
  "title": "Web Developer Roadmap",
  "category": "development",
  "progress": "75",
  "difficulty": "intermediate",
  "estimated_time": "12-18 months",
  "prerequisites": [
    "Basic HTML, CSS, JavaScript"
  ],
  "stages": [
    {
      "name": "Stage 1: Frontend Basics",
      "items": [
        "HTML & CSS",
        "Semantic HTML5",
        "CSS Grid and Flexbox",
        "Responsive design",
        "JavaScript Fundamentals",
        "ES6+ features",
        "DOM manipulation",
        "Async programming",
        "Version Control",
        "Git basics",
        "GitHub workflow",
        "Tools & Workflow",
        "Code editor setup",
        "Browser dev tools"
      ]
    },
    {
      "name": "Stage 2: Frontend Frameworks",
      "items": [
        "React",
        "Components & props",
        "State management",
        "Hooks",
        "Router",
        "State Management",
        "Redux",
        "Context API",
        "Zustand",
        "Testing",
        "Unit tests",
        "Integration tests",
        "E2E tests"
      ]
    },
    {
      "name": "Stage 3: Backend Development",
      "items": [
        "Node.js & Express",
        "REST APIs",
        "Authentication",
        "Database integration",
        "Databases",
        "SQL basics",
        "NoSQL concepts",
        "Data modeling",
        "DevOps",
        "Docker basics",
        "CI/CD pipeline",
        "Deployment"
      ]
    },
    {
      "name": "Stage 4: Advanced Topics",
      "items": [
        "Performance optimization",
        "Security best practices",
        "System design",
        "Architecture patterns"
      ]
    }
  ],
  "slug": "web-developer",
  "content": "*Progress: 75% complete*\n\nA comprehensive roadmap for becoming a full-stack web developer, covering frontend, backend, and DevOps skills."
};

// content/roadmaps/data-scientist.mdx
export const dataScientist: Roadmap = {
  "title": "Data Scientist Roadmap",
  "category": "data-science",
  "progress": "60",
  "difficulty": "advanced",
  "estimated_time": "6-12 months",
  "prerequisites": [
    "Basic Python",
    "Statistics"
  ],
  "stages": [
    {
      "name": "Stage 1: Foundation",
      "items": [
        "Mathematics & Statistics",
        "Linear algebra",
        "Probability theory",
        "Statistical methods",
        "Programming",
        "Python fundamentals",
        "NumPy & Pandas",
        "Data visualization",
        "Database & SQL",
        "Database concepts",
        "SQL queries",
        "Database optimization"
      ]
    },
    {
      "name": "Stage 2: Data Analysis",
      "items": [
        "Exploratory Data Analysis",
        "Data cleaning",
        "Feature engineering",
        "Statistical analysis",
        "Visualization",
        "Matplotlib & Seaborn",
        "Interactive plots",
        "Dashboard creation",
        "Reporting",
        "Business intelligence",
        "Data storytelling",
        "Presentation skills"
      ]
    },
    {
      "name": "Stage 3: Machine Learning",
      "items": [
        "ML Fundamentals",
        "Supervised learning",
        "Unsupervised learning",
        "Model evaluation",
        "ML Algorithms",
        "Regression models",
        "Classification algorithms",
        "Clustering",
        "Tools & Libraries",
        "Scikit-learn",
        "TensorFlow/PyTorch",
        "MLflow"
      ]
    },
    {
      "name": "Stage 4: Advanced Topics",
      "items": [
        "Deep Learning",
        "Neural networks",
        "CNNs",
        "RNNs",
        "Big Data",
        "Hadoop",
        "Spark",
        "Cloud platforms",
        "MLOps",
        "Model deployment",
        "Monitoring",
        "Version control"
      ]
    }
  ],
  "slug": "data-scientist",
  "content": "*Progress: 60% complete*\n\nA structured roadmap for transitioning into data science, from fundamentals to advanced ML and big data technologies."
};

// Empty catalogue: the index must still render its heading and a "00 authored paths" count.
export const noRoadmaps: Roadmap[] = [];

// Sheet with no metadata beyond a slug: no prerequisites, no stages, no body, zero progress.
export const blankSheet: Roadmap = {
  title: "untitled-sheet",
  category: "",
  progress: "0",
  difficulty: "",
  estimated_time: "",
  prerequisites: [],
  stages: [],
  slug: "untitled-sheet",
  content: "",
};

// Fully marked sheet (100%) to check the progress rail at full width.
export const completedSheet: Roadmap = {
  ...productManager,
  title: "Completed Sheet",
  progress: "100",
  slug: "completed-sheet",
};

// Stress case: very long titles, categories, prerequisites, item names and an unbroken URL-like token in the body.
export const longSheet: Roadmap = {
  title: "Platform Reliability Engineering for Multi-Region Distributed Systems and Incident Command Practice",
  category: "site-reliability-engineering-and-observability-operations",
  progress: "42",
  difficulty: "advanced",
  estimated_time: "18-24 months of sustained hands-on practice across several production systems",
  prerequisites: [
    "Linux administration and networking fundamentals including TCP, DNS, TLS handshakes and routing",
    "Container runtimes, orchestration basics and declarative infrastructure concepts",
    "Programming in one general-purpose language with tests, profiling and debugging experience",
    "Relational databases, replication, backups and restore drills",
  ],
  stages: [
    {
      name: "Stage 1: Observability foundations for services that never sleep, with metrics, traces and logs correlated",
      items: [
        "Structured logging with correlation identifiers propagated across asynchronous queues and retries",
        "Service-level indicators, objectives and error budgets written down before the first alert is configured",
        "Distributed tracing sampling strategies for high-volume request paths without losing rare failures",
      ],
    },
    {
      name: "Stage 2: Incident command",
      items: ["Severity model", "Paging policy", "Blameless postmortem template with action items and owners"],
    },
  ],
  slug: "long-sheet",
  content:
    "This sheet is intentionally long so the layout can be checked at narrow widths. " +
    "Reliability work is a loop of measuring, deciding and rehearsing, and the measure-decide-rehearse cycle " +
    "repeats for every service in the estate.\n\n" +
    "- Read https://example.invalid/a/very/long/path/that/has/no/spaces/and/keeps/going/for/a/while/to/test/wrapping/behaviour\n" +
    "- **Rehearse** the failover runbook every quarter and *record* the time to recover.\n\n" +
    "## Working agreement\n\n" +
    "Every alert must link to a runbook, and every runbook must name the person who last tested it.",
};
