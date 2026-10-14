export const SKILL_GROUPS = [
  {
    title: "Languages & Frameworks",
    items: ["Java", "TypeScript", "Golang", "Spring Boot", "Node.js", "Serverless"],
  },
  {
    title: "Architecture & Protocols",
    items: [
      "System Design",
      "Low Level Design",
      "Distributed Systems",
      "Microservices",
      "Multithreading",
      "REST",
      "gRPC",
      "AuthN / AuthZ",
    ],
  },
  {
    title: "Data, Infra & Observability",
    items: [
      "PostgreSQL",
      "AWS Lambda",
      "SQS",
      "SNS",
      "Kinesis",
      "OpenSearch",
      "S3",
      "State Machines",
      "CloudWatch",
      "Datadog",
      "CircleCI",
      "RabbitMQ",
    ],
  },
  {
    title: "AI & AI-Assisted Engineering",
    items: ["Claude Code", "MCP Servers", "RAG", "AI OCR Extraction", "Conductor"],
  },
];

export const EXPERIENCE = [
  {
    company: "Flexport",
    url: "https://www.flexport.com",
    role: "SDE-3 (Senior Software Engineer)",
    period: "Dec 2023 – Present",
    location: "Bangalore, India",
    points: [
      "Transformed Returns from a KTLO product into a core revenue engine — scaling ARR 7.5× from $2M to $15M through new merchant capabilities and architectural investment.",
      "Architected an SQS event-driven layer decoupling Returns processing from the external WMS, eliminating a 10s synchronous bottleneck and lifting throughput (UPH) from 15 to 32.",
      "Built a Kinesis-based CDC pipeline using the Outbox pattern, syncing 1M+ state updates into OpenSearch for highly available, low-latency search.",
      "Architected AuthN/AuthZ, RBAC and Notifications for a new Finance platform — saving $500K in licensing — with graph traversal to resolve hierarchical approval limits.",
      "Promoted from SDE-II to SDE-III within a year; sole senior engineer on a team scaled from 2 to 8, owning system design, architecture reviews, on-call, and mentorship.",
    ],
  },
  {
    company: "Airtel Digital",
    url: "https://www.airtel.in",
    role: "SDE-2",
    period: "Jul 2021 – Dec 2023",
    location: "Gurgaon, India",
    points: [
      "On the Telemedia Fault Repair team for AirtelWork (Airtel's fleet-management platform), designed and built the Broadband Fault Repair workflow from scratch — the full SR journey from creation through operator assignment, field visit, post-fix verification, and closure — and launched it pan-India (UAT → GTM → launch) handling ~100K SRs/day.",
      "Built the Smart SR Journey: for area-wide outages, auto-generate SRs for all affected connections and hold them, then after the upstream fix re-check each connection via a diagnostic API and dispatch engineers only to the ones still broken — handling ~500K SRs/day and saving Airtel ₹150 Cr (~$18M) a year.",
      "Backend built with Java, Spring Boot, PostgreSQL, Redis, and RabbitMQ/Solace queues. Promoted from SDE-I to SDE-II.",
    ],
  },
  {
    company: "Cognizant Technology Solutions",
    url: "https://www.cognizant.com",
    role: "Software Developer",
    period: "Aug 2020 – Jul 2021",
    location: "Kolkata, India",
    points: [
      "Contributed to the Voya project — NiFi-based automated report generation for business stakeholders.",
      "Automated repetitive operational tasks with shell scripts; scored highest in the Spring Boot / Java / SQL training cohort.",
    ],
  },
];

export const EDUCATION = {
  degree: "B.Tech in Computer Science",
  school: "Jalpaiguri Government Engineering College",
  period: "2016 – 2020",
  note: "DSA · Computer Architecture · Operating Systems",
};
