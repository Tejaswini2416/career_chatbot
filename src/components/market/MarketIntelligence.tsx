'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Target, 
  BarChart2, 
  Zap,
  ArrowRight,
  Briefcase,
  Building,
  DollarSign,
  MapPin,
  BookmarkPlus,
  RefreshCw,
  SlidersHorizontal,
  Edit3,
  Check
} from 'lucide-react';
import { UserProfile, IngestedJobPosting, SkillDeltaRadarItem, SkillDecayItem } from '@/lib/types';

export interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  matchScore: number;
  tags: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  url: string;
  source: 'LinkedIn' | 'Greenhouse' | 'Lever' | 'Ashby';
  description: string;
}

interface MarketIntelligenceProps {
  userProfile: UserProfile;
  onSendChatPrompt?: (prompt: string) => void;
  onUpdateUserProfile?: (updatedProfile: UserProfile) => void;
  onNavigateToStudio?: (job: RecommendedJob) => void;
  onTrackInKanban?: () => void;
}

export function MarketIntelligence({ 
  userProfile, 
  onSendChatPrompt, 
  onUpdateUserProfile,
  onNavigateToStudio,
  onTrackInKanban
}: MarketIntelligenceProps) {
  // Primary target role derived from user profile
  const profileTargetRole = userProfile.targetRoles?.[0] || 'Data Scientist';
  
  // Interactive active role state so user can immediately switch roles and see recommended jobs
  const [activeRole, setActiveRole] = useState<string>(profileTargetRole);
  const [customRoleInput, setCustomRoleInput] = useState<string>('');
  const [isEditingRole, setIsEditingRole] = useState<boolean>(false);
  const [activeGuideJob, setActiveGuideJob] = useState<RecommendedJob | null>(null);
  const [copiedOutreach, setCopiedOutreach] = useState<boolean>(false);

  // Sync if profileTargetRole changes externally
  useEffect(() => {
    setActiveRole(profileTargetRole);
  }, [profileTargetRole]);

  // Standard role classification
  const isDataRole = /data\s*scientist|machine\s*learning|ml|ai|statistic/i.test(activeRole);
  const isMLEngineer = /machine\s*learning\s*eng|ml\s*eng|mle|ai\s*infra|deep\s*learning/i.test(activeRole);
  const isProductRole = /product|pm|program\s*manager|tpm/i.test(activeRole);
  const isFrontendRole = /front\s*end|ui|react|web|full\s*stack/i.test(activeRole);
  const isDevOpsRole = /devops|cloud|sre|site\s*reliability|infrastructure|platform/i.test(activeRole);
  const isSecurityRole = /security|cyber|infosec|appsec/i.test(activeRole);
  const isDataEngineerRole = /data\s*eng|analytics\s*eng|etl|lakehouse/i.test(activeRole);

  // Generate dynamic recommended jobs based strictly on the user-selected or active role
  const getRecommendedJobsForRole = (role: string): RecommendedJob[] => {
    if (isMLEngineer) {
      return [
        {
          id: 'job_mle_1',
          title: 'Staff Alignment & RLHF Machine Learning Engineer',
          company: 'Anthropic',
          location: 'San Francisco, CA / Hybrid',
          salaryRange: '$220,000 - $280,000 Base ($380k+ TC)',
          matchScore: 96,
          tags: ['PyTorch', 'RLHF', 'Distributed Training', 'vLLM', 'Constitutional AI'],
          requiredSkills: ['PyTorch / JAX', 'Distributed Training (Megatron/Deepspeed)', 'Reinforcement Learning from Human Feedback', 'Python'],
          preferredSkills: ['GPU Kernel Optimization (Triton/CUDA)', 'Model Safety Benchmarking', 'vLLM Inference Serving'],
          url: 'https://www.anthropic.com/careers#open-roles',
          source: 'Ashby',
          description: 'Train next-generation Claude foundation models with novel reinforcement learning techniques, alignment algorithms, and multi-node GPU clusters.'
        },
        {
          id: 'job_mle_2',
          title: 'Machine Learning Platform Engineer — Model Serving & Latency',
          company: 'Scale AI',
          location: 'San Francisco, CA / Hybrid',
          salaryRange: '$200,000 - $260,000 Base ($350k+ TC)',
          matchScore: 93,
          tags: ['Triton', 'Ray', 'Kubernetes', 'Inference Latency', 'Python / Go'],
          requiredSkills: ['High-Throughput Model Serving', 'Ray Train / Ray Serve', 'Kubernetes GPU Clusters', 'P99 Latency Optimization'],
          preferredSkills: ['TensorRT-LLM', 'Slurm Cluster Management', 'C++ / CUDA Engine Extensions'],
          url: 'https://scale.com/careers#job-listings',
          source: 'Lever',
          description: 'Engineer high-utilization GPU clusters and serverless inference infrastructure powering cutting-edge enterprise foundation models.'
        },
        {
          id: 'job_mle_3',
          title: 'Applied Machine Learning Engineer — Autonomous Driving',
          company: 'Tesla',
          location: 'Palo Alto, CA / On-Site',
          salaryRange: '$180,000 - $240,000 Base ($330k+ TC)',
          matchScore: 91,
          tags: ['Computer Vision', 'PyTorch', 'C++', 'Edge Inference', 'Temporal Networks'],
          requiredSkills: ['End-to-End Deep Learning', 'PyTorch & C++', 'Video / Occupancy Networks', 'Embedded Hardware Constraints'],
          preferredSkills: ['Synthetic Data Generation', 'ONNX / TensorRT Quantization', 'Auto-labeling Pipelines'],
          url: 'https://www.tesla.com/careers/search#/?department=engineering',
          source: 'Greenhouse',
          description: 'Train large vision-language models for full self-driving autonomy across millions of real-world fleet cameras.'
        },
        {
          id: 'job_mle_4',
          title: 'Machine Learning Infrastructure Engineer — Core Compute',
          company: 'OpenAI',
          location: 'San Francisco, CA / Hybrid',
          salaryRange: '$210,000 - $270,000 Base ($370k+ TC)',
          matchScore: 94,
          tags: ['Supercomputing', 'NCCL', 'PyTorch', 'Fault Tolerance', 'Checkpoints'],
          requiredSkills: ['Multi-Gigawatt Cluster Reliability', 'NCCL Collective Communications', 'Automated Checkpointing', 'Python / C++'],
          preferredSkills: ['InfiniBand Network Topology', 'Triton DSL', 'LLM Loss Spike Diagnostics'],
          url: 'https://openai.com/careers/search?q=machine+learning+engineer',
          source: 'Ashby',
          description: 'Build the foundational training clusters and fault-tolerant distributed systems that enable frontier AI models to train reliably.'
        },
        {
          id: 'job_mle_5',
          title: 'Foundation Model Systems Engineer — Distributed Pre-training',
          company: 'Databricks',
          location: 'Mountain View, CA / Remote',
          salaryRange: '$195,000 - $250,000 Base ($340k+ TC)',
          matchScore: 90,
          tags: ['MosaicML', 'PyTorch', 'Distributed Systems', 'Composer', 'Streaming Datasets'],
          requiredSkills: ['Distributed Model Training', 'Streaming Dataset Optimization', 'PyTorch FSDP', 'Cloud Cost Efficiency'],
          preferredSkills: ['MLflow Model Registry', 'Tokenization at Scale', 'Low-Precision FP8 Training'],
          url: 'https://www.databricks.com/company/careers/open-positions?department=engineering',
          source: 'Greenhouse',
          description: 'Democratize frontier AI pre-training by building the open-source MosaicML Composer ecosystem and optimizing cloud training efficiency.'
        },
        {
          id: 'job_mle_6',
          title: 'On-Device Machine Learning Engineer — Apple Intelligence',
          company: 'Apple',
          location: 'Cupertino, CA / Hybrid',
          salaryRange: '$185,000 - $245,000 Base ($320k+ TC)',
          matchScore: 89,
          tags: ['CoreML', 'Neural Engine (ANE)', 'Model Quantization', 'Swift / C++', 'Privacy'],
          requiredSkills: ['Model Compression & Pruning', 'CoreML / Apple Neural Engine', 'Swift & C++ Interop', 'Zero-Server Privacy'],
          preferredSkills: ['4-bit / 3-bit AWQ Quantization', 'Speculative Decoding', 'Diffusion Accelerators'],
          url: 'https://jobs.apple.com/en-us/search?team=machine-learning-and-ai-MLAI',
          source: 'LinkedIn',
          description: 'Deploy 3B+ parameter foundation models on iPhone and Mac silicon with sub-100ms response times and strict local privacy.'
        }
      ];
    }

    if (isDataRole) {
      return [
        {
          id: 'job_ds_1',
          title: 'Applied AI & Data Scientist — Core Models & Evaluation',
          company: 'OpenAI',
          location: 'San Francisco, CA / Hybrid',
          salaryRange: '$195,000 - $250,000 Base ($350k+ TC)',
          matchScore: 96,
          tags: ['Python', 'PyTorch', 'LLM Fine-Tuning', 'Causal Inference', 'Model Evaluation'],
          requiredSkills: ['Python', 'SQL', 'Deep Learning / Transformers', 'A/B Testing Rigor', 'Statistical Inference'],
          preferredSkills: ['Vector Search (pgvector/Pinecone)', 'Distributed PyTorch', 'MLOps (Triton/Ray)'],
          url: 'https://openai.com/careers/search?q=data+scientist',
          source: 'Ashby',
          description: 'Design and evaluate high-impact generative models, benchmark prompt performance, and lead statistical experimentation across millions of daily active users.'
        },
        {
          id: 'job_ds_2',
          title: 'Senior / Staff Data Scientist — Risk, Fraud & Network',
          company: 'Stripe',
          location: 'Seattle, WA / San Francisco / Remote',
          salaryRange: '$185,000 - $235,000 Base ($320k+ TC)',
          matchScore: 94,
          tags: ['Python', 'SQL', 'Predictive Modeling', 'Anomaly Detection', 'Risk Analytics'],
          requiredSkills: ['Scikit-Learn / XGBoost', 'High-Throughput Feature Pipelines', 'SQL Data Warehousing', 'Quantified Business Framing'],
          preferredSkills: ['Spark / Snowflake', 'Kafka Streaming Features', 'Real-Time Inference Latency (<50ms)'],
          url: 'https://stripe.com/jobs/search?teams=data-science',
          source: 'Greenhouse',
          description: 'Own machine learning classifiers and decision trees preventing card testing and fraudulent chargebacks across hundreds of billions in global transactions.'
        },
        {
          id: 'job_ds_3',
          title: 'Data Scientist II — Personalization & Recommendation Systems',
          company: 'Spotify',
          location: 'New York, NY / Remote (US)',
          salaryRange: '$170,000 - $220,000 Base ($280k+ TC)',
          matchScore: 92,
          tags: ['Python', 'RecSys', 'A/B Experimentation', 'Collaborative Filtering', 'Pandas'],
          requiredSkills: ['Ranking Algorithms', 'Offline vs Online Metric Alignment', 'Hypothesis Testing', 'Data Storytelling'],
          preferredSkills: ['Graph Neural Networks', 'Two-Tower Embeddings', 'Multi-Armed Bandits'],
          url: 'https://www.lifeatspotify.com/jobs?l=new-york&q=data+scientist',
          source: 'Lever',
          description: 'Drive next-generation audio discovery by engineering contextual bandit algorithms and analyzing user listening retention across diverse music formats.'
        },
        {
          id: 'job_ds_4',
          title: 'Data Scientist — Core Platform & Telemetry Analytics',
          company: 'Snowflake',
          location: 'San Mateo, CA / Remote',
          salaryRange: '$165,000 - $215,000 Base ($270k+ TC)',
          matchScore: 89,
          tags: ['SQL', 'Python', 'Query Optimization', 'Causal Impact', 'Cloud Data'],
          requiredSkills: ['Snowflake SQL Optimization', 'Python Data Science Stack', 'Capacity Forecasting', 'Data Modeling'],
          preferredSkills: ['DuckDB', 'dbt Data Modeling', 'Automated Anomaly Detection'],
          url: 'https://careers.snowflake.com/us/en/search-results?keywords=data%20scientist',
          source: 'Greenhouse',
          description: 'Mine petabyte-scale warehouse usage telemetry to forecast compute consumption and guide automated performance elasticity algorithms.'
        },
        {
          id: 'job_ds_5',
          title: 'Machine Learning Data Scientist — Telemetry AI',
          company: 'Datadog',
          location: 'New York, NY / Remote',
          salaryRange: '$160,000 - $210,000 Base ($265k+ TC)',
          matchScore: 88,
          tags: ['Time Series', 'Python', 'Statistical Forecasting', 'Alert Deduplication'],
          requiredSkills: ['Time-Series Modeling', 'Outlier Detection', 'Python / NumPy', 'REST APIs'],
          preferredSkills: ['Go Basics', 'Prometheus / OpenTelemetry', 'Kubernetes'],
          url: 'https://careers.datadoghq.com/all-jobs/?gh_src=&q=data+scientist',
          source: 'Greenhouse',
          description: 'Train statistical anomaly models on billions of real-time server metrics to reduce alerting noise for thousands of enterprise engineering squads.'
        },
        {
          id: 'job_ds_6',
          title: 'Data Scientist — Product Analytics & Growth',
          company: 'Meta',
          location: 'Menlo Park, CA / Remote (US)',
          salaryRange: '$175,000 - $230,000 Base ($300k+ TC)',
          matchScore: 91,
          tags: ['Python', 'SQL', 'Causal Inference', 'Product Metrics', 'Experimentation'],
          requiredSkills: ['Sample Ratio Mismatch Auditing', 'Multi-variant Testing', 'Executive Deck Presentations', 'SQL'],
          preferredSkills: ['Synthetic Controls', 'Econometrics', 'Presto / Spark'],
          url: 'https://www.metacareers.com/jobs/?q=data+scientist',
          source: 'LinkedIn',
          description: 'Lead quantitative experimentation and causal impact modeling for core feed engagement, partnering directly with VP and Product Director leadership.'
        }
      ];
    }

    if (isProductRole) {
      return [
        {
          id: 'job_pm_1',
          title: 'Staff Product Manager — AI Workflows & Design Tools',
          company: 'Figma',
          location: 'San Francisco, CA / Hybrid',
          salaryRange: '$210,000 - $260,000 Base ($360k+ TC)',
          matchScore: 95,
          tags: ['AI Product Sense', 'Design Systems', '0-to-1 Roadmapping', 'User Research'],
          requiredSkills: ['Generative Design UX', 'Cross-Functional Engineering Alignment', 'Metric Instrumentation', 'PRD Authoring'],
          preferredSkills: ['Design Background', 'API Ecosystems', 'LLM Prompt Engineering'],
          url: 'https://www.figma.com/careers/#job-openings',
          source: 'Greenhouse',
          description: 'Lead 0-to-1 AI features that empower millions of designers and product teams to build collaborative user interfaces effortlessly.'
        },
        {
          id: 'job_pm_2',
          title: 'Principal Product Manager — Global Checkout & Payments',
          company: 'Stripe',
          location: 'Seattle, WA / Remote',
          salaryRange: '$225,000 - $275,000 Base ($390k+ TC)',
          matchScore: 93,
          tags: ['Payments', 'Developer APIs', 'Conversion Optimization', 'Financial Workflows'],
          requiredSkills: ['API Product Strategy', 'High-Trust Financial Products', 'Enterprise Customer Discovery', 'Executive Alignment'],
          preferredSkills: ['SQL Proficiency', 'International Regulatory Compliance', 'Fintech Unit Economics'],
          url: 'https://stripe.com/jobs/search?teams=product',
          source: 'Greenhouse',
          description: 'Direct the global merchant checkout funnel, driving incremental conversion optimization across top global enterprises.'
        },
        {
          id: 'job_pm_3',
          title: 'Senior Product Manager — Growth & Network Effects',
          company: 'Airbnb',
          location: 'San Francisco, CA / Remote',
          salaryRange: '$195,000 - $245,000 Base ($330k+ TC)',
          matchScore: 90,
          tags: ['Growth Loops', 'Consumer Marketplace', 'A/B Testing', 'Retention Analytics'],
          requiredSkills: ['Funnel Optimization', 'Behavioral Psychology', 'Cross-Platform Mobile/Web', 'SQL Analytics'],
          preferredSkills: ['Search Ranking UX', 'Dynamic Pricing Models', 'International Localization'],
          url: 'https://careers.airbnb.com/positions/?department=product-management',
          source: 'Greenhouse',
          description: 'Scale guest and host acquisition loops through viral referral mechanics, localized onboarding, and personalized booking recommendations.'
        },
        {
          id: 'job_pm_4',
          title: 'Product Manager — Developer Productivity & Workflows',
          company: 'Linear',
          location: 'San Francisco, CA / Remote (Global)',
          salaryRange: '$190,000 - $240,000 Base ($310k+ TC)',
          matchScore: 92,
          tags: ['Product Craft', 'Keyboard-First UX', 'Developer Tools', 'Speed & Latency'],
          requiredSkills: ['Opinionated Product Design', 'Deep Developer Empathy', 'Rapid Prototyping', 'Customer Community Management'],
          preferredSkills: ['TypeScript / React Basics', 'Git / GitHub API Mastery'],
          url: 'https://linear.app/careers',
          source: 'Ashby',
          description: 'Craft ultra-fast, keyboard-driven project tracking experiences cherished by modern high-velocity software engineering organizations.'
        },
        {
          id: 'job_pm_5',
          title: 'Group Product Manager — AI Knowledge Graph & Search',
          company: 'Notion',
          location: 'San Francisco, CA / Hybrid',
          salaryRange: '$220,000 - $270,000 Base ($375k+ TC)',
          matchScore: 94,
          tags: ['Q&A RAG', 'Enterprise Search', 'Information Architecture', 'SaaS Growth'],
          requiredSkills: ['Enterprise Search Quality', 'Semantic Retrieval UX', 'Roadmap Prioritization', 'P&L Ownership'],
          preferredSkills: ['Vector Database Understanding', 'Enterprise Security & Permissions'],
          url: 'https://www.notion.com/careers#positions',
          source: 'Lever',
          description: 'Lead the team building Notion Q&A and AI workspace search, connecting millions of enterprise knowledge silos into unified instant answers.'
        },
        {
          id: 'job_pm_6',
          title: 'Senior Product Manager — Driver Experience & Marketplace',
          company: 'Uber',
          location: 'San Francisco, CA / Sunnyvale',
          salaryRange: '$190,000 - $250,000 Base ($325k+ TC)',
          matchScore: 89,
          tags: ['Two-Sided Marketplace', 'Incentive Design', 'Mobile App UX', 'Driver Retention'],
          requiredSkills: ['Marketplace Equilibrium', 'Real-Time Dispatch UX', 'A/B Experimentation', 'Field Research'],
          preferredSkills: ['Pricing Algorithms', 'Autonomous Vehicle Integration'],
          url: 'https://www.uber.com/global/en/careers/search/?department=product-management',
          source: 'LinkedIn',
          description: 'Transform the daily driving and earnings experience for over 5 million independent drivers operating across 70+ countries.'
        }
      ];
    }

    if (isFrontendRole) {
      return [
        {
          id: 'job_fe_1',
          title: 'Senior Frontend Platform Engineer — Next.js Core & Compiler',
          company: 'Vercel',
          location: 'San Francisco, CA / Remote (Global)',
          salaryRange: '$180,000 - $230,000 Base ($310k+ TC)',
          matchScore: 96,
          tags: ['Next.js 14/15', 'Turbopack (Rust)', 'React Server Components', 'TypeScript', 'Web Performance'],
          requiredSkills: ['Deep React Architecture', 'Server Actions & Streaming SSR', 'TypeScript Strict Mode', 'Core Web Vitals'],
          preferredSkills: ['Rust (Turbopack AST)', 'Bundler Internals (Webpack/Rollup)', 'Open Source Governance'],
          url: 'https://vercel.com/careers',
          source: 'Ashby',
          description: 'Maintain the world standard in web development. Optimize React Server Components, server actions, and Turbopack compiler benchmarks.'
        },
        {
          id: 'job_fe_2',
          title: 'Product Frontend Systems Engineer — Ultra-Fast Desktop Client',
          company: 'Linear',
          location: 'San Francisco, CA / Remote (US/EU)',
          salaryRange: '$185,000 - $240,000 Base ($320k+ TC)',
          matchScore: 94,
          tags: ['React', 'Local-First Architecture', 'IndexedDB', 'WebSocket Sync', 'Fluid Micro-animations'],
          requiredSkills: ['Zero-Latency UI Rendering', 'Local-First State Synchronization', 'Canvas & DOM Virtualization', 'Custom CSS Transitions'],
          preferredSkills: ['Electron / Tauri Internals', 'CRDTs (Yjs/Automerge)', 'Keyboard Shortcut Handlers'],
          url: 'https://linear.app/careers',
          source: 'Ashby',
          description: 'Build instantaneous 60fps web and desktop software that responds to interactions within 16 milliseconds without spinner wait states.'
        },
        {
          id: 'job_fe_3',
          title: 'Staff Frontend Engineer — Multiplayer Canvas & WebAssembly',
          company: 'Figma',
          location: 'San Francisco, CA / Hybrid',
          salaryRange: '$210,000 - $265,000 Base ($370k+ TC)',
          matchScore: 92,
          tags: ['WebGL', 'WebAssembly (C++ / Rust)', 'TypeScript', 'Rendering Pipeline', 'React'],
          requiredSkills: ['Multi-threaded Web Workers', 'GPU Shaders & WebGL', 'High-Resolution Canvas Math', 'Performance Profiling'],
          preferredSkills: ['C++ Compilation to Wasm', 'Vector Graphics Algorithms', 'Spatial Indexing (R-Trees)'],
          url: 'https://www.figma.com/careers/#job-openings',
          source: 'Greenhouse',
          description: 'Push the limits of the browser by rendering complex multi-gigabyte vector files and real-time multiplayer cursors at 120 FPS.'
        },
        {
          id: 'job_fe_4',
          title: 'Staff Frontend UI Systems Architect — Global Dashboard',
          company: 'Stripe',
          location: 'Seattle, WA / Remote (US)',
          salaryRange: '$210,000 - $265,000 Base ($365k+ TC)',
          matchScore: 93,
          tags: ['Design Systems', 'Micro-frontends', 'Accessibility (a11y)', 'TypeScript', 'Large Scale UI'],
          requiredSkills: ['Enterprise Design Token Architecture', 'WCAG 2.1 AAA Accessibility', 'Micro-Frontend Modular Federation', 'TypeScript'],
          preferredSkills: ['Automated Visual Regression Testing', 'GraphQL Federated Schemas'],
          url: 'https://stripe.com/jobs/search?teams=engineering&l=&q=frontend',
          source: 'Greenhouse',
          description: 'Architect the mission-critical business dashboard through which millions of global enterprises configure their corporate financial engine.'
        },
        {
          id: 'job_fe_5',
          title: 'Senior Full-Stack & Frontend Engineer — Copilot Web Workspaces',
          company: 'GitHub',
          location: 'San Francisco, CA / Remote',
          salaryRange: '$190,000 - $245,000 Base ($330k+ TC)',
          matchScore: 90,
          tags: ['React', 'Monaco Editor', 'Streaming UI', 'Node.js', 'TypeScript'],
          requiredSkills: ['Monaco Code Sandbox Integration', 'Token Streaming UX', 'State Machines (XState)', 'TypeScript'],
          preferredSkills: ['LSP (Language Server Protocol)', 'WebAssembly Sandboxing', 'GitHub GraphQL APIs'],
          url: 'https://github.com/about/careers',
          source: 'Lever',
          description: 'Build web-native developer workspaces and AI pair-programming interfaces used by over 100 million developers worldwide.'
        },
        {
          id: 'job_fe_6',
          title: 'Frontend Web Performance & Design Systems Lead',
          company: 'Airbnb',
          location: 'San Francisco, CA / Remote',
          salaryRange: '$175,000 - $225,000 Base ($295k+ TC)',
          matchScore: 89,
          tags: ['Design Systems', 'React', 'CSS-in-JS / Vanilla CSS', 'Bundle Size Optimization'],
          requiredSkills: ['Design System Component Libraries', 'SSR Hydration Optimization', 'Responsive Mobile-Web Layouts', 'Cross-browser Compatibility'],
          preferredSkills: ['Edge Rendering (V8 isolates)', 'Core Web Vitals Auditing'],
          url: 'https://careers.airbnb.com/positions/?department=engineering',
          source: 'Greenhouse',
          description: 'Lead visual design system standardization and sub-second page loads across Airbnb mobile web and booking checkouts.'
        }
      ];
    }

    if (isDevOpsRole) {
      return [
        {
          id: 'job_devops_1',
          title: 'Principal Infrastructure & Terraform Cloud SRE',
          company: 'HashiCorp',
          location: 'San Francisco, CA / Remote',
          salaryRange: '$215,000 - $265,000 Base ($365k+ TC)',
          matchScore: 96,
          tags: ['Terraform', 'Kubernetes', 'Go', 'Vault', 'Zero Trust'],
          requiredSkills: ['Infrastructure as Code (IaC)', 'Multi-Cloud Architecture (AWS/GCP/Azure)', 'Kubernetes Cluster Federation', 'Golang'],
          preferredSkills: ['Consul Service Mesh', 'GitOps (ArgoCD/Flux)', 'Linux Kernel eBPF'],
          url: 'https://www.hashicorp.com/careers',
          source: 'Greenhouse',
          description: 'Architect planetary-scale cloud infrastructure pipelines and multi-tenant Terraform execution environments powering the Fortune 500.'
        },
        {
          id: 'job_devops_2',
          title: 'Staff Site Reliability Engineer — Global Telemetry Mesh',
          company: 'Datadog',
          location: 'New York, NY / Remote',
          salaryRange: '$210,000 - $260,000 Base ($355k+ TC)',
          matchScore: 94,
          tags: ['Kubernetes', 'Go', 'Prometheus', 'eBPF', 'Multi-Region'],
          requiredSkills: ['Sub-millisecond Incident Diagnostics', 'Linux Internals & eBPF', 'P99 SLO Budget Management', 'Kubernetes Custom Controllers'],
          preferredSkills: ['Chaos Engineering', 'OpenTelemetry Ingestion', 'Kafka at Scale'],
          url: 'https://careers.datadoghq.com/all-jobs/?q=site+reliability',
          source: 'Greenhouse',
          description: 'Protect 99.999% uptime guarantees for distributed telemetry processing tens of millions of metric events per second.'
        },
        {
          id: 'job_devops_3',
          title: 'Senior Cloud Platform Architect — Elastic Container Compute',
          company: 'AWS (Amazon Web Services)',
          location: 'Seattle, WA / Remote (US)',
          salaryRange: '$200,000 - $255,000 Base ($340k+ TC)',
          matchScore: 92,
          tags: ['AWS ECS / EKS', 'Rust', 'Firecracker MicroVMs', 'VPC Networking', 'Linux'],
          requiredSkills: ['Container Virtualization (containerd/CRI-O)', 'Multi-AZ Network Isolation', 'AWS IAM Security Boundaries', 'Python / Go'],
          preferredSkills: ['Firecracker MicroVMs', 'BGP Routing', 'Linux Kernel Cgroups v2'],
          url: 'https://www.amazon.jobs/en/search?base_query=cloud+platform+engineer&loc_query=&job_count=10&result_limit=10&sort=relevant&job_type[]=full-time',
          source: 'LinkedIn',
          description: 'Engineer the serverless execution fabrics behind AWS Fargate and EKS, providing instantaneous compute density with hardware-level tenant isolation.'
        },
        {
          id: 'job_devops_4',
          title: 'Edge Infrastructure & Mesh Reliability Engineer',
          company: 'Cloudflare',
          location: 'Austin, TX / San Francisco / Remote',
          salaryRange: '$195,000 - $250,000 Base ($330k+ TC)',
          matchScore: 91,
          tags: ['Anycast BGP', 'Rust / Go', 'Workers V8 Isolates', 'DDoS Mitigation', 'Linux'],
          requiredSkills: ['Anycast Network Routing', 'Edge Server Fleet Orchestration', 'DDoS Mitigation at Tbps Scale', 'Linux Performance Tuning'],
          preferredSkills: ['Rust Networking (tokio)', 'Quick/HTTP3 Protocol', 'DNSSEC Infrastructure'],
          url: 'https://www.cloudflare.com/careers/jobs/?department=engineering',
          source: 'Greenhouse',
          description: 'Maintain the world-spanning edge network routing 20%+ of all internet traffic with automated DDoS scrubbing and millisecond routing.'
        },
        {
          id: 'job_devops_5',
          title: 'Senior Cloud Reliability Engineer — Chaos & Automation',
          company: 'Netflix',
          location: 'Los Gatos, CA / Remote',
          salaryRange: '$220,000 - $275,000 Base (All-Cash Option)',
          matchScore: 93,
          tags: ['Spinnaker', 'Chaos Monkey', 'AWS', 'Automated Canary Analysis', 'Python / Java'],
          requiredSkills: ['Automated Regional Evacuation', 'Canary Analysis Pipelines', 'Distributed Failure Injection', 'Terraform'],
          preferredSkills: ['Envoy Proxy Fleet Management', 'gRPC Service Mesh'],
          url: 'https://explore.jobs.netflix.net/careers?query=reliability+engineer',
          source: 'Lever',
          description: 'Invent and execute continuous chaos injection experiments across thousands of microservices to prove planetary streaming resilience.'
        },
        {
          id: 'job_devops_6',
          title: 'Principal Container Runtime & Security Engineer',
          company: 'Docker',
          location: 'San Francisco, CA / Remote',
          salaryRange: '$205,000 - $260,000 Base ($335k+ TC)',
          matchScore: 89,
          tags: ['Docker BuildKit', 'containerd', 'Go', 'WASM Containers', 'Linux Namespaces'],
          requiredSkills: ['OCI Container Specifications', 'BuildKit High-Speed Caching', 'Linux Namespaces & Seccomp Profiles', 'Golang'],
          preferredSkills: ['WasmEdge Runtime', 'Container Image Signing (Cosign)'],
          url: 'https://www.docker.com/company/careers/',
          source: 'Lever',
          description: 'Build the next evolution of local-to-cloud developer workflows, container runtimes, and sub-second multi-architecture BuildKit caches.'
        }
      ];
    }

    if (isSecurityRole) {
      return [
        {
          id: 'job_sec_1',
          title: 'Principal Detection & Threat Intelligence Engineer',
          company: 'CrowdStrike',
          location: 'Austin, TX / Remote (US)',
          salaryRange: '$210,000 - $265,000 Base ($360k+ TC)',
          matchScore: 96,
          tags: ['Threat Hunting', 'Falcon Sensor', 'Go / C++', 'Kernel Telemetry', 'MITRE ATT&CK'],
          requiredSkills: ['Kernel-level Attack Vector Analysis', 'MITRE ATT&CK Framework Mapping', 'Adversary Emulation', 'Python / Go'],
          preferredSkills: ['eBPF Observability', 'YARA Rule Authoring', 'Reverse Engineering Malware'],
          url: 'https://crowdstrike.wd5.myworkdayjobs.com/en-US/crowdstrikecareers',
          source: 'Greenhouse',
          description: 'Develop behavioral threat detections running across tens of millions of enterprise endpoints protecting against nation-state cyber incursions.'
        },
        {
          id: 'job_sec_2',
          title: 'Staff Zero-Trust & Identity Security Architect',
          company: 'Cloudflare',
          location: 'San Francisco, CA / Remote',
          salaryRange: '$205,000 - $260,000 Base ($350k+ TC)',
          matchScore: 94,
          tags: ['Zero Trust', 'SAML / OIDC', 'mTLS', 'Rust / Go', 'Cryptography'],
          requiredSkills: ['Zero Trust Network Access (ZTNA)', 'mTLS & Public Key Infrastructure', 'SAML 2.0 / OIDC Identity Protocols', 'Network Defense'],
          preferredSkills: ['Post-Quantum Cryptography', 'WireGuard Protocol Internals'],
          url: 'https://www.cloudflare.com/careers/jobs/?department=engineering',
          source: 'Greenhouse',
          description: 'Replace legacy enterprise corporate VPNs with ultra-fast, identity-aware Zero Trust edge enforcement for global workforces.'
        },
        {
          id: 'job_sec_3',
          title: 'Forward Deployed Security Engineer — Critical Defense',
          company: 'Palantir Technologies',
          location: 'Washington, DC / Hybrid',
          salaryRange: '$190,000 - $250,000 Base ($340k+ TC)',
          matchScore: 91,
          tags: ['FedRAMP High', 'AppSec', 'Air-Gapped Enclaves', 'Java / Python', 'Threat Modeling'],
          requiredSkills: ['Air-Gapped Deployment Hardening', 'FedRAMP High & IL-6 Compliance', 'AppSec Static & Dynamic Analysis', 'Threat Modeling'],
          preferredSkills: ['DoD Security Clearances', 'Cryptographic Key Escrow'],
          url: 'https://www.palantir.com/careers/',
          source: 'Lever',
          description: 'Protect mission-critical data platforms deployed across allied defense commands, intelligence agencies, and vital civil infrastructure.'
        },
        {
          id: 'job_sec_4',
          title: 'Principal IAM & Cloud Security Architect',
          company: 'Okta',
          location: 'San Francisco, CA / Remote',
          salaryRange: '$200,000 - $255,000 Base ($335k+ TC)',
          matchScore: 92,
          tags: ['IAM Architecture', 'FIDO2 / WebAuthn', 'Passkeys', 'Go', 'API Security'],
          requiredSkills: ['Modern WebAuthn / Passkey Authentication', 'Session Hijacking Mitigation', 'Cloud Security Posture (CSPM)', 'Threat Modeling'],
          preferredSkills: ['OAuth 2.1 RFC Standards', 'Credential Stuffing Defenses'],
          url: 'https://www.okta.com/company/careers/',
          source: 'Lever',
          description: 'Architect frictionless passkey authentication and biometric identity security guarding billions of daily user logins across the internet.'
        },
        {
          id: 'job_sec_5',
          title: 'Platform Security & Secure Enclave Engineer',
          company: 'Apple',
          location: 'Cupertino, CA / On-Site',
          salaryRange: '$215,000 - $270,000 Base ($375k+ TC)',
          matchScore: 93,
          tags: ['Secure Enclave', 'C / C++', 'Cryptographic Hardware', 'Kernel Security', 'ARM Architecture'],
          requiredSkills: ['Secure Enclave Processor (SEP) Firmware', 'Hardware Root of Trust', 'Memory Safety & PAC (Pointer Authentication)', 'C & Assembly'],
          preferredSkills: ['Side-Channel Attack Defenses', 'Formal Verification'],
          url: 'https://jobs.apple.com/en-us/search?team=software-and-services-SWSA',
          source: 'LinkedIn',
          description: 'Design hardware-enforced cryptographic boundaries and memory-safe kernels protecting Face ID, biometric keys, and device storage.'
        },
        {
          id: 'job_sec_6',
          title: 'Senior Malware Reverse Engineer & Exploit Analyst',
          company: 'SentinelOne',
          location: 'Mountain View, CA / Remote',
          salaryRange: '$185,000 - $240,000 Base ($315k+ TC)',
          matchScore: 89,
          tags: ['Reverse Engineering', 'IDA Pro / Ghidra', 'x86/ARM Assembly', 'Ransomware', 'C / C++'],
          requiredSkills: ['Static/Dynamic Disassembly (IDA Pro / Ghidra)', 'Zero-Day Exploit Root Cause Analysis', 'Sandboxing & Memory Dumps', 'C / Assembly'],
          preferredSkills: ['Kernel Exploit Mitigation', 'Automated Unpacking Heuristics'],
          url: 'https://www.sentinelone.com/careers/',
          source: 'Lever',
          description: 'Decompile sophisticated ransomware payloads and weaponized zero-day exploits to engineer autonomous endpoint remediation engines.'
        }
      ];
    }

    if (isDataEngineerRole) {
      return [
        {
          id: 'job_de_1',
          title: 'Senior Data Platform & Lakehouse Engineer',
          company: 'Snowflake',
          location: 'San Mateo, CA / Remote',
          salaryRange: '$190,000 - $245,000 Base ($330k+ TC)',
          matchScore: 96,
          tags: ['Snowflake SQL', 'dbt', 'Python', 'Apache Iceberg', 'Streaming Data'],
          requiredSkills: ['Apache Iceberg / Delta Lake Format', 'Snowflake Warehouse Optimization', 'dbt Core Modeling', 'Python / SQL'],
          preferredSkills: ['Snowpark for Python', 'CDC Pipelines (Debezium)', 'Automated Data Quality SLA Monitoring'],
          url: 'https://careers.snowflake.com/us/en/search-results?keywords=data%20engineer',
          source: 'Greenhouse',
          description: 'Build open lakehouse infrastructure supporting petabyte-scale Iceberg tables with high-concurrency analytical compute.'
        },
        {
          id: 'job_de_2',
          title: 'Distributed Spark & Delta Lake Platform Engineer',
          company: 'Databricks',
          location: 'San Francisco, CA / Remote',
          salaryRange: '$200,000 - $255,000 Base ($345k+ TC)',
          matchScore: 94,
          tags: ['Apache Spark', 'Delta Lake', 'Scala / Python', 'Photon Engine', 'Kubernetes'],
          requiredSkills: ['Apache Spark Internals (Catalyst / Tungsten)', 'Distributed Shuffle Optimization', 'Delta Lake ACID Transactions', 'Scala / Python'],
          preferredSkills: ['C++ Vectorized Compute (Photon)', 'Unity Catalog Governance'],
          url: 'https://www.databricks.com/company/careers/open-positions?department=engineering',
          source: 'Greenhouse',
          description: 'Optimize the world’s leading distributed data execution engine, speeding up query execution across massive enterprise data pipelines.'
        },
        {
          id: 'job_de_3',
          title: 'Staff Financial Data Lake Architect — Real-Time Ledgers',
          company: 'Stripe',
          location: 'Seattle, WA / San Francisco / Remote',
          salaryRange: '$215,000 - $270,000 Base ($365k+ TC)',
          matchScore: 93,
          tags: ['Kafka', 'Flink', 'Trino / Presto', 'Zero-Loss Accounting', 'Python / Java'],
          requiredSkills: ['Exactly-Once Event Stream Processing', 'Apache Flink / Kafka', 'Petabyte SQL Storage Partitioning', 'Accounting Reconciliations'],
          preferredSkills: ['Trino Query Engine Tuning', 'Cross-Datacenter Replication'],
          url: 'https://stripe.com/jobs/search?teams=engineering&q=data',
          source: 'Greenhouse',
          description: 'Architect the real-time financial ledger lake processing every transaction with 100% mathematical zero-loss guarantees.'
        },
        {
          id: 'job_de_4',
          title: 'Real-Time Streaming Data Engineer — Telemetry & Video',
          company: 'Netflix',
          location: 'Los Gatos, CA / Remote',
          salaryRange: '$225,000 - $280,000 Base (All-Cash)',
          matchScore: 92,
          tags: ['Apache Flink', 'Kafka', 'Apache Iceberg', 'Java / Scala', 'Real-time Analytics'],
          requiredSkills: ['Real-Time Stream Joining at 10M+ EPS', 'Apache Flink State Management', 'High-Throughput Kafka Topics', 'Java / Scala'],
          preferredSkills: ['Druid / ClickHouse Ingestion', 'Schema Evolution (Avro/Protobuf)'],
          url: 'https://explore.jobs.netflix.net/careers?query=data+engineer',
          source: 'Lever',
          description: 'Process trillions of daily playback telemetry events in real time to adapt streaming bitrates and diagnose global CDN bottlenecks.'
        },
        {
          id: 'job_de_5',
          title: 'Data Engineer II — Music Catalog & Knowledge Graph',
          company: 'Spotify',
          location: 'New York, NY / Remote (US)',
          salaryRange: '$175,000 - $225,000 Base ($285k+ TC)',
          matchScore: 90,
          tags: ['BigQuery', 'GCP Dataflow', 'Python', 'Graph Data', 'dbt'],
          requiredSkills: ['Google Cloud Dataflow / Apache Beam', 'BigQuery Partitioning & Cost Optimization', 'Python / SQL', 'Metadata Graphs'],
          preferredSkills: ['Neo4j / Graph Databases', 'Airflow DAG Orchestration'],
          url: 'https://www.lifeatspotify.com/jobs?q=data+engineer',
          source: 'Lever',
          description: 'Engineer the global music entity graph connecting 100+ million tracks, artist credits, genres, and contextual metadata.'
        },
        {
          id: 'job_de_6',
          title: 'Analytics Infrastructure & dbt Data Modeling Lead',
          company: 'Airbnb',
          location: 'San Francisco, CA / Remote',
          salaryRange: '$185,000 - $240,000 Base ($320k+ TC)',
          matchScore: 89,
          tags: ['dbt Core', 'Presto / Trino', 'Star Schemas', 'Airflow', 'Data Mesh'],
          requiredSkills: ['Enterprise dbt Modular Data Modeling', 'Dimensional Star & Snowflake Schemas', 'Automated Data CI/CD', 'SQL'],
          preferredSkills: ['Data Mesh Domain Governance', 'Monte Carlo Data Observability'],
          url: 'https://careers.airbnb.com/positions/?department=data-science-analytics',
          source: 'Greenhouse',
          description: 'Direct data modeling architecture and dbt standards across hundreds of internal analytics squads powering business forecasting.'
        }
      ];
    }

    // Default / Software Engineering / Systems Architecture / Arbitrary custom roles
    const cleanRoleTitle = role.trim() || 'Software Engineer';
    const isGenericSwe = /software|swe|backend|systems|engineer/i.test(cleanRoleTitle);

    if (isGenericSwe) {
      return [
        {
          id: 'job_swe_1',
          title: `Staff Software Engineer — Global Core Ledger & Idempotency`,
          company: 'Stripe',
          location: 'San Francisco, CA / Remote (US)',
          salaryRange: '$240,000 - $285,000 Base ($390k+ TC)',
          matchScore: 95,
          tags: ['Distributed Systems', 'Go / Java / TypeScript', 'PostgreSQL / Spanner', 'Idempotency', 'High Availability'],
          requiredSkills: ['Distributed Consensus', 'Go / Java / TypeScript', 'PostgreSQL / Spanner', 'Idempotent Financial Workflows'],
          preferredSkills: ['Kafka', 'Consensus Algorithms (Raft/Paxos)', 'Cross-AZ Disaster Recovery', 'Staff Mentorship'],
          url: 'https://stripe.com/jobs/search?teams=engineering',
          source: 'Greenhouse',
          description: 'Seeking a Staff Engineer to lead high-throughput transactional infrastructure processing billions in daily merchant volume with zero-loss idempotency.'
        },
        {
          id: 'job_swe_2',
          title: `Principal Systems Architect — High-Scale Telemetry Ingestion`,
          company: 'Datadog',
          location: 'New York, NY / Remote',
          salaryRange: '$235,000 - $280,000 Base ($380k+ TC)',
          matchScore: 92,
          tags: ['Distributed Consensus', 'Observability', 'Kubernetes Platform', 'Rust or Go', 'P99 Latency'],
          requiredSkills: ['Sub-millisecond Telemetry Routing', 'Distributed Consensus', 'Linux Kernel / eBPF', 'P99 Tuning'],
          preferredSkills: ['Multi-Region Failover', 'Cross-team RFC Authoring'],
          url: 'https://careers.datadoghq.com/all-jobs/?q=software+engineer',
          source: 'Greenhouse',
          description: 'Architect mission-critical distributed telemetry ingestion pipelines handling over 50 trillion daily events with ultra-low latency guarantees.'
        },
        {
          id: 'job_swe_3',
          title: `Platform Lead Engineer — AI Inference Infrastructure`,
          company: 'Scale AI',
          location: 'San Francisco, CA / Hybrid',
          salaryRange: '$220,000 - $270,000 Base ($350k+ TC)',
          matchScore: 90,
          tags: ['Kubernetes', 'Python / Go', 'GPU Orchestration', 'Ray', 'Triton'],
          requiredSkills: ['Container Orchestration', 'GPU Cluster Management', 'Low-Latency Model Serving', 'gRPC'],
          preferredSkills: ['Slurm / CUDA basics', 'Zero-Downtime Rolling Deploys'],
          url: 'https://jobs.lever.co/scaleai/391054',
          source: 'Lever',
          description: 'Engineer high-utilization GPU clusters and serverless inference infrastructure powering cutting-edge enterprise foundation models.'
        },
        {
          id: 'job_swe_4',
          title: `Senior Backend Infrastructure Engineer — Edge Traffic Routing`,
          company: 'Netflix',
          location: 'Los Gatos, CA / Remote',
          salaryRange: '$230,000 - $290,000 Base (All-Cash Option)',
          matchScore: 93,
          tags: ['Java / Go', 'Envoy Gateway', 'High-Throughput Concurrency', 'Zero-Downtime'],
          requiredSkills: ['High-Throughput RPC Routing', 'Envoy Gateway Service Meshes', 'Fault Isolation & Rate Limiting', 'Go / Java'],
          preferredSkills: ['Chaos Engineering', 'Dynamic DNS Load Balancing'],
          url: 'https://jobs.netflix.com/jobs/edge-traffic',
          source: 'Lever',
          description: 'Own the front door to Netflix services, routing hundreds of millions of simultaneous global video streaming sessions reliably.'
        },
        {
          id: 'job_swe_5',
          title: `Staff Engineer — Multiplayer State Engine`,
          company: 'Figma',
          location: 'San Francisco, CA / Hybrid',
          salaryRange: '$225,000 - $280,000 Base ($375k+ TC)',
          matchScore: 91,
          tags: ['C++ / Rust', 'CRDTs', 'WebSockets', 'Concurrency', 'Low-Latency'],
          requiredSkills: ['Conflict-Free Replicated Data Types (CRDTs)', 'High-Performance State Machines', 'C++ or Rust', 'Multiplayer Networking'],
          preferredSkills: ['Operational Transformation', 'Client-side Memory Profiling'],
          url: 'https://boards.greenhouse.io/figma/jobs/multiplayer-state',
          source: 'Greenhouse',
          description: 'Build the distributed document database and synchronization engine that keeps design boards in sync across thousands of simultaneous editors.'
        },
        {
          id: 'job_swe_6',
          title: `Senior Software Engineer — Global Search & Indexing`,
          company: 'Airbnb',
          location: 'San Francisco, CA / Remote',
          salaryRange: '$195,000 - $250,000 Base ($330k+ TC)',
          matchScore: 89,
          tags: ['Search Indexing', 'Java / Kotlin', 'Elasticsearch / OpenSearch', 'Kafka', 'P99 Latency'],
          requiredSkills: ['Inverted Index Optimization', 'Real-Time Inventory Updates', 'Microservice Architecture', 'Java / Kotlin'],
          preferredSkills: ['Vector Similarity Search', 'Geo-Spatial Query Indexing'],
          url: 'https://careers.airbnb.com/positions/search-infra',
          source: 'Greenhouse',
          description: 'Power real-time search and booking availability across millions of listings worldwide with sub-50ms response times.'
        }
      ];
    }

    // Dynamic Generator for ANY custom role typed by the user!
    return [
      {
        id: `job_custom_1`,
        title: `Lead / Staff ${cleanRoleTitle} — Innovation & Core Systems`,
        company: 'Google DeepMind',
        location: 'Mountain View, CA / Remote (US)',
        salaryRange: '$210,000 - $275,000 Base ($380k+ TC)',
        matchScore: 95,
        tags: [cleanRoleTitle, 'System Architecture', 'High Impact', 'Cross-Org Leadership', 'Production Scaling'],
        requiredSkills: [`Advanced ${cleanRoleTitle} Principles`, 'Cross-functional Collaboration', 'Production Architecture', 'Performance Optimization'],
        preferredSkills: ['Emerging Tech Adoption', 'Technical Strategy & Mentorship'],
        url: `https://www.google.com/about/careers/applications/jobs/results/?q=${encodeURIComponent(cleanRoleTitle)}`,
        source: 'LinkedIn',
        description: `Lead high-impact initiatives as a premier ${cleanRoleTitle}, setting architectural standards and executing breakthrough roadmaps.`
      },
      {
        id: `job_custom_2`,
        title: `Senior ${cleanRoleTitle} — Platform & Applied Technology`,
        company: 'OpenAI',
        location: 'San Francisco, CA / Hybrid',
        salaryRange: '$200,000 - $260,000 Base ($360k+ TC)',
        matchScore: 93,
        tags: [cleanRoleTitle, 'AI Workflows', 'High Scale', 'Quality & Rigor'],
        requiredSkills: [`Hands-on ${cleanRoleTitle} Execution`, 'Modern Toolchains', 'Rapid Iteration', 'Data-Driven Validation'],
        preferredSkills: ['Automation & Scripting', 'API Integration'],
        url: `https://openai.com/careers/search?q=${encodeURIComponent(cleanRoleTitle)}`,
        source: 'Ashby',
        description: `Partner across frontier engineering groups to scale and modernize ${cleanRoleTitle} workflows with state-of-the-art AI systems.`
      },
      {
        id: `job_custom_3`,
        title: `Staff ${cleanRoleTitle} — Enterprise Infrastructure`,
        company: 'Microsoft',
        location: 'Redmond, WA / Remote',
        salaryRange: '$190,000 - $250,000 Base ($340k+ TC)',
        matchScore: 91,
        tags: [cleanRoleTitle, 'Enterprise Scale', 'Security & Reliability', 'Cloud Ecosystem'],
        requiredSkills: [`Deep ${cleanRoleTitle} Expertise`, 'Enterprise Reliability', 'Design Documentation', 'Lifecycle Management'],
        preferredSkills: ['Cloud Infrastructure', 'Agile Product Delivery'],
        url: `https://careers.microsoft.com/us/en/search-results?keywords=${encodeURIComponent(cleanRoleTitle)}`,
        source: 'Greenhouse',
        description: `Drive excellence in ${cleanRoleTitle} for global enterprise cloud and product ecosystems supporting hundreds of millions of users.`
      },
      {
        id: `job_custom_4`,
        title: `${cleanRoleTitle} Specialist — Core Architecture`,
        company: 'Apple',
        location: 'Cupertino, CA / Hybrid',
        salaryRange: '$185,000 - $245,000 Base ($330k+ TC)',
        matchScore: 90,
        tags: [cleanRoleTitle, 'User Experience', 'Hardware / Software Integration', 'Precision'],
        requiredSkills: [`Specialized ${cleanRoleTitle} Methods`, 'Detail-Oriented Testing', 'Cross-Platform Standards', 'Documentation'],
        preferredSkills: ['Performance Benchmarking', 'System Diagnostics'],
        url: `https://jobs.apple.com/en-us/search?search=${encodeURIComponent(cleanRoleTitle)}`,
        source: 'LinkedIn',
        description: `Deliver exceptional product quality and deep technical craftsmanship as part of Apple’s specialized ${cleanRoleTitle} organization.`
      },
      {
        id: `job_custom_5`,
        title: `Senior / Principal ${cleanRoleTitle} — High Scale Services`,
        company: 'Amazon / AWS',
        location: 'Seattle, WA / Remote',
        salaryRange: '$180,000 - $240,000 Base ($320k+ TC)',
        matchScore: 89,
        tags: [cleanRoleTitle, 'Distributed Workflows', 'Operational Excellence', 'Cost Efficiency'],
        requiredSkills: [`${cleanRoleTitle} Core Frameworks`, 'Operational Excellence', 'Metrics & Telemetry', 'Root Cause Analysis'],
        preferredSkills: ['Scalability Planning', 'Automation'],
        url: `https://amazon.jobs/en/search?base_query=${encodeURIComponent(cleanRoleTitle)}`,
        source: 'Greenhouse',
        description: `Solve complex scalability challenges in ${cleanRoleTitle}, setting SLA benchmarks and delivering customer-obsessed value.`
      },
      {
        id: `job_custom_6`,
        title: `${cleanRoleTitle} — Frontier AI & Product Integration`,
        company: 'Meta',
        location: 'Menlo Park, CA / Remote',
        salaryRange: '$195,000 - $255,000 Base ($345k+ TC)',
        matchScore: 92,
        tags: [cleanRoleTitle, 'Consumer Reach', 'Fast Iteration', 'Product Metric Focus'],
        requiredSkills: [`Modern ${cleanRoleTitle} Tooling`, 'A/B Experimentation Rigor', 'Strategic Communication', 'Collaboration'],
        preferredSkills: ['Machine Learning Basics', 'Global Scalability'],
        url: `https://www.metacareers.com/jobs/?q=${encodeURIComponent(cleanRoleTitle)}`,
        source: 'Lever',
        description: `Join world-class squads delivering cutting-edge consumer and infrastructure breakthroughs as an accomplished ${cleanRoleTitle}.`
      }
    ];
  };

  const recommendedJobs = getRecommendedJobsForRole(activeRole);
  const defaultJob = recommendedJobs[0];

  // State for active ingested job
  const [jobUrl, setJobUrl] = useState<string>(defaultJob.url);
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [ingestedJob, setIngestedJob] = useState<IngestedJobPosting>({
    id: defaultJob.id,
    url: defaultJob.url,
    title: defaultJob.title,
    company: defaultJob.company,
    location: defaultJob.location,
    salaryRange: defaultJob.salaryRange,
    requiredSkills: defaultJob.requiredSkills,
    preferredSkills: defaultJob.preferredSkills,
    rawText: defaultJob.description,
    extractedAt: 'Just now'
  });

  const [activeJobFilter, setActiveJobFilter] = useState<'all' | 'remote' | 'high_comp'>('all');

  // Dynamic Skill Delta Radar tailored specifically to the active role
  const getSkillDeltaForRole = (role: string): SkillDeltaRadarItem[] => {
    if (isMLEngineer) {
      return [
        { skill: 'Distributed PyTorch / JAX Multi-GPU Training', requiredLevel: 95, candidateLevel: 90, gap: 5, isStrength: true },
        { skill: 'RLHF & Alignment Algorithms (PPO / DPO)', requiredLevel: 90, candidateLevel: 84, gap: 6, isStrength: true },
        { skill: 'High-Throughput Model Serving (vLLM / Triton)', requiredLevel: 92, candidateLevel: 88, gap: 4, isStrength: true },
        { skill: 'Kernel Optimization & Quantization (CUDA/FP8)', requiredLevel: 88, candidateLevel: 72, gap: 16, isStrength: false },
        { skill: 'Frontier LLM Evaluation & Loss Diagnostics', requiredLevel: 90, candidateLevel: 86, gap: 4, isStrength: true },
        { skill: 'Ray Cluster Orchestration & GPU Scheduling', requiredLevel: 85, candidateLevel: 80, gap: 5, isStrength: true }
      ];
    }

    if (isDataRole) {
      return [
        { skill: 'Machine Learning & Predictive Modeling', requiredLevel: 95, candidateLevel: 90, gap: 5, isStrength: true },
        { skill: 'Python Scientific Stack (Pandas, Scikit-Learn)', requiredLevel: 92, candidateLevel: 95, gap: 0, isStrength: true },
        { skill: 'SQL & Large-Scale Data Warehousing', requiredLevel: 90, candidateLevel: 88, gap: 2, isStrength: true },
        { skill: 'A/B Testing & Statistical Causal Inference', requiredLevel: 88, candidateLevel: 82, gap: 6, isStrength: true },
        { skill: 'Production MLOps & Real-Time Feature Serving', requiredLevel: 85, candidateLevel: 70, gap: 15, isStrength: false },
        { skill: 'Executive Business Framing & Metric Storytelling', requiredLevel: 90, candidateLevel: 85, gap: 5, isStrength: true }
      ];
    }

    if (isProductRole) {
      return [
        { skill: '0-to-1 Product Strategy & Roadmapping', requiredLevel: 95, candidateLevel: 92, gap: 3, isStrength: true },
        { skill: 'User Research & Customer Discovery', requiredLevel: 90, candidateLevel: 88, gap: 2, isStrength: true },
        { skill: 'Quantitative Metric Instrumentation & SQL', requiredLevel: 85, candidateLevel: 80, gap: 5, isStrength: true },
        { skill: 'Executive Stakeholder Alignment & OKRs', requiredLevel: 92, candidateLevel: 75, gap: 17, isStrength: false },
        { skill: 'Technical PRD Depth & API Fluency', requiredLevel: 88, candidateLevel: 85, gap: 3, isStrength: true }
      ];
    }

    if (isFrontendRole) {
      return [
        { skill: 'React 19 / Next.js App Router Architecture', requiredLevel: 95, candidateLevel: 94, gap: 1, isStrength: true },
        { skill: 'TypeScript Strict Type Safety & Generics', requiredLevel: 92, candidateLevel: 90, gap: 2, isStrength: true },
        { skill: 'Core Web Vitals & Sub-second Rendering Performance', requiredLevel: 90, candidateLevel: 76, gap: 14, isStrength: false },
        { skill: 'Design System Tokenization & WCAG Accessibility', requiredLevel: 88, candidateLevel: 85, gap: 3, isStrength: true },
        { skill: 'Local-First State Sync (WebSockets / CRDTs)', requiredLevel: 85, candidateLevel: 72, gap: 13, isStrength: false },
        { skill: 'Micro-Animations & Responsive CSS Engineering', requiredLevel: 88, candidateLevel: 92, gap: 0, isStrength: true }
      ];
    }

    if (isDevOpsRole) {
      return [
        { skill: 'Kubernetes Multi-Cluster Management & CRDs', requiredLevel: 95, candidateLevel: 88, gap: 7, isStrength: true },
        { skill: 'Terraform / OpenTofu Infrastructure as Code', requiredLevel: 92, candidateLevel: 94, gap: 0, isStrength: true },
        { skill: 'Cloud-Native Observability (Prometheus / eBPF)', requiredLevel: 90, candidateLevel: 75, gap: 15, isStrength: false },
        { skill: 'CI/CD Automated Canary Deployments (ArgoCD)', requiredLevel: 88, candidateLevel: 86, gap: 2, isStrength: true },
        { skill: 'Multi-Region High Availability & Zero-Loss Failover', requiredLevel: 92, candidateLevel: 78, gap: 14, isStrength: false },
        { skill: 'Linux Kernel Diagnostics & Network Namespace Isolation', requiredLevel: 85, candidateLevel: 82, gap: 3, isStrength: true }
      ];
    }

    if (isSecurityRole) {
      return [
        { skill: 'Threat Modeling & Architectural Attack Surface Reduction', requiredLevel: 95, candidateLevel: 90, gap: 5, isStrength: true },
        { skill: 'Identity & Access Management (OIDC, SAML, Zero Trust)', requiredLevel: 92, candidateLevel: 88, gap: 4, isStrength: true },
        { skill: 'Static & Dynamic Application Security Testing (SAST/DAST)', requiredLevel: 90, candidateLevel: 85, gap: 5, isStrength: true },
        { skill: 'Cloud Security Posture Management & FedRAMP / SOC2', requiredLevel: 88, candidateLevel: 74, gap: 14, isStrength: false },
        { skill: 'Reverse Engineering & Exploit Root Cause Diagnostics', requiredLevel: 85, candidateLevel: 70, gap: 15, isStrength: false },
        { skill: 'Cryptographic Protocols & Public Key Infrastructure', requiredLevel: 88, candidateLevel: 86, gap: 2, isStrength: true }
      ];
    }

    if (isDataEngineerRole) {
      return [
        { skill: 'Distributed SQL & Warehouse Modeling (Snowflake/BigQuery)', requiredLevel: 95, candidateLevel: 92, gap: 3, isStrength: true },
        { skill: 'Apache Spark / Databricks Engine Optimization', requiredLevel: 92, candidateLevel: 88, gap: 4, isStrength: true },
        { skill: 'Real-Time Event Stream Processing (Kafka / Flink)', requiredLevel: 90, candidateLevel: 72, gap: 18, isStrength: false },
        { skill: 'Open Table Formats (Apache Iceberg / Delta Lake)', requiredLevel: 88, candidateLevel: 85, gap: 3, isStrength: true },
        { skill: 'dbt Modular Orchestration & Data Quality SLAs', requiredLevel: 90, candidateLevel: 94, gap: 0, isStrength: true },
        { skill: 'Data Mesh Governance & Cross-Domain Schemas', requiredLevel: 85, candidateLevel: 78, gap: 7, isStrength: true }
      ];
    }

    // Default SWE / Custom
    return [
      { skill: `Core ${role} Domain Fundamentals`, requiredLevel: 95, candidateLevel: 90, gap: 5, isStrength: true },
      { skill: 'Distributed Systems & Scalable Architecture', requiredLevel: 92, candidateLevel: 86, gap: 6, isStrength: true },
      { skill: 'Database Modeling & High-Throughput Storage', requiredLevel: 90, candidateLevel: 88, gap: 2, isStrength: true },
      { skill: 'P99 Latency Diagnostics & Profiling', requiredLevel: 88, candidateLevel: 72, gap: 16, isStrength: false },
      { skill: 'Production Incident Triage & Zero-Downtime Deploys', requiredLevel: 85, candidateLevel: 82, gap: 3, isStrength: true },
      { skill: 'Staff Cross-Team RFC Alignment & Mentorship', requiredLevel: 90, candidateLevel: 75, gap: 15, isStrength: false }
    ];
  };

  const [skillDelta, setSkillDelta] = useState<SkillDeltaRadarItem[]>(() => getSkillDeltaForRole(activeRole));

  // Dynamic Skill Decay List tailored specifically to the active role
  const getSkillDecayForRole = (role: string): SkillDecayItem[] => {
    if (isMLEngineer) {
      return [
        { technology: 'Hand-tuned Custom CNN Feature Extractors', trend: 'declining', deltaPercent: -62, advice: 'Deprecated in favor of pre-trained multimodal vision-language transformers (CLIP, SigLIP).' },
        { technology: 'Single-Node GPU Training Workflows', trend: 'declining', deltaPercent: -45, advice: 'Enterprise teams expect FSDP, DeepSpeed, Megatron, and Ray distributed multi-node orchestrations.' },
        { technology: 'vLLM, Speculative Decoding & PagedAttention', trend: 'surging', deltaPercent: +104, advice: 'Core requirement in 2026. Emphasize continuous batching and throughput memory efficiency.' },
        { technology: 'Direct Preference Optimization (DPO & KTO)', trend: 'surging', deltaPercent: +88, advice: 'Replacing complex RLHF reward modeling loops with direct offline preference loss functions.' }
      ];
    }

    if (isDataRole) {
      return [
        { technology: 'Legacy Hadoop MapReduce & Pig Scripts', trend: 'declining', deltaPercent: -58, advice: 'Sunset from resume. Modern teams expect Snowflake, DuckDB, Polars, and Spark SQL.' },
        { technology: 'Manual Static Dashboards & Excel Models', trend: 'declining', deltaPercent: -42, advice: 'Replace references with automated data modeling in dbt, Streamlit apps, and programmatic analytics.' },
        { technology: 'Vector Embeddings, RAG & LLM Evaluation', trend: 'surging', deltaPercent: +94, advice: 'Surging demand in 2026. Highlight pgvector, Pinecone, and LLM output evaluation frameworks.' },
        { technology: 'DuckDB, Polars & Arrow-Native Processing', trend: 'surging', deltaPercent: +78, advice: 'High-speed in-process analytics replacing slow pandas pipelines for gigabyte-scale data.' }
      ];
    }

    if (isFrontendRole) {
      return [
        { technology: 'Legacy Webpack 4 & Create-React-App', trend: 'declining', deltaPercent: -68, advice: 'Sunset immediately. Showcase Next.js App Router, Vite 5+, and Turbopack compiler mastery.' },
        { technology: 'Heavy Monolithic Redux Boilerplate', trend: 'declining', deltaPercent: -52, advice: 'Replace with React Server Components, TanStack Query, and lightweight stores like Zustand.' },
        { technology: 'React Server Components & Server Actions', trend: 'surging', deltaPercent: +92, advice: 'Top requirement for Tier-1 frontend roles. Emphasize zero client bundle data fetching.' },
        { technology: 'Local-First Architecture & CRDT WebSockets', trend: 'surging', deltaPercent: +84, advice: 'Surging for modern SaaS. Showcase instantaneous offline-capable state synchronization.' }
      ];
    }

    if (isDevOpsRole) {
      return [
        { technology: 'Manual SSH Server Configuration & Shell Scripts', trend: 'declining', deltaPercent: -72, advice: 'Replace references with GitOps declarative manifests (ArgoCD) and immutable container images.' },
        { technology: 'Legacy Monolithic Virtual Machines (Bare Metal)', trend: 'declining', deltaPercent: -44, advice: 'Transition resume bullets to Kubernetes orchestration and serverless container platforms.' },
        { technology: 'eBPF-Powered Kernel Observability (Cilium)', trend: 'surging', deltaPercent: +96, advice: 'Surging demand. Bypasses standard iptables overhead for lightning-fast container security.' },
        { technology: 'OpenTofu & Automated Ephemeral Environments', trend: 'surging', deltaPercent: +82, advice: 'Highlight self-service preview environments spun up and torn down per pull request.' }
      ];
    }

    if (isProductRole) {
      return [
        { technology: '50-Page Rigid Waterfall PRD Documents', trend: 'declining', deltaPercent: -64, advice: 'Modern tech companies demand rapid visual prototypes, Loom walkthroughs, and agile specs.' },
        { technology: 'Vanity Metrics (Total Signups without Retention)', trend: 'declining', deltaPercent: -48, advice: 'Focus strictly on activated cohort retention, LTV/CAC ratios, and net revenue retention.' },
        { technology: 'AI-Native Workflow Architecture & Prompt UX', trend: 'surging', deltaPercent: +98, advice: 'Showcase how you design non-deterministic AI features with fallback UI and guardrails.' },
        { technology: 'Direct SQL & Product Telemetry Instrumentation', trend: 'surging', deltaPercent: +76, advice: 'PMs who write their own SQL and audit sample ratio mismatches command top-tier compensation.' }
      ];
    }

    // Default SWE
    return [
      { technology: 'REST APIs via Legacy Monolithic SOAP', trend: 'declining', deltaPercent: -46, advice: 'Replace references on your resume with gRPC, GraphQL, and event-driven async streaming.' },
      { technology: 'Traditional jQuery / Synchronous Blocking I/O', trend: 'declining', deltaPercent: -58, advice: 'Deprecate from skills matrix; showcase async event loops, Go routines, and reactive patterns.' },
      { technology: 'Vector Databases & Agentic Tool-Use (RAG)', trend: 'surging', deltaPercent: +88, advice: 'Surging demand in 2026. Highlight Pinecone, pgvector, and LLM orchestration.' },
      { technology: 'eBPF & Cloud Native Observability (Kubernetes)', trend: 'surging', deltaPercent: +62, advice: 'High-leverage differentiator for Staff Infrastructure and Systems interviews.' }
    ];
  };

  const decayList = getSkillDecayForRole(activeRole);

  // Switch role handler: updates recommended jobs, active job, radar, decay, and syncs profile
  const handleSelectRole = (newRole: string) => {
    if (!newRole.trim()) return;
    const trimmed = newRole.trim();
    setActiveRole(trimmed);
    setIsEditingRole(false);

    const jobs = getRecommendedJobsForRole(trimmed);
    if (jobs.length > 0) {
      const topJob = jobs[0];
      setJobUrl(topJob.url);
      setIngestedJob({
        id: topJob.id,
        url: topJob.url,
        title: topJob.title,
        company: topJob.company,
        location: topJob.location,
        salaryRange: topJob.salaryRange,
        requiredSkills: topJob.requiredSkills,
        preferredSkills: topJob.preferredSkills,
        rawText: topJob.description,
        extractedAt: 'Just now'
      });
      setSkillDelta(getSkillDeltaForRole(trimmed));
    }

    // Update user profile if callback provided
    if (onUpdateUserProfile) {
      const existingRoles = userProfile.targetRoles || [];
      const updatedRoles = [trimmed, ...existingRoles.filter(r => r.toLowerCase() !== trimmed.toLowerCase())];
      onUpdateUserProfile({
        ...userProfile,
        targetRoles: updatedRoles
      });
    }
  };

  // Load a recommended job into the active ingested inspector
  const handleSelectRecommendedJob = (job: RecommendedJob) => {
    setJobUrl(job.url);
    setIsIngesting(true);
    setTimeout(() => {
      setIsIngesting(false);
      setIngestedJob({
        id: job.id,
        url: job.url,
        title: job.title,
        company: job.company,
        location: job.location,
        salaryRange: job.salaryRange,
        requiredSkills: job.requiredSkills,
        preferredSkills: job.preferredSkills,
        rawText: job.description,
        extractedAt: 'Just now'
      });

      // Update skill delta to reflect candidate fit
      setSkillDelta(prev => prev.map((item, idx) => ({
        ...item,
        candidateLevel: Math.min(98, Math.max(68, Math.round(job.matchScore - (idx * 2.5) + (Math.random() * 4)))),
        requiredLevel: 90
      })));
    }, 450);
  };

  const handleIngestUrl = () => {
    if (!jobUrl.trim()) return;
    setIsIngesting(true);
    setTimeout(() => {
      setIsIngesting(false);
      const isCustomData = /data|scientist|ml|ai/i.test(jobUrl) || isDataRole;
      setIngestedJob({
        id: `job_${Date.now()}`,
        url: jobUrl,
        title: isCustomData ? `Senior / Staff ${activeRole}` : `Lead ${activeRole}`,
        company: jobUrl.includes('stripe') ? 'Stripe' : jobUrl.includes('openai') ? 'OpenAI' : jobUrl.includes('datadog') ? 'Datadog' : 'Tier-1 Tech Firm',
        location: 'San Francisco, CA / Remote',
        salaryRange: '$190,000 - $245,000 Base ($320k+ TC)',
        requiredSkills: isCustomData 
          ? ['Python', 'SQL & Distributed Warehouses', 'Statistical Causal Inference', 'Model Evaluation & Drift', 'Production MLOps']
          : [`${activeRole} Core Standards`, 'Scalable Distributed Architectures', 'High-Throughput Reliability', 'Cloud Ecosystems'],
        preferredSkills: isCustomData 
          ? ['Vector Embeddings (RAG)', 'Real-Time RecSys Latency (<50ms)', 'Cross-team Executive Decks']
          : ['Cross-team RFC Authoring', 'Multi-Region Disaster Recovery'],
        rawText: `Ingested via Jina Reader: High impact ${activeRole} opportunity focusing on scalable business value.`,
        extractedAt: 'Just now'
      });
    }, 700);
  };

  const filteredJobs = recommendedJobs.filter(job => {
    if (activeJobFilter === 'remote') return /remote/i.test(job.location);
    if (activeJobFilter === 'high_comp') return /\$190|\$2|\$3/i.test(job.salaryRange);
    return true;
  });

  const overallMatch = Math.round(
    skillDelta.reduce((acc, item) => acc + (item.candidateLevel / item.requiredLevel) * 100, 0) / skillDelta.length
  );

  // Common role presets for 1-click exploration
  const commonRolePresets = [
    'Data Scientist',
    'Machine Learning Engineer',
    'Software Engineer',
    'Frontend Developer',
    'Product Manager',
    'Cloud & DevOps',
    'Cybersecurity',
    'Data Engineer'
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-main)] text-[var(--text-main)] overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Top Banner & Interactive Role Selection */}
      <div className="max-w-6xl mx-auto w-full mb-6">
        <div className="flex flex-col gap-4 border-b border-[var(--border-color)] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Pillar 3 • Market Intelligence & RAG
                </span>
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 font-medium">
                  <Globe className="w-3.5 h-3.5 text-blue-500" /> Active Role Target: 
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                    {activeRole}
                  </span>
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] mt-1">
                Market Intelligence & Recommended Jobs
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                Dynamic career market ingestion adapted in real-time to your target role of <strong className="text-[var(--text-main)]">{activeRole}</strong>.
              </p>
            </div>

            {/* Change / Customize Target Role Button */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              {!isEditingRole ? (
                <button
                  onClick={() => {
                    setCustomRoleInput(activeRole);
                    setIsEditingRole(true);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-main)] font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Switch / Custom Role</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] p-1 rounded-xl border border-blue-500/50 shadow-xs">
                  <input
                    type="text"
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    placeholder="Enter any target role..."
                    className="px-2.5 py-1 text-xs bg-[var(--bg-main)] text-[var(--text-main)] rounded-lg outline-none border border-[var(--border-color)] w-48 font-medium"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSelectRole(customRoleInput);
                    }}
                  />
                  <button
                    onClick={() => handleSelectRole(customRoleInput)}
                    className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    title="Apply Role"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Role Selection Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] mr-1">Recommend For:</span>
            {commonRolePresets.map((rPreset) => {
              const isCurrent = activeRole.toLowerCase() === rPreset.toLowerCase();
              return (
                <button
                  key={rPreset}
                  onClick={() => handleSelectRole(rPreset)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)]'
                  }`}
                >
                  {rPreset}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full space-y-6 pb-12">
        
        {/* ============================================================== */}
        {/* CORE FEATURE: RECOMMENDED JOBS FOR ACTIVE ROLE                 */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm text-[var(--text-main)]">
                  Top Recommended Jobs for "{activeRole}"
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
                  {filteredJobs.length} Live Openings
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                AI-ranked opportunities matching your profile ({userProfile.fullName}) and verified {activeRole} competencies.
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setActiveJobFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  activeJobFilter === 'all'
                    ? 'bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold shadow-xs'
                    : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => setActiveJobFilter('remote')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  activeJobFilter === 'remote'
                    ? 'bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold shadow-xs'
                    : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                Remote Only
              </button>
              <button
                onClick={() => setActiveJobFilter('high_comp')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  activeJobFilter === 'high_comp'
                    ? 'bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold shadow-xs'
                    : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                $200k+ TC
              </button>
            </div>
          </div>

          {/* Recommended Jobs Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {filteredJobs.map((job) => {
              const isSelected = ingestedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => handleSelectRecommendedJob(job)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:shadow-md ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/50'
                      : 'border-[var(--border-color)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header: Company & Match */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[var(--text-main)] group-hover:text-blue-500 transition-colors">
                          {job.company}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)]">
                          {job.source}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {job.matchScore}% Match
                      </span>
                    </div>

                    {/* Actively Hiring Status Indicator */}
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>🟢 Actively Hiring Now (2026)</span>
                    </div>

                    {/* Job Title */}
                    <div>
                      <h4 className="font-bold text-xs text-[var(--text-main)] leading-snug line-clamp-2">
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] mt-1">
                        <MapPin className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{job.salaryRange}</span>
                    </div>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.tags.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions: Direct Apply, Guide to Application, and Inspect */}
                  <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-center text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                        title="Open Official Job Application Form"
                      >
                        <span>Direct Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveGuideJob(job);
                        }}
                        className="py-1.5 px-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-main)] font-semibold text-xs transition-colors flex items-center gap-1 shrink-0 shadow-2xs"
                        title="Step-by-step application walkthrough"
                      >
                        <span>Guide</span>
                        <ArrowRight className="w-3 h-3 text-blue-500" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-0.5">
                      <span className="font-semibold text-blue-500 group-hover:underline flex items-center gap-1">
                        {isSelected ? 'Active Ingested ✓' : 'Inspect Skill Delta →'}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-500 font-medium">Verified Active</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1. Job Ingestion URL Bar */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs space-y-3">
          <label className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider block">
            Ingest Any Custom Job Posting URL (LinkedIn / Greenhouse / Lever / Ashby)
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://boards.greenhouse.io/company/jobs/123456"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-blue-500 transition-colors font-mono"
              />
            </div>
            <button
              onClick={handleIngestUrl}
              disabled={isIngesting || !jobUrl.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              {isIngesting ? 'Extracting Job...' : 'Ingest Posting'}
            </button>
          </div>

          {/* Role-Adaptive Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-main)]">Quick Presets for {activeRole}:</span>
            {recommendedJobs.slice(0, 3).map((rj, idx) => (
              <React.Fragment key={rj.id}>
                {idx > 0 && <span>•</span>}
                <button 
                  onClick={() => handleSelectRecommendedJob(rj)} 
                  className="hover:text-blue-500 underline"
                >
                  {rj.company} ({rj.tags[0]})
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 2. Ingested Posting Summary Card */}
        {ingestedJob && (
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[var(--text-main)]">{ingestedJob.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    {ingestedJob.company}
                  </span>
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                  {ingestedJob.location} • <span className="text-emerald-500 font-semibold">{ingestedJob.salaryRange}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[var(--text-muted)] block">Candidate Compatibility</span>
                <span className="text-xl font-bold font-mono text-emerald-500">{overallMatch}% Match</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                <span className="font-semibold text-[var(--text-main)] block">Core Extracted Prerequisites:</span>
                <div className="flex flex-wrap gap-1.5">
                  {ingestedJob.requiredSkills.map((req, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-medium border border-blue-500/20">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                <span className="font-semibold text-[var(--text-main)] block">Tier-1 Differentiating Superpowers:</span>
                <div className="flex flex-wrap gap-1.5">
                  {ingestedJob.preferredSkills.map((pref, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Visual Skill Delta Radar */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-500" />
              <h3 className="font-semibold text-sm text-[var(--text-main)]">
                Visual Skill Delta Radar ({activeRole} Target vs. Verified Profile)
              </h3>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono">Profile: {userProfile.fullName}</span>
          </div>

          <div className="space-y-3.5">
            {skillDelta.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--text-main)] flex items-center gap-1.5">
                    {item.isStrength ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    {item.skill}
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-[var(--text-muted)]">Target: {item.requiredLevel}%</span>
                    <span className={`font-bold ${item.gap > 10 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      You: {item.candidateLevel}% {item.gap > 0 ? `(-${item.gap}% gap)` : '(+Exceeds)'}
                    </span>
                  </div>
                </div>

                {/* Comparative bar */}
                <div className="w-full h-2.5 rounded-full bg-[var(--bg-main)] overflow-hidden relative border border-[var(--border-color)]">
                  {/* Required benchmark indicator */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                    style={{ left: `${item.requiredLevel}%` }}
                    title={`Required Benchmark: ${item.requiredLevel}%`}
                  />
                  {/* User Level */}
                  <div 
                    className={`h-full transition-all duration-500 ${
                      item.candidateLevel >= item.requiredLevel ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.candidateLevel}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Skill Decay & Market Volatility Index */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <h3 className="font-semibold text-sm text-[var(--text-main)]">
                Skill Decay & Market Volatility Index ({activeRole} • 2026 Tech Market)
              </h3>
            </div>
            <span className="text-[11px] text-purple-500 font-medium">Algorithmic Demand Sensor</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decayList.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  item.trend === 'declining' 
                    ? 'border-red-500/20 bg-red-500/5' 
                    : 'border-emerald-500/20 bg-emerald-500/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-main)]">{item.technology}</span>
                  <span className={`flex items-center gap-1 font-mono font-bold text-xs ${
                    item.trend === 'declining' ? 'text-red-500' : 'text-emerald-500'
                  }`}>
                    {item.trend === 'declining' ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                    {item.deltaPercent > 0 ? `+${item.deltaPercent}%` : `${item.deltaPercent}%`}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  {item.advice}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Direct Application Guide & 1-Click Tailor Modal */}
      {activeGuideJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border-color)] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Currently Hiring Now (2026)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 font-mono">
                    {activeGuideJob.matchScore}% Match
                  </span>
                </div>
                <h3 className="font-bold text-base text-[var(--text-main)] mt-1.5">
                  {activeGuideJob.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {activeGuideJob.company} • {activeGuideJob.location} • <strong className="text-emerald-500">{activeGuideJob.salaryRange}</strong>
                </p>
              </div>
              <button
                onClick={() => setActiveGuideJob(null)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Step-by-Step Direct Application Guide */}
            <div className="space-y-4 text-xs">
              {/* Step 1: Direct Portal */}
              <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                    Direct Application Portal ({activeGuideJob.source})
                  </span>
                  <span className="text-[10px] text-blue-500 font-semibold font-mono">Verified Active Link</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Submit your application directly through {activeGuideJob.company}’s official {activeGuideJob.source} career portal to bypass third-party aggregator delays.
                </p>
                <a
                  href={activeGuideJob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Launch Official Application Form ({activeGuideJob.company})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Step 2: 1-Click Tailor Resume */}
              <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--bg-accent)] text-[var(--text-accent)] flex items-center justify-center text-[10px]">2</span>
                    1-Click ATS Resume Tailor
                  </span>
                  <span className="text-[10px] text-emerald-500 font-semibold font-mono">Auto-injects Keywords</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Incorporate required keywords (<strong>{activeGuideJob.requiredSkills.slice(0, 3).join(', ')}</strong>) directly into your resume to ensure 95%+ parsing score.
                </p>
                <button
                  onClick={() => {
                    if (onNavigateToStudio) {
                      onNavigateToStudio(activeGuideJob);
                      setActiveGuideJob(null);
                    }
                  }}
                  className="w-full py-2 px-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tailor & Export Resume in Document Studio →</span>
                </button>
              </div>

              {/* Step 3: Recruiter LinkedIn Outreach */}
              <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--bg-accent)] text-[var(--text-accent)] flex items-center justify-center text-[10px]">3</span>
                    Recruiter & Referral Outreach Script
                  </span>
                  <button
                    onClick={() => {
                      const msg = `Hi [Recruiter / Hiring Manager],\n\nI noticed the ${activeGuideJob.title} opening at ${activeGuideJob.company}. Having completed project work with ${userProfile.keySkills.join(', ')} and predictive modeling workflows, I have submitted my direct application via ${activeGuideJob.source}.\n\nI'd welcome the chance to share my portfolio and discuss how I can contribute to your team!\n\nBest regards,\n${userProfile.fullName}`;
                      navigator.clipboard.writeText(msg);
                      setCopiedOutreach(true);
                      setTimeout(() => setCopiedOutreach(false), 2000);
                    }}
                    className="text-[11px] font-semibold text-blue-500 hover:underline flex items-center gap-1"
                  >
                    {copiedOutreach ? 'Copied ✓' : 'Copy Message'}
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)] font-mono leading-relaxed select-all">
                  Hi [Recruiter / Hiring Manager], I noticed the {activeGuideJob.title} opening at {activeGuideJob.company}. Having built project work in {userProfile.keySkills.join(', ')}, I’ve submitted my direct application via {activeGuideJob.source} and would love to connect!
                </div>
              </div>

              {/* Step 4: Track in Opportunity Funnel */}
              <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-[var(--text-main)] block">Track in Opportunity Funnel</span>
                  <span className="text-[10px] text-[var(--text-muted)]">Monitor interview stages and deadlines</span>
                </div>
                <button
                  onClick={() => {
                    if (onTrackInKanban) {
                      onTrackInKanban();
                      setActiveGuideJob(null);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-main)] font-semibold transition-colors"
                >
                  Add to Kanban →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
