export const siteConfig = {
  name: 'Alex Morgan',
  role: 'Software Engineering Student | Backend Developer',
  email: 'alex.morgan.dev@email.com',
  tagline:
    'I design and build reliable backend systems, practical APIs, and data-driven software with a focus on performance, maintainability, and real-world impact.',
  bio: [
    'I am a Software Engineering student focused on backend development, API design, and data processing workflows. My work is centered on building scalable software systems that stay clean under real operational constraints.',
    'I enjoy translating product needs into robust technical architecture, with a strong preference for Python ecosystems, structured testing, and clear documentation. My long-term goal is to contribute to high-impact backend products where quality and reliability matter.'
  ],
  location: 'United States (Placeholder)',
  cvLink: '/cv-placeholder.pdf',
  socialLinks: {
    github: 'https://github.com/your-username',
    linkedin: 'https://linkedin.com/in/your-profile'
  }
};

export const skills = [
  {
    category: 'Programming Languages',
    items: ['Python', 'TypeScript', 'SQL', 'Bash']
  },
  {
    category: 'Backend',
    items: ['FastAPI', 'Django', 'Flask', 'REST API Design', 'Authentication & Authorization']
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'SQLite', 'Query Optimization']
  },
  {
    category: 'Tools & Platforms',
    items: ['Git', 'GitHub', 'Docker', 'Linux', 'CI/CD Basics']
  },
  {
    category: 'Other Technical Skills',
    items: ['Pandas', 'Data Processing Pipelines', 'Automation Scripts', 'System Design Fundamentals']
  }
];

export const projects = [
  {
    title: 'API Monitoring Platform',
    description:
      'A backend service for tracking endpoint health, response latency, and uptime trends with alert-ready metrics and historical logs.',
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/your-username/api-monitoring-platform',
    demo: 'https://demo.example.com/api-monitoring'
  },
  {
    title: 'Student Data Processing Engine',
    description:
      'Automated data ingestion and cleaning pipeline that processes large student records and generates summary reports for analytics dashboards.',
    tech: ['Python', 'Pandas', 'SQL', 'CLI Automation'],
    github: 'https://github.com/your-username/student-data-engine',
    demo: ''
  },
  {
    title: 'Task Management Backend',
    description:
      'Production-style backend for collaborative task workflows with JWT auth, role-based permissions, and modular service architecture.',
    tech: ['Django', 'Django REST Framework', 'PostgreSQL'],
    github: 'https://github.com/your-username/task-management-backend',
    demo: 'https://demo.example.com/task-backend'
  },
  {
    title: 'Inventory Sync Service',
    description:
      'Event-based synchronization service that keeps distributed inventory records consistent across multiple systems.',
    tech: ['Python', 'Flask', 'Redis', 'Docker'],
    github: 'https://github.com/your-username/inventory-sync-service',
    demo: ''
  },
  {
    title: 'Recruiter Outreach Tracker',
    description:
      'A lightweight full-stack project that helps track applications, recruiter conversations, and interview progress in one place.',
    tech: ['TypeScript', 'Next.js', 'PostgreSQL'],
    github: 'https://github.com/your-username/recruiter-outreach-tracker',
    demo: 'https://demo.example.com/outreach-tracker'
  },
  {
    title: 'Log Analysis Toolkit',
    description:
      'Toolkit for parsing backend logs and surfacing failure patterns, error frequency, and anomaly indicators for debugging workflows.',
    tech: ['Python', 'Pandas', 'Regex', 'Data Visualization'],
    github: 'https://github.com/your-username/log-analysis-toolkit',
    demo: ''
  }
];

export const timeline = [
  {
    title: 'B.Sc. in Software Engineering',
    organization: 'Your University Name (Placeholder)',
    period: '2022 - Present',
    details:
      'Focused on software architecture, algorithms, databases, distributed systems, and backend engineering practices.'
  },
  {
    title: 'Backend Development Intern (Optional Placeholder)',
    organization: 'Tech Company / Startup',
    period: 'Summer 2025',
    details:
      'Contributed to API development, endpoint testing, and data ingestion workflows while collaborating with senior engineers.'
  },
  {
    title: 'Freelance Software Projects',
    organization: 'Independent',
    period: '2024 - Present',
    details:
      'Delivered backend-focused systems for small clients, including automation scripts and internal API tools.'
  }
];
