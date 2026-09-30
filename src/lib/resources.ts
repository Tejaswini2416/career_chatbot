export interface StudyResource {
  title: string;
  type: 'youtube' | 'practice' | 'roadmap' | 'test';
  url: string;
  description: string;
  category: string;
}

export const CAREER_RESOURCES: Record<string, StudyResource[]> = {
  software_engineering: [
    {
      title: 'NeetCode Algorithm & Coding Patterns',
      type: 'youtube',
      url: 'https://www.youtube.com/@NeetCode',
      description: 'Comprehensive video explanations for all core data structures, algorithms, and LeetCode blind 75/150.',
      category: 'Coding & Algorithms'
    },
    {
      title: 'ByteByteGo System Design Fundamentals',
      type: 'youtube',
      url: 'https://www.youtube.com/@ByteByteGo',
      description: 'Visual system design animations, microservices patterns, caching, database sharding, and scale.',
      category: 'System Design'
    },
    {
      title: 'Gaurav Sen Distributed Systems Deep Dive',
      type: 'youtube',
      url: 'https://www.youtube.com/@gkcs',
      description: 'Master distributed consensus, message queues, rate limiting, and consistent hashing.',
      category: 'Distributed Systems'
    },
    {
      title: 'freeCodeCamp Full Stack Architecture & DSA',
      type: 'youtube',
      url: 'https://www.youtube.com/@freecodecamp',
      description: 'Full-length university-grade courses covering cloud architecture, DevOps, and backend engineering.',
      category: 'Cloud & Backend'
    },
    {
      title: 'LeetCode Top Interview 150 Practice Suite',
      type: 'practice',
      url: 'https://leetcode.com/studyplan/top-interview-150/',
      description: 'The mandatory curated problem set tested across Google, Meta, Amazon, and tier-1 tech firms.',
      category: 'Coding Tests'
    },
    {
      title: 'System Design Primer (Interactive GitHub)',
      type: 'roadmap',
      url: 'https://github.com/donnemartin/system-design-primer',
      description: 'Open-source interactive guide with visual diagrams, latency numbers, and real-world case studies.',
      category: 'Architecture'
    },
    {
      title: 'NeetCode Interactive Practice Roadmap',
      type: 'practice',
      url: 'https://neetcode.io/roadmap',
      description: 'Visual tree roadmap covering Array, Two Pointer, Trees, Dynamic Programming, and Graphs.',
      category: 'Skill Verification'
    },
    {
      title: 'Roadmap.sh Software Architect Path',
      type: 'roadmap',
      url: 'https://roadmap.sh/software-design-architecture',
      description: 'Step-by-step career milestone roadmap for Senior to Staff Software Engineers.',
      category: 'Career Roadmap'
    }
  ],
  product_management: [
    {
      title: 'Exponent Product Management Mock Interviews',
      type: 'youtube',
      url: 'https://www.youtube.com/@tryexponent',
      description: 'Live FAANG PM mock interviews covering product sense, metrics, estimation, and strategy.',
      category: 'PM Interviews'
    },
    {
      title: "Lenny's Podcast — Product Strategy & Growth",
      type: 'youtube',
      url: 'https://www.youtube.com/@LennysPodcast',
      description: 'Deep dives with world-class VP and CPO leaders on product execution and scaling teams.',
      category: 'Product Strategy'
    },
    {
      title: 'Product Management Exercises & Practice Case Studies',
      type: 'practice',
      url: 'https://www.productmanagementexercises.com/',
      description: 'Community-driven practice repository with 1,000+ real interview questions and candidate answers.',
      category: 'PM Practice'
    },
    {
      title: 'Roadmap.sh Product Manager Career Guide',
      type: 'roadmap',
      url: 'https://roadmap.sh/product-manager',
      description: 'Milestone roadmap covering discovery, user research, roadmapping, and AI product integration.',
      category: 'Roadmap'
    }
  ],
  data_ai: [
    {
      title: 'StatQuest with Josh Starmer — ML & Stats Visualized',
      type: 'youtube',
      url: 'https://www.youtube.com/@statquest',
      description: 'Clear, intuitive breakdowns of machine learning algorithms, neural nets, and statistical methods.',
      category: 'Machine Learning'
    },
    {
      title: 'Andrej Karpathy — Neural Networks: Zero to Hero',
      type: 'youtube',
      url: 'https://www.youtube.com/@AndrejKarpathy',
      description: 'Build GPT models, backprop, and transformer architectures from raw Python scratch.',
      category: 'Deep Learning'
    },
    {
      title: '3Blue1Brown — Neural Networks & Linear Algebra',
      type: 'youtube',
      url: 'https://www.youtube.com/@3blue1brown',
      description: 'Geometric visual foundations of deep learning, eigenvectors, and gradient descent.',
      category: 'Foundations'
    },
    {
      title: 'Kaggle Machine Learning Competitions & Datasets',
      type: 'practice',
      url: 'https://www.kaggle.com/competitions',
      description: 'Hands-on production model building, feature engineering, and leaderboards.',
      category: 'Coding & Testing'
    },
    {
      title: 'Roadmap.sh AI & Data Scientist Path',
      type: 'roadmap',
      url: 'https://roadmap.sh/ai-data-scientist',
      description: 'Complete guide from data analysis to LLM engineering and MLOps deployment.',
      category: 'Roadmap'
    }
  ],
  behavioral_leadership: [
    {
      title: 'Dan Croitor — Amazon Leadership Principles & STAR Answers',
      type: 'youtube',
      url: 'https://www.youtube.com/@DanCroitor',
      description: 'Gold standard behavioral interview structuring for Senior and Staff leadership roles.',
      category: 'Behavioral STAR'
    },
    {
      title: 'Jeff H Sipe — FAANG Interview Strategy & Negotiation',
      type: 'youtube',
      url: 'https://www.youtube.com/@JeffHSipe',
      description: 'Executive hiring recruiter sharing exact frameworks for storytelling, tone, and delivery.',
      category: 'Interview Strategy'
    },
    {
      title: 'Pramp — Free Live Peer Mock Interviews',
      type: 'practice',
      url: 'https://www.pramp.com/',
      description: 'Practice real live 60-minute technical and behavioral mock rounds with real peer engineers.',
      category: 'Live Practice'
    },
    {
      title: 'Interviewing.io — Anonymous FAANG Senior Mocks',
      type: 'test',
      url: 'https://interviewing.io/',
      description: 'Real interview simulations with Staff and Principal engineers from Google, Meta, and Netflix.',
      category: 'Bar-Raiser Testing'
    }
  ]
};

export function getResourcesForRole(targetRole: string = '', skills: string[] = []): StudyResource[] {
  const roleLower = targetRole.toLowerCase();
  const skillsLower = skills.map(s => s.toLowerCase());

  let resources: StudyResource[] = [];

  if (roleLower.includes('product') || roleLower.includes('pm') || roleLower.includes('program')) {
    resources = [...CAREER_RESOURCES.product_management, ...CAREER_RESOURCES.behavioral_leadership];
  } else if (roleLower.includes('data') || roleLower.includes('ai') || roleLower.includes('ml') || roleLower.includes('learning')) {
    resources = [...CAREER_RESOURCES.data_ai, ...CAREER_RESOURCES.software_engineering.slice(0, 3)];
  } else {
    // Default to software engineering & architecture
    resources = [...CAREER_RESOURCES.software_engineering, ...CAREER_RESOURCES.behavioral_leadership.slice(0, 3)];
  }

  return resources;
}
