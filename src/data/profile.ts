export interface ExperienceEntry {
  role: string;
  org: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface TeachingEntry {
  role: string;
  org: string;
  period: string;
  description: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export const profile = {
  name: 'Hamdi Jarboui',
  title: 'Senior Python Developer & DevOps Engineer · AI Agents',
  location: 'Sfax, Tunisia',
  email: 'jarbouihamdi9@gmail.com',
  github: 'https://github.com/hamdiJarboui',
  linkedin: 'https://linkedin.com/in/hamdi-jarboui',
  summary:
    'Python software engineer with 4+ years delivering production systems end-to-end — architecture through deployment — across full-stack development, DevOps, and embedded automotive systems. Currently leads the design of AI agent-based automation at KPIT, embedding LLM-driven logic into live engineering workflows and owning CI/CD from commit to production.',
  skills: [
    {
      category: 'Python Development',
      items: [
        'Full-stack Python (web, desktop/PyQt6, embedded, data, AI)',
        'Back-end services & REST APIs (Django, Starlette)',
        'asyncio, Pydantic v2, Click CLIs',
        'uv monorepos, wheels & PyInstaller builds',
        'Internal tooling & automation',
      ],
    },
    {
      category: 'TypeScript & Node.js',
      items: [
        'Strict TypeScript (ESM, noUncheckedIndexedAccess)',
        'Node.js 18+ and Bun (bun:sqlite)',
        'Zod schema validation',
        'React front ends',
        'OpenCode plugin SDK',
      ],
    },
    {
      category: 'Generative AI',
      items: [
        'LLM integration: Anthropic Claude, OpenAI & compatible APIs',
        'Multi-provider failover with circuit breakers',
        'RAG: LangChain, OpenAI embeddings, pgvector',
        'Prompt engineering & context design',
        'Context budgeting (tiktoken) & semantic memory',
        'Output evaluation',
      ],
    },
    {
      category: 'AI Agents',
      items: [
        'Agent architecture & orchestration',
        'Multi-agent squads that collaborate in a shared room',
        'Plan → Execute → Verify agent loops',
        'Model Context Protocol: servers & clients (stdio, HTTP/SSE)',
        'Skills & agent registries for Claude Code, OpenCode, Copilot, Beacon',
        'Tool / function calling',
        'Agent-driven engineering workflows in production',
      ],
    },
    {
      category: 'AI Safety & Guardrails',
      items: [
        'Human-in-the-loop PR approval',
        'Risk-tiered tool exposure (LOW/MEDIUM/HIGH)',
        'Fail-closed merge gates',
        'PreToolUse hooks & per-tool permissions',
        'Loop detection & bounded-state invariants',
        'Secret redaction in logs & notifications',
      ],
    },
    {
      category: 'Machine Learning',
      items: ['Machine learning & deep learning', 'Computer vision', 'Model training & evaluation'],
    },
    {
      category: 'DevOps, CI/CD & Cloud',
      items: [
        'Jenkins, Zuul, GitLab CI/CD, GitHub Actions',
        'Tag-gated releases to private npm & package registries',
        'Nexus, Artifactory',
        'Docker, Docker Compose, Caddy (rate limiting)',
        'AWS, Linux, Git / GitHub / GitLab',
        'Pipeline design: commit to production',
      ],
    },
    {
      category: 'Test Automation',
      items: [
        'pytest, Robot Framework',
        'Bun test & Node.js test runner',
        'Contract tests across vendor adapters',
        'Per-package coverage gates',
        'E2E against real services (Postgres, MSSQL, MCP servers)',
        'TestGuide, ECU validation',
        'CI and ECU test pipeline management',
      ],
    },
    {
      category: 'Automotive & Embedded',
      items: [
        'CAN / CAN-FD, DBC',
        'UDS over DoIP, ODX / PDX',
        'AUTOSAR ARXML, A2L calibration',
        'DLT traces, MDF4 measurements',
        'Lauterbach TRACE32',
        'MISRA C:2012, ISO 26262, ASPICE 4.0',
      ],
    },
    {
      category: 'Integrations',
      items: [
        'GitLab & GitHub APIs',
        'Jira, Confluence',
        'Microsoft Graph / Microsoft 365',
        'Slack, Teams & webhook notifications',
      ],
    },
    {
      category: 'Observability & Dashboards',
      items: [
        'Grafana, Kibana, Prometheus, Elastic',
        'OpenTelemetry metrics',
        'Health & readiness endpoints',
        'Plotly Dash & custom dashboards',
        'Data analysis & visualization',
      ],
    },
    {
      category: 'Databases',
      items: ['PostgreSQL + pgvector', 'SQLite (WAL, leased task stores)', 'MySQL', 'MSSQL', 'MongoDB', 'Oracle'],
    },
  ] satisfies SkillGroup[],
  experience: [
    {
      role: 'Senior Python Developer & DevOps Engineer — AI Agents',
      org: 'KPIT Technologies',
      location: 'Sfax, Tunisia',
      start: '2024-07',
      end: 'present',
      bullets: [
        'Lead the design and delivery of AI agent-based automation systems in Python, working with the team to automate repetitive engineering work.',
        'Architect full-stack Python applications end-to-end — back-end services and APIs through to internal tooling interfaces.',
        'Own CI/CD pipelines (Jenkins, Zuul, GitLab CI/CD) from commit to production, with artifact management via Nexus and Artifactory and test orchestration through TestGuide and Jenkins.',
        'Serve as DevOps engineer and Python developer on major automotive OEM programs — managing Zuul CI pipelines (including Zuul on AWS), writing Python automation scripts, driving test automation, and containerizing services with Docker.',
        'Partner with cross-functional teams on containerization, cloud deployment (AWS), and monitoring, improving release reliability beyond individual project scope.',
        'Build Python dashboards and data-visualization tooling adopted by engineering leads across automotive client programs for day-to-day decisions.',
        'Work directly with customers to gather requirements, present technical solutions, and align deliverables.',
        'Delivered a generative AI workshop to the entire development department (~100 engineers), plus recurring hands-on sessions training developers and QA testers in cohorts of ~20.',
      ],
    },
    {
      role: 'Python Developer & DevOps Engineer',
      org: 'Primatec Engineering',
      location: 'Sfax, Tunisia',
      start: '2022-07',
      end: '2024-06',
      bullets: [
        'Became the reference engineer for Python ECU flashing and configuration tooling, enabling faster embedded systems validation.',
        'Led automation of build, test, and deployment pipelines with Jenkins, removing manual steps from the release process.',
        'Also worked as DevOps engineer and Python developer on automotive OEM client programs, managing Zuul CI (including Zuul on AWS), Python automation scripts, test automation, and Docker-based containerization.',
        'Built full-stack Python tools and dashboards adopted across engineering teams for data analysis and reporting.',
        'Prototyped automation concepts that became the foundation for AI agent-driven workflows now in production at KPIT.',
        'Worked directly with customers to gather requirements, present technical solutions, and align deliverables.',
        'Ran hands-on workshops training developers and testers in ~20-person cohorts on Python testing (pytest, Robot Framework).',
      ],
    },
  ] satisfies ExperienceEntry[],
  teaching: [
    {
      role: 'Lead Instructor — Python, Generative AI & Computer Vision',
      org: '2S Training and Consulting',
      period: '2021 – Present',
      description:
        'Own curriculum design and delivery end-to-end across Python, generative AI, prompt engineering, agentic AI, data analysis, and computer vision. Run 20-person cohorts in 10–30 hour programmes. Teaching these topics since 2021, ahead of mainstream adoption.',
    },
    {
      role: 'Python & Applied AI Instructor',
      org: 'ENETCOM Engineering School, Sfax',
      period: '2024 – Present',
      description:
        'Selected to teach Python, generative AI, prompt engineering, and agentic AI to engineering students at a national engineering school. Coached student teams to 3 national-level AI competition wins.',
    },
    {
      role: 'Python & Generative AI Instructor',
      org: 'ISB — International School of Business',
      period: '2024 – Present',
      description: 'Deliver Python, generative AI, and prompt engineering to a non-engineering business audience.',
    },
    {
      role: 'Python Instructor',
      org: 'Smart Skills Academy',
      period: '2022 – 2023',
      description: 'Built a full PCEP/PCAP-aligned curriculum from scratch and supervised student projects in Python, data analysis, and introductory AI.',
    },
    {
      role: 'Python Programming Instructor — Developers & Testers',
      org: 'Primatec Engineering',
      period: '2022 – 2024',
      description: 'Taught Python programming from basics to advanced to fellow developers, and Python-based test automation to testers — internal upskilling delivered alongside full-time engineering work.',
    },
    {
      role: 'Generative AI Instructor',
      org: 'KPIT Technologies',
      period: '2024 – Present',
      description: 'Deliver generative AI training across the engineering department, including a flagship department-wide workshop and recurring hands-on sessions — internal upskilling delivered alongside full-time engineering work.',
    },
  ] satisfies TeachingEntry[],
  certifications: [
    'Python Institute — PCEP (Certified Entry-Level Python Programmer)',
    'Python Institute — PCAP (Certified Associate in Python Programming)',
    'IBM — Applied Data Science with Python (Level 2)',
    'IBM — Deep Learning (Level 2): TensorFlow, GPU-accelerated training',
    'University of Washington (Coursera) — Machine Learning Specialization',
    'Microsoft MTA — Programming Using Python & Java',
    'Certiprof — Scrum Foundation (SFPC)',
  ],
  achievements: [
    'Trained 100+ engineers in a single department-wide generative AI workshop; ongoing 20-person cohorts across 10–30 hour programmes since 2022',
    'Students placed 3 times at national AI competitions',
    '100% PCEP certification pass rate — every engineer trained through the in-company Python programme achieved Python Institute PCEP certification',
  ],
  languages: [
    { name: 'Arabic', level: 'Native / bilingual proficiency' },
    { name: 'French', level: 'Full professional proficiency' },
    { name: 'English', level: 'Professional working proficiency' },
  ],
  education: [
    {
      degree: 'Engineering Degree, Industrial Computer Engineering',
      org: 'National School of Electronics and Telecommunications (ENETCOM), Sfax',
      period: '2019 – 2024',
    },
    {
      degree: 'Preparatory Cycle, Physics & Chemistry',
      org: 'Faculty of Sciences, Sfax',
      period: '2017 – 2019',
    },
  ],
};
