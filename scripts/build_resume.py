"""Build the English and French resume PDFs into public/.

ATS-friendly by design: a single column, standard section headings, real
selectable text in a common sans-serif font, no tables or images for layout,
and clickable links. Run with:  python scripts/build_resume.py
Requires: reportlab
"""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public"
FONT_DIR = Path("/usr/share/fonts/truetype/liberation")

pdfmetrics.registerFont(TTFont("Sans", str(FONT_DIR / "LiberationSans-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Sans-Bold", str(FONT_DIR / "LiberationSans-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Sans-Italic", str(FONT_DIR / "LiberationSans-Italic.ttf")))
pdfmetrics.registerFontFamily("Sans", normal="Sans", bold="Sans-Bold", italic="Sans-Italic")

ACCENT = HexColor("#0B5C8A")
INK = HexColor("#1A1A1A")
MUTED = HexColor("#4A4A4A")
RULE = HexColor("#B8C7D6")

PORTFOLIO = "https://hamdijarboui.github.io/portfolio/"
LINKEDIN = "https://www.linkedin.com/in/hamdi-jarboui"
GITHUB = "https://github.com/hamdiJarboui"
EMAIL = "jarbouihamdi9@gmail.com"
PHONE = "+216 98 135 227"

STYLES = {
    "name": ParagraphStyle("name", fontName="Sans-Bold", fontSize=21, leading=24, textColor=INK),
    "headline": ParagraphStyle("headline", fontName="Sans-Bold", fontSize=10.5, leading=14, textColor=ACCENT, spaceBefore=2),
    "contact": ParagraphStyle("contact", fontName="Sans", fontSize=8.8, leading=12, textColor=MUTED),
    "section": ParagraphStyle("section", fontName="Sans-Bold", fontSize=10.5, leading=13, textColor=ACCENT, spaceBefore=8, spaceAfter=1),
    "body": ParagraphStyle("body", fontName="Sans", fontSize=9, leading=12.2, textColor=INK, alignment=TA_LEFT),
    "role": ParagraphStyle("role", fontName="Sans-Bold", fontSize=9.6, leading=12.5, textColor=INK, spaceBefore=5),
    "meta": ParagraphStyle("meta", fontName="Sans-Italic", fontSize=8.8, leading=11.5, textColor=MUTED, spaceAfter=1),
    "bullet": ParagraphStyle("bullet", fontName="Sans", fontSize=8.9, leading=11.8, textColor=INK,
                             leftIndent=10, bulletIndent=0, bulletFontName="Sans", bulletFontSize=8, spaceBefore=1),
    "skill": ParagraphStyle("skill", fontName="Sans", fontSize=8.9, leading=11.8, textColor=INK, spaceAfter=1.5),
}


def link(url: str, label: str) -> str:
    return f'<a href="{url}" color="#0B5C8A">{label}</a>'


def bullets(items):
    # One paragraph per bullet (not a ListFlowable) so a heading kept with
    # "next" always carries its first bullet onto the same page.
    return [Paragraph(t, STYLES["bullet"], bulletText="•") for t in items]


def section(title: str):
    heading = Paragraph(title.upper(), STYLES["section"])
    rule = HRFlowable(width="100%", thickness=0.6, color=RULE, spaceBefore=0, spaceAfter=3)
    # Never leave a heading stranded at the bottom of a page.
    heading.keepWithNext = True
    rule.keepWithNext = True
    return [heading, rule]


def entry(title: str, meta: str, items):
    head = Paragraph(title, STYLES["role"])
    sub = Paragraph(meta, STYLES["meta"])
    head.keepWithNext = True
    sub.keepWithNext = True
    return [head, sub, *bullets(items)]


# ---------------------------------------------------------------------------
# Content. Keep EN and FR in step: same facts, same order.
# ---------------------------------------------------------------------------

CONTENT = {
    "en": {
        "file": "hamdi-jarboui-resume-en.pdf",
        "title": "Hamdi Jarboui - Senior Python Engineer, AI Agents & DevOps - Resume",
        "headline": "Senior Python Engineer  |  AI Agents &amp; LLM Automation  |  DevOps &amp; CI/CD",
        "location": "Sfax, Tunisia",
        "portfolio_label": "Portfolio",
        "h": {
            "summary": "Professional Summary",
            "skills": "Technical Skills",
            "experience": "Professional Experience",
            "projects": "Selected Projects",
            "teaching": "Technical Training &amp; Instruction",
            "education": "Education",
            "certs": "Certifications",
            "languages": "Languages",
        },
        "summary": (
            "Senior Python engineer with 4+ years delivering production systems end to end, from architecture to deployment, "
            "across AI agents, DevOps and embedded automotive software. At KPIT I lead the design of AI agent automation "
            "and built the company's <b>AI harness</b>: 170 skills, 163 agents, 40 rules and 62 commands shared across four AI coding "
            "assistants, and a library of <b>639 MCP tools</b> across 29 servers that connects agents to CI, ALM, artifact and diagnostic systems. "
            "Hands-on with LLM integration (Claude, OpenAI), RAG, multi-agent orchestration and safe autonomy "
            "(human approval, risk-gated tools). Owner of CI/CD from commit to production, and a trainer of 100+ engineers in "
            "generative AI."
        ),
        "skills": [
            ("Languages", "Python (expert), TypeScript, SQL, Bash"),
            ("AI Agents &amp; LLMs", "Agentic AI, multi-agent orchestration, Model Context Protocol (MCP) servers &amp; clients, tool/function calling, "
             "RAG (LangChain, pgvector, OpenAI embeddings), prompt &amp; context engineering, Anthropic Claude, OpenAI, Claude Code, OpenCode, GitHub Copilot"),
            ("AI Safety", "Human-in-the-loop approval, risk-tiered tool access, fail-closed merge gates, loop detection, secret redaction"),
            ("Back end", "Django, Starlette, REST APIs, asyncio, Pydantic, Node.js, Bun, Zod, React"),
            ("DevOps &amp; CI/CD", "GitLab CI/CD, GitHub Actions, Jenkins, Zuul, Docker, Docker Compose, Caddy, Nexus, JFrog Artifactory, "
             "tag-gated releases, private package registries, AWS, Linux"),
            ("Testing &amp; Quality", "pytest, Robot Framework, contract testing, E2E testing, coverage gates, ruff, mypy, ESLint, TestGuide"),
            ("Observability", "Grafana, Prometheus, Kibana, Elastic, OpenTelemetry, Plotly Dash"),
            ("Automotive", "CAN/CAN-FD, DBC, UDS over DoIP, ODX/PDX, AUTOSAR ARXML, A2L, DLT, MDF4, Lauterbach TRACE32, "
             "MISRA C:2012, ISO 26262, ASPICE, ECU validation"),
            ("Data &amp; ML", "PostgreSQL, SQLite, MySQL, MSSQL, MongoDB, Oracle; machine learning, deep learning, computer vision"),
            ("Integrations", "GitLab, GitHub, Jira, Confluence, Microsoft Graph / 365, Slack, Microsoft Teams"),
        ],
        "jobs": [
            (
                "Senior Python Developer &amp; DevOps Engineer, AI Agents",
                "KPIT Technologies · Sfax, Tunisia · 07/2024 – Present",
                [
                    "Lead the design and delivery of AI agent automation in Python, setting the technical direction for how the team automates repetitive engineering work.",
                    "Built <b>Anvil</b>, the company-wide AI harness: <b>170 skills, 163 agents, 40 rules and 62 commands</b> installed from one registry into Claude Code, OpenCode, Beacon and GitHub Copilot, with zero npm dependencies and tag-gated releases.",
                    "Architected <b>ai-tools-library</b>: <b>29 MCP servers exposing 639 tools</b> for GitLab, Jenkins, Jira, Confluence, Grafana and automotive diagnostics, shipped through a <b>7-stage CI pipeline</b> with per-package coverage gates up to 98%.",
                    "Built <b>MTF Assistant</b>, a RAG chatbot (Django, React, LangChain, pgvector) answering questions on the internal test framework, used by <b>~600 testers and developers</b>.",
                    "Built <b>opencode-autodev</b>: agents collect tickets from GitLab, GitHub, Jira and Microsoft To Do, work them in a configurable agent squad, and open pull requests that merge only after <b>human approval</b>; 513 tests, 85% coverage floor.",
                    "Own CI/CD (Jenkins, Zuul, GitLab CI/CD) from commit to production, with Nexus/Artifactory artifact management, TestGuide test orchestration, Docker and AWS deployment.",
                    "Work directly with customers to gather requirements and present technical solutions; delivered a generative AI workshop to the whole development department (~100 engineers).",
                ],
            ),
            (
                "Python Developer &amp; DevOps Engineer",
                "Primatec Engineering · Sfax, Tunisia · 07/2022 – 06/2024",
                [
                    "Reference engineer for Python ECU flashing and configuration tooling, enabling faster embedded-systems validation for automotive OEM programmes.",
                    "Automated build, test and deployment pipelines with Jenkins and Zuul (including Zuul on AWS), removing manual steps from the release process.",
                    "Built full-stack Python tools and dashboards adopted across engineering teams for data analysis and reporting.",
                    "Prototyped the automation concepts that became the foundation for AI agent workflows now in production at KPIT.",
                    "Trained developers and testers in ~20-person cohorts on Python testing (pytest, Robot Framework).",
                ],
            ),
        ],
        "projects": [
            (
                "HCode: AI coding agent for the terminal (creator &amp; core author, team project)",
                "Python · Anthropic &amp; OpenAI · MCP · 44k lines · 827 tests",
                [
                    "Autonomous coding agent built from scratch with a Plan-Execute-Verify workflow, automatic failover between Claude and OpenAI behind circuit breakers, three-layer memory (project, session, semantic) and per-task transactions.",
                    "The same agent core powers a terminal UI, plus a desktop app and a VS Code extension built with two collaborators.",
                ],
            ),
        ],
        "projects_more": f"Full case studies with architecture and metrics: {link(PORTFOLIO, 'hamdijarboui.github.io/portfolio')}",
        "teaching_intro": "5 years training engineers and students in Python, generative AI and agentic AI: 20-person cohorts, 10–30 hour programmes, <b>100% PCEP pass rate</b>, students placing 3 times at national AI competitions.",
        "teaching": [
            "<b>Lead Instructor</b>, Python, Generative AI &amp; Computer Vision · 2S Training and Consulting · 2021 – Present",
            "<b>Python &amp; Applied AI Instructor</b> · ENETCOM Engineering School, Sfax · 2024 – Present",
            "<b>Python &amp; Generative AI Instructor</b> · ISB International School of Business · 2024 – Present",
            "<b>Python Instructor</b> · Smart Skills Academy · 2022 – 2023",
        ],
        "education": [
            "<b>Engineering Degree, Industrial Computer Engineering</b> · National School of Electronics and Telecommunications (ENETCOM), Sfax · 2019 – 2024",
            "<b>Preparatory Cycle, Physics &amp; Chemistry</b> · Faculty of Sciences, Sfax · 2017 – 2019",
        ],
        "certs": [
            "Python Institute: PCEP (Certified Entry-Level Python Programmer), PCAP (Certified Associate in Python Programming)",
            "IBM: Applied Data Science with Python (Level 2) · Deep Learning (Level 2), TensorFlow",
            "University of Washington (Coursera): Machine Learning Specialization",
            "Microsoft MTA: Programming Using Python &amp; Java · Certiprof: Scrum Foundation (SFPC)",
        ],
        "languages": "Arabic: native · French: full professional proficiency · English: professional working proficiency",
    },
    "fr": {
        "file": "hamdi-jarboui-cv-fr.pdf",
        "title": "Hamdi Jarboui - Ingénieur Python Senior, Agents IA & DevOps - CV",
        "headline": "Ingénieur Python Senior  |  Agents IA &amp; automatisation LLM  |  DevOps &amp; CI/CD",
        "location": "Sfax, Tunisie",
        "portfolio_label": "Portfolio",
        "h": {
            "summary": "Profil",
            "skills": "Compétences techniques",
            "experience": "Expérience professionnelle",
            "projects": "Projets marquants",
            "teaching": "Formation technique &amp; enseignement",
            "education": "Formation",
            "certs": "Certifications",
            "languages": "Langues",
        },
        "summary": (
            "Ingénieur Python senior, plus de 4 ans d'expérience à livrer des systèmes en production de bout en bout, de "
            "l'architecture au déploiement, sur les agents IA, le DevOps et le logiciel embarqué automobile. Chez KPIT, je pilote "
            "la conception de l'automatisation par agents IA et j'ai construit le <b>harnais IA</b> de l'entreprise : 170 skills, "
            "163 agents, 40 règles et 62 commandes partagés entre quatre assistants de code IA, et une bibliothèque de <b>639 outils MCP</b> répartis sur 29 serveurs "
            "qui connecte les agents aux systèmes de CI, d'ALM, d'artefacts et de diagnostic. Maîtrise de l'intégration de LLM "
            "(Claude, OpenAI), du RAG, de l'orchestration multi-agents et de l'autonomie encadrée (validation humaine, outils "
            "filtrés par niveau de risque). Responsable de la CI/CD du commit à la production et formateur de plus de 100 "
            "ingénieurs en IA générative."
        ),
        "skills": [
            ("Langages", "Python (expert), TypeScript, SQL, Bash"),
            ("Agents IA &amp; LLM", "IA agentique, orchestration multi-agents, Model Context Protocol (MCP) serveurs &amp; clients, appel d'outils (function calling), "
             "RAG (LangChain, pgvector, embeddings OpenAI), prompt &amp; context engineering, Anthropic Claude, OpenAI, Claude Code, OpenCode, GitHub Copilot"),
            ("Sécurité de l'IA", "Validation humaine (human-in-the-loop), accès aux outils par niveau de risque, contrôles de merge bloquants, détection de boucles, masquage des secrets"),
            ("Back-end", "Django, Starlette, API REST, asyncio, Pydantic, Node.js, Bun, Zod, React"),
            ("DevOps &amp; CI/CD", "GitLab CI/CD, GitHub Actions, Jenkins, Zuul, Docker, Docker Compose, Caddy, Nexus, JFrog Artifactory, "
             "releases déclenchées par tag, registres de paquets privés, AWS, Linux"),
            ("Tests &amp; qualité", "pytest, Robot Framework, tests de contrat, tests E2E, seuils de couverture, ruff, mypy, ESLint, TestGuide"),
            ("Observabilité", "Grafana, Prometheus, Kibana, Elastic, OpenTelemetry, Plotly Dash"),
            ("Automobile", "CAN/CAN-FD, DBC, UDS sur DoIP, ODX/PDX, AUTOSAR ARXML, A2L, DLT, MDF4, Lauterbach TRACE32, "
             "MISRA C:2012, ISO 26262, ASPICE, validation ECU"),
            ("Données &amp; ML", "PostgreSQL, SQLite, MySQL, MSSQL, MongoDB, Oracle ; machine learning, deep learning, vision par ordinateur"),
            ("Intégrations", "GitLab, GitHub, Jira, Confluence, Microsoft Graph / 365, Slack, Microsoft Teams"),
        ],
        "jobs": [
            (
                "Développeur Python Senior &amp; Ingénieur DevOps, Agents IA",
                "KPIT Technologies · Sfax, Tunisie · 07/2024 – aujourd'hui",
                [
                    "Pilote la conception et la livraison de l'automatisation par agents IA en Python et définit la direction technique de l'équipe pour automatiser le travail d'ingénierie répétitif.",
                    "Conception d'<b>Anvil</b>, le harnais IA de toute l'entreprise : <b>170 skills, 163 agents, 40 règles et 62 commandes</b> installés depuis un registre unique dans Claude Code, OpenCode, Beacon et GitHub Copilot, sans aucune dépendance npm, avec des releases déclenchées par tag.",
                    "Architecture d'<b>ai-tools-library</b> : <b>29 serveurs MCP exposant 639 outils</b> pour GitLab, Jenkins, Jira, Confluence, Grafana et le diagnostic automobile, livrés via un <b>pipeline CI en 7 étapes</b> avec des seuils de couverture par paquet allant jusqu'à 98 %.",
                    "Conception de <b>MTF Assistant</b>, un chatbot RAG (Django, React, LangChain, pgvector) qui répond aux questions sur le framework de test interne, utilisé par <b>environ 600 testeurs et développeurs</b>.",
                    "Conception d'<b>opencode-autodev</b> : les agents collectent les tickets depuis GitLab, GitHub, Jira et Microsoft To Do, les traitent en équipe d'agents configurable et ouvrent des pull requests qui ne sont fusionnées qu'après <b>validation humaine</b> ; 513 tests, couverture minimale de 85 %.",
                    "Responsable de la CI/CD (Jenkins, Zuul, GitLab CI/CD) du commit à la production : gestion des artefacts Nexus/Artifactory, orchestration des tests TestGuide, déploiement Docker et AWS.",
                    "Travail direct avec les clients pour recueillir les besoins et présenter les solutions techniques ; animation d'un atelier IA générative pour tout le département de développement (environ 100 ingénieurs).",
                ],
            ),
            (
                "Développeur Python &amp; Ingénieur DevOps",
                "Primatec Engineering · Sfax, Tunisie · 07/2022 – 06/2024",
                [
                    "Ingénieur de référence pour l'outillage Python de flashage et de configuration des ECU, accélérant la validation des systèmes embarqués pour des constructeurs automobiles.",
                    "Automatisation des pipelines de build, de test et de déploiement avec Jenkins et Zuul (y compris Zuul sur AWS), supprimant les étapes manuelles du processus de release.",
                    "Développement d'outils Python full-stack et de tableaux de bord adoptés par les équipes d'ingénierie pour l'analyse de données et le reporting.",
                    "Prototypage des concepts d'automatisation à l'origine des workflows par agents IA aujourd'hui en production chez KPIT.",
                    "Formation de développeurs et de testeurs par groupes d'environ 20 personnes aux tests Python (pytest, Robot Framework).",
                ],
            ),
        ],
        "projects": [
            (
                "HCode : agent de code IA pour le terminal (créateur &amp; auteur principal, projet d'équipe)",
                "Python · Anthropic &amp; OpenAI · MCP · 44 000 lignes · 827 tests",
                [
                    "Agent de code autonome conçu de zéro, avec un workflow Planifier-Exécuter-Vérifier, bascule automatique entre Claude et OpenAI via des circuit breakers, mémoire à trois niveaux (projet, session, sémantique) et transactions par tâche.",
                    "Le même cœur d'agent alimente une interface terminal, ainsi qu'une application de bureau et une extension VS Code réalisées avec deux collaborateurs.",
                ],
            ),
        ],
        "projects_more": f"Études de cas complètes, architecture et métriques : {link(PORTFOLIO, 'hamdijarboui.github.io/portfolio')}",
        "teaching_intro": "5 ans de formation d'ingénieurs et d'étudiants en Python, IA générative et IA agentique : groupes de 20 personnes, programmes de 10 à 30 heures, <b>100 % de réussite à la certification PCEP</b>, étudiants primés 3 fois lors de compétitions nationales d'IA.",
        "teaching": [
            "<b>Formateur principal</b>, Python, IA générative &amp; vision par ordinateur · 2S Training and Consulting · 2021 – aujourd'hui",
            "<b>Enseignant Python &amp; IA appliquée</b> · École d'ingénieurs ENETCOM, Sfax · 2024 – aujourd'hui",
            "<b>Enseignant Python &amp; IA générative</b> · ISB International School of Business · 2024 – aujourd'hui",
            "<b>Formateur Python</b> · Smart Skills Academy · 2022 – 2023",
        ],
        "education": [
            "<b>Diplôme d'ingénieur en informatique industrielle</b> · École Nationale d'Électronique et des Télécommunications (ENETCOM), Sfax · 2019 – 2024",
            "<b>Cycle préparatoire, physique &amp; chimie</b> · Faculté des Sciences de Sfax · 2017 – 2019",
        ],
        "certs": [
            "Python Institute : PCEP (Certified Entry-Level Python Programmer), PCAP (Certified Associate in Python Programming)",
            "IBM : Applied Data Science with Python (niveau 2) · Deep Learning (niveau 2), TensorFlow",
            "University of Washington (Coursera) : Machine Learning Specialization",
            "Microsoft MTA : Programming Using Python &amp; Java · Certiprof : Scrum Foundation (SFPC)",
        ],
        "languages": "Arabe : langue maternelle · Français : courant (professionnel) · Anglais : professionnel",
    },
}


def build(lang: str) -> Path:
    c = CONTENT[lang]
    path = OUT / c["file"]
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=13 * mm,
        bottomMargin=12 * mm,
        title=c["title"],
        author="Hamdi Jarboui",
        subject=c["headline"].replace("&amp;", "&"),
        keywords="Python, AI Engineer, AI Agents, Agentic AI, LLM, MCP, RAG, DevOps, CI/CD, GitLab CI, Jenkins, Docker, Automotive",
        creator="scripts/build_resume.py",
    )
    s = STYLES
    story = [
        Paragraph("Hamdi Jarboui", s["name"]),
        Paragraph(c["headline"], s["headline"]),
        Spacer(1, 3),
        Paragraph(f"{link('mailto:' + EMAIL, EMAIL)}  ·  {PHONE}  ·  {c['location']}", s["contact"]),
        Paragraph(
            f"{c['portfolio_label']}: {link(PORTFOLIO, 'hamdijarboui.github.io/portfolio')}  ·  "
            f"LinkedIn: {link(LINKEDIN, 'linkedin.com/in/hamdi-jarboui')}  ·  GitHub: {link(GITHUB, 'github.com/hamdiJarboui')}",
            s["contact"],
        ),
    ]

    story += section(c["h"]["summary"])
    story.append(Paragraph(c["summary"], s["body"]))

    story += section(c["h"]["skills"])
    for label, items in c["skills"]:
        story.append(Paragraph(f"<b>{label}:</b> {items}", s["skill"]))

    story += section(c["h"]["experience"])
    for title, meta, items in c["jobs"]:
        story += entry(title, meta, items)

    story += section(c["h"]["projects"])
    for title, meta, items in c["projects"]:
        story += entry(title, meta, items)
    story.append(Spacer(1, 2))
    story.append(Paragraph(c["projects_more"], s["body"]))

    story += section(c["h"]["teaching"])
    story.append(Paragraph(c["teaching_intro"], s["body"]))
    story += bullets(c["teaching"])

    story += section(c["h"]["education"])
    story += bullets(c["education"])

    story += section(c["h"]["certs"])
    story += bullets(c["certs"])

    story += section(c["h"]["languages"])
    story.append(Paragraph(c["languages"], s["body"]))

    doc.build(story)
    return path


if __name__ == "__main__":
    for lang in CONTENT:
        print(build(lang))
