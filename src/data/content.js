export const companyProfile = {
  name: "Nexora Technology PLC",
  badge: "Digital Innovation Company",
  tagline: "Scale your impact with intelligent software built for real problems.",
  intro:
    "We partner with organizations to build software systems that grow with you. From healthcare to banking, education to startups—Nexora delivers reliable, scalable platforms that help you operate faster, smarter, and with confidence.",
  sectorVariants: {
    banking: {
      tagline: "Security and scale for financial innovation.",
      intro: "Enterprise-grade systems engineered for trust, compliance, and growth.",
    },
    healthcare: {
      tagline: "Reliable systems that improve patient outcomes.",
      intro: "Purpose-built software for healthcare providers and medical organizations.",
    },
    education: {
      tagline: "Technology that empowers learning at scale.",
      intro: "Scalable platforms designed for educators and educational institutions.",
    },
    startups: {
      tagline: "MVP to market-leading product in months.",
      intro: "Fast-track your growth with architecture built for velocity and scale.",
    },
  },
  office: "Addis Ababa, Ethiopia",
  nav: [
    { id: "capabilities", label: "Capabilities" },
    { id: "governance", label: "Governance" },
    { id: "roadmap", label: "Roadmap" },
    { id: "contact", label: "Contact" },
  ],
  positioning: [
    {
      title: "AI-Driven Product Delivery",
      detail: "We architect practical intelligence into every software layer.",
    },
    {
      title: "Healthcare and Education Focus",
      detail: "We build systems that improve outcomes in high-impact sectors.",
    },
    {
      title: "Enterprise-Grade Engineering",
      detail: "Security, scale, and maintainability are baked into our process.",
    },
    {
      title: "Long-Term Partnership Model",
      detail: "From strategy to support, we co-build with ambitious teams.",
    },
  ],
  capabilities: [
    {
      title: "Product Engineering",
      points: [
        "Mobile, web, desktop, and cloud applications",
        "Scalable backend systems and secure APIs",
        "Maintenance, upgrades, and lifecycle support",
      ],
    },
    {
      title: "AI and Data Systems",
      points: [
        "AI/ML model integration into business workflows",
        "Data analytics and decision-support platforms",
        "Intelligent automation for operations",
      ],
    },
    {
      title: "Digital Transformation",
      points: [
        "Software architecture and technical consulting",
        "Government and private sector collaboration",
        "Training and knowledge transfer programs",
      ],
    },
  ],
  governance: {
    generalManager: "Ato Haile Debele",
    deputyManager: "Ato Yonas Ayele",
    highlights: [
      "Limited liability based on shareholding.",
      "Profit and loss distribution follows share proportion.",
      "General meetings operate with defined quorum and voting rules.",
      "Certified auditor oversight and transparent reporting standards.",
    ],
  },
  roadmap: [
    {
      phase: "Phase 01",
      title: "Foundation",
      description:
        "Build robust internal systems, launch flagship software services, and establish core delivery standards.",
      caseStudyId: "healthcare",
      focus: "Stability and delivery discipline",
      proofMetric: "4-6 weeks",
      proofLabel: "to first production milestone",
      proof: [
        "Architecture blueprint approved before build kickoff",
        "Security baseline and coding standards enforced",
        "Release checklist and QA gate adopted by the team",
      ],
    },
    {
      phase: "Phase 02",
      title: "Scale",
      description:
        "Expand platform capabilities, deepen AI and data offerings, and grow strategic partnerships across sectors.",
      caseStudyId: "banking",
      focus: "Throughput and reliability at growth stage",
      proofMetric: "2x-4x",
      proofLabel: "delivery throughput increase",
      proof: [
        "CI/CD and automation reduce manual release overhead",
        "Observability and alerts improve incident response speed",
        "Modular services support new features without core regressions",
      ],
    },
    {
      phase: "Phase 03",
      title: "Regional Impact",
      description:
        "Open new collaborations beyond Addis Ababa and position Nexora as a trusted technology partner in the region.",
      caseStudyId: "startup",
      focus: "Cross-sector trust and long-term outcomes",
      proofMetric: "99.9%",
      proofLabel: "service availability target",
      proof: [
        "Governance and reporting model scales with new partnerships",
        "Service-level commitments defined for enterprise clients",
        "Knowledge transfer ensures sustainable client ownership",
      ],
    },
  ],
  caseStudies: [
    {
      id: "healthcare",
      sector: "Healthcare",
      title: "Patient Portal Transformation",
      before: {
        icon: "🏥",
        challenges: [
          "Fragmented patient records across teams",
          "No unified appointment workflow",
          "Manual reporting and delayed decisions",
        ],
      },
      after: {
        icon: "✅",
        improvements: [
          "Unified and secure patient data access",
          "Live scheduling and reduced queue time",
          "Operational dashboards for faster decisions",
        ],
        metric: "85%",
        label: "faster service flow",
      },
    },
    {
      id: "banking",
      sector: "Banking",
      title: "Compliance and Core Scale Upgrade",
      before: {
        icon: "🏦",
        challenges: [
          "Legacy release process with high manual risk",
          "Compliance checks done late in delivery cycle",
          "Performance degradation under peak usage",
        ],
      },
      after: {
        icon: "⚙️",
        improvements: [
          "Automated release and verification pipeline",
          "Embedded compliance gates before deployment",
          "Stable throughput under high transaction volume",
        ],
        metric: "3x",
        label: "release throughput",
      },
    },
    {
      id: "startup",
      sector: "Startup",
      title: "MVP to Regional Product Rollout",
      before: {
        icon: "🚧",
        challenges: [
          "Single-instance MVP with fragile architecture",
          "No observability for production health",
          "Hard to onboard new clients quickly",
        ],
      },
      after: {
        icon: "🚀",
        improvements: [
          "Modular platform ready for multi-tenant growth",
          "Monitoring and alerting with service SLOs",
          "Faster expansion into new markets",
        ],
        metric: "99.9%",
        label: "availability target",
      },
    },
  ],
  contact: {
    inboxEmail: "yonasayeletola62@gmail.com,nexoratechnologyplc@gmail.com",
    inquiryEndpoint: "",
    primary: {
      telegram: "@JYAT6200",
      phone: "+251900011767",
      github: "https://github.com/yonayetol",
    },
    alternate: {
       inboxEmail: "nexoratechnologyplc@gmail.com",
      telegram: "@valerioE",
      phone: "+251965758511",
      github: "https://github.com/hailevalerio-65",
    },
    note:
      "Reach out through either contact option; both are active for project discussions and partnerships.",
  },
};

export const siteLocales = {
  en: {
    code: "en",
    label: "English",
    badge: "Digital Innovation Company",
    tagline: "Scale your impact with intelligent software built for real problems.",
    intro:
      "We partner with organizations to build software systems that grow with you. From healthcare to banking, education to startups, Nexora delivers reliable, scalable platforms that help you operate faster, smarter, and with confidence.",
    nav: ["Capabilities", "Governance", "Roadmap", "Contact"],
    ui: {
      workWithUs: "Work With Us",
      themeLight: "Light",
      themeDark: "Dark",
      heroExplore: "Explore Services",
      heroOperate: "How We Operate",
      heroMetaImpact: "Built for long-term digital impact",
      capabilitiesTitle: "What We Build",
      capabilitiesSubtitle: "Capabilities",
      governanceTitle: "How We Govern and Deliver",
      governanceSubtitle: "Structure",
      governanceLeadership: "Leadership",
      governanceGeneralManager: "General Manager",
      governanceDeputyManager: "Deputy Manager",
      governanceOps: "Operational Principles",
      governanceOutcomeFallback: "Measurable outcome",
      roadmapTitle: "Where We Are Going",
      roadmapSubtitle: "Vision",
      contactEyebrow: "Contact",
      contactTitle: "Let's Build Something Real Together",
      contactCopy:
        "We collaborate with institutions, startups, and teams that want practical, scalable digital systems.",
      contactStartProject: "Start a Project",
      contactTelegram: "Telegram",
      contactPhone: "Phone",
      contactLocation: "Location",
      caseEyebrow: "Success Stories",
      caseTitle: "Results That Speak",
      caseSubtitle: "See how we've transformed organizations across sectors",
      caseBefore: "Before",
      caseAfter: "After",
      caseChallenges: "Challenges",
      caseOutcomes: "Outcomes",
      caseTransform: "Transformation",
      caseNote: "From operational bottleneck to measurable delivery outcomes.",
    },
  },
  am: {
    code: "am",
    label: "Amharic",
    badge: "ዲጂታል ፈጠራ ኩባንያ",
    tagline: "እውነተኛ ችግኝ የሚፈታ ብልህ ሶፍትዌር በመጠቀም ተፅዕኖዎን አሳድጉ።",
    intro:
      "ድርጅቶች ከእድገታቸው ጋር የሚያበረታታ ሶፍትዌር ስርዓት እንገነባለን። ከጤና እስከ ባንክ፣ ከትምህርት እስከ ስታርትአፕ፣ Nexora ፈጣን፣ አስተማማኝ እና ሊሰፋ የሚችል መድረክ ያቀርባል።",
    nav: ["አቅም", "አስተዳደር", "እቅድ", "አግኙን"],
    ui: {
      workWithUs: "ከእኛ ጋር ይስሩ",
      themeLight: "ብርሃን",
      themeDark: "ጨለማ",
      heroExplore: "አገልግሎቶችን ያስሱ",
      heroOperate: "እንዴት እንሰራ",
      heroMetaImpact: "ረጅም ጊዜ ዲጂታል ተፅዕኖ ለመፍጠር",
      capabilitiesTitle: "የምንገነባው",
      capabilitiesSubtitle: "አቅም",
      governanceTitle: "እንዴት እንመራ እና እንሰጣለን",
      governanceSubtitle: "መዋቅር",
      governanceLeadership: "መሪነት",
      governanceGeneralManager: "ዋና ስራ አስኪያጅ",
      governanceDeputyManager: "ምክትል ስራ አስኪያጅ",
      governanceOps: "የስራ መርሆዎች",
      governanceOutcomeFallback: "የሚለካ ውጤት",
      roadmapTitle: "ወዴት እንሄዳለን",
      roadmapSubtitle: "ራዕይ",
      contactEyebrow: "አግኙን",
      contactTitle: "እውነተኛ ነገር በአንድነት እንገንባ",
      contactCopy: "ተግባራዊ እና ሊሰፋ የሚችል ዲጂታል ስርዓት ለሚፈልጉ ተቋማትና ቡድኖች ጋር እንሰራለን።",
      contactStartProject: "ፕሮጀክት ጀምር",
      contactTelegram: "ቴሌግራም",
      contactPhone: "ስልክ",
      contactLocation: "አድራሻ",
      caseEyebrow: "የስኬት ታሪኮች",
      caseTitle: "ውጤት የሚናገር",
      caseSubtitle: "በተለያዩ ዘርፎች ያመጣነውን ለውጥ ይመልከቱ",
      caseBefore: "በፊት",
      caseAfter: "በኋላ",
      caseChallenges: "ችግኝ",
      caseOutcomes: "ውጤቶች",
      caseTransform: "ለውጥ",
      caseNote: "ከእንቅፋት ወደ ሊለካ የሚችል ውጤት።",
    },
  },
  om: {
    code: "om",
    label: "Afaan Oromo",
    badge: "Dhaabbata Kalaqaa Dijitaalaa",
    tagline: "Rakkoo dhugaa furuu danda uun, software sammuu qabuun dhiibbaa kee guddisi.",
    intro:
      "Dhaabbilee waliin hojjennee sirna software guddina isaanii waliin guddatu ijaarra. Fayyaa irraa hanga baankii, barnoota irraa hanga startup, Nexora sirna amanamaa, saffisaa fi bal'achuu danda'u kenna.",
    nav: ["Dandeettii", "Bulchiinsa", "Karoora", "Nu Qunnamaa"],
    ui: {
      workWithUs: "Nu Wajjin Hojjedhaa",
      themeLight: "Ifaa",
      themeDark: "Dukkanaa",
      heroExplore: "Tajaajiloota Ilaali",
      heroOperate: "Akkaataa Hojii Keenya",
      heroMetaImpact: "Dhiibbaa dijitaalaa yeroo dheeraa",
      capabilitiesTitle: "Waan Ijaarru",
      capabilitiesSubtitle: "Dandeettii",
      governanceTitle: "Akkaataa Bulchiinsaa fi Dhiyeessa Keenya",
      governanceSubtitle: "Caasaa",
      governanceLeadership: "Hoggansa",
      governanceGeneralManager: "Hogganaa Olaanaa",
      governanceDeputyManager: "Itti Aanaa Hogganaa",
      governanceOps: "Seerota Hojii",
      governanceOutcomeFallback: "Bu'aa madaalamu",
      roadmapTitle: "Eessa Dhaabuuf Jiraanna",
      roadmapSubtitle: "Mul'ata",
      contactEyebrow: "Nu Qunnamaa",
      contactTitle: "Waliin Waan Dhugaa Ijaarra",
      contactCopy: "Dhaabbilee fi gareewwan sirna dijitaalaa hojii irratti bu'aa qabu barbaadan waliin ni hojjenna.",
      contactStartProject: "Pirojektii Jalqabi",
      contactTelegram: "Telegram",
      contactPhone: "Bilbila",
      contactLocation: "Bakka",
      caseEyebrow: "Seenaa Milkaa'inaa",
      caseTitle: "Bu'aan Ofii Isaa Dubbata",
      caseSubtitle: "Akkaataa jijjiirama damee adda addaatti fide ilaali",
      caseBefore: "Dura",
      caseAfter: "Booda",
      caseChallenges: "Rakkoolee",
      caseOutcomes: "Bu'aa",
      caseTransform: "Jijjiirama",
      caseNote: "Rakkoo hojii irraa gara bu'aa madaalamuutti.",
    },
  },
};

export function getLocalizedProfile(language = "en") {
  const locale = siteLocales[language] || siteLocales.en;
  const nav = companyProfile.nav.map((item, index) => ({
    ...item,
    label: locale.nav[index] || item.label,
  }));

  return {
    ...companyProfile,
    badge: locale.badge,
    tagline: locale.tagline,
    intro: locale.intro,
    nav,
    language,
    ui: locale.ui,
  };
}
