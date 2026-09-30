'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap, 
  Code, 
  User, 
  FileText, 
  Plus, 
  Trash2, 
  HelpCircle,
  Award,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface ProjectExperience {
  title: string;
  organization: string;
  duration: string;
  technologies: string;
  problemSolved: string;
  quantifiableMetrics: string;
}

interface ResumeQuestionnaireData {
  fullName: string;
  targetRole: string;
  track: 'student_fresher' | 'experienced';
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  
  // Skills
  languages: string;
  frameworks: string;
  databasesTools: string;
  coreCompetencies: string;
  
  // Projects / Experience
  experiences: ProjectExperience[];
  
  // Education
  degree: string;
  institution: string;
  gradYear: string;
  gpaOrHonors: string;
  courseworkOrCerts: string;
  
  // Summary
  careerObjective: string;
}

interface ResumeQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onGenerateResume: (generatedResume: { title: string; content: string }) => void;
}

export function ResumeQuestionsModal({
  isOpen,
  onClose,
  userProfile,
  onGenerateResume,
}: ResumeQuestionsModalProps) {
  const isStudentDefault = userProfile.candidateTrack === 'student_fresher' || /student|fresher|intern/i.test(userProfile.currentRole);
  const defaultTargetRole = userProfile.targetRoles?.[0] || (isStudentDefault ? 'Data Scientist' : 'Staff Software Engineer');

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ResumeQuestionnaireData>({
    fullName: userProfile.fullName || 'Sowmya',
    targetRole: defaultTargetRole,
    track: isStudentDefault ? 'student_fresher' : 'experienced',
    email: `${userProfile.fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA / Remote',
    linkedin: `linkedin.com/in/${userProfile.fullName.toLowerCase().replace(/\s+/g, '')}`,
    github: `github.com/${userProfile.fullName.toLowerCase().replace(/\s+/g, '')}`,
    portfolio: '',
    
    // Skills
    languages: userProfile.keySkills.filter(s => /python|sql|java|c\+\+|javascript|typescript|r|bash/i.test(s)).join(', ') || 'Python, SQL, R',
    frameworks: 'Pandas, NumPy, Scikit-Learn, PyTorch, Streamlit',
    databasesTools: 'PostgreSQL, MySQL, Git, Docker, Jupyter Notebooks',
    coreCompetencies: 'Machine Learning, Exploratory Data Analysis (EDA), Statistical Modeling, ETL Pipelines',
    
    // Projects / Experience
    experiences: isStudentDefault ? [
      {
        title: 'Machine Learning Classification Pipeline',
        organization: 'Academic Capstone Project',
        duration: '2025 – 2026',
        technologies: 'Python, Scikit-Learn, XGBoost, Streamlit',
        problemSolved: 'Built end-to-end binary predictive model to classify high-risk customer turnover across 120,000+ data records.',
        quantifiableMetrics: 'Achieved 91.4% ROC-AUC accuracy; reduced false positive rate by 22% using SHAP feature importance analysis.'
      },
      {
        title: 'Large-Scale Exploratory Data Analysis & ETL Pipeline',
        organization: 'Data Science Lab',
        duration: '2024 – 2025',
        technologies: 'PostgreSQL, Python (Pandas), SQL Window Functions',
        problemSolved: 'Designed automated SQL transformation scripts and window aggregation queries on 1.2M+ transaction records.',
        quantifiableMetrics: 'Automated reporting turnaround by 45% and eliminated duplicate record inconsistencies.'
      }
    ] : [
      {
        title: userProfile.currentRole || 'Senior Software Engineer',
        organization: 'Enterprise Cloud Systems',
        duration: '2022 – Present',
        technologies: userProfile.keySkills.slice(0, 4).join(', ') || 'Python, Go, PostgreSQL, AWS',
        problemSolved: 'Architected distributed event-processing pipeline and microservices handling 45k requests/sec.',
        quantifiableMetrics: 'Reduced p99 system latency from 420ms to 85ms (79% improvement) and cut cloud infrastructure costs by 28%.'
      },
      {
        title: 'Software Engineer II',
        organization: 'ScaleTech Inc',
        duration: '2019 – 2022',
        technologies: 'Python, SQL, Docker, Redis',
        problemSolved: 'Engineered real-time database caching layer and cross-team asynchronous APIs.',
        quantifiableMetrics: 'Increased query throughput by 3x and maintained 99.99% uptime across production clusters.'
      }
    ],
    
    // Education
    degree: isStudentDefault ? 'Bachelor of Science in Computer Science / Data Science' : 'Bachelor of Science in Computer Science',
    institution: 'State University of Technology',
    gradYear: '2026',
    gpaOrHonors: 'GPA: 3.85 / 4.0 • Dean\'s Honor List',
    courseworkOrCerts: 'Machine Learning, Applied Statistics, Data Structures & Algorithms, Database Systems',
    
    // Summary
    careerObjective: isStudentDefault 
      ? `Analytical and high-velocity Computer Science & Data graduate targeting entry-level ${defaultTargetRole} roles. Strong hands-on foundation in Python, SQL, and predictive modeling, eager to deliver data-driven business impact.`
      : `Results-driven ${userProfile.currentRole} with ${userProfile.yearsOfExperience || 3}+ years of hands-on experience building high-scale distributed systems and data pipelines, targeting strategic ${defaultTargetRole} opportunities.`
  });

  if (!isOpen) return null;

  const totalSteps = 5;

  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          title: '',
          organization: '',
          duration: '',
          technologies: '',
          problemSolved: '',
          quantifiableMetrics: ''
        }
      ]
    }));
  };

  const handleRemoveExperience = (index: number) => {
    if (formData.experiences.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateExperience = (index: number, field: keyof ProjectExperience, val: string) => {
    setFormData(prev => {
      const updated = [...prev.experiences];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, experiences: updated };
    });
  };

  const autoGenerateObjective = () => {
    if (formData.track === 'student_fresher') {
      setFormData(prev => ({
        ...prev,
        careerObjective: `Analytical and ambitious graduate targeting ${prev.targetRole} positions. Proficient in ${prev.languages || 'Python, SQL'} and hands-on predictive modeling with ${prev.frameworks || 'Scikit-Learn, Pandas'}. Proven track record executing data pipelines and turning complex datasets into quantifiable insights.`
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        careerObjective: `Accomplished and metric-driven ${prev.targetRole} professional with strong background in ${prev.languages || 'distributed architecture and data engineering'}. Track record architecting resilient production systems, optimizing computational performance, and collaborating across high-performing engineering teams.`
      }));
    }
  };

  const generateResumeMarkdown = () => {
    const isStudent = formData.track === 'student_fresher';
    const cleanName = formData.fullName.trim() || 'CANDIDATE NAME';
    const roleTitle = formData.targetRole.trim() || 'Data Scientist';

    const contactLine = [
      formData.email && `Email: ${formData.email.trim()}`,
      formData.phone && `Phone: ${formData.phone.trim()}`,
      formData.location && formData.location.trim(),
      formData.linkedin && `LinkedIn: ${formData.linkedin.trim()}`,
      formData.github && `GitHub: ${formData.github.trim()}`,
      formData.portfolio && `Portfolio: ${formData.portfolio.trim()}`
    ].filter(Boolean).join(' | ');

    let md = `# ${cleanName.toUpperCase()}\n`;
    md += `**${isStudent ? `Aspiring ${roleTitle} | Early-Career Specialist` : `${roleTitle} | Senior Specialist`}**\n`;
    md += `${contactLine}\n\n`;
    md += `---\n\n`;

    // Professional Summary
    md += `## 🎯 PROFESSIONAL SUMMARY\n`;
    md += `${formData.careerObjective.trim() || `Dedicated ${roleTitle} professional proficient in ${formData.languages}. Track record delivering metric-driven results and solving complex technical challenges.`}\n\n`;
    md += `---\n\n`;

    // Technical Skills
    md += `## 🛠️ CORE TECHNICAL SKILLS\n`;
    if (formData.languages.trim()) {
      md += `- **Programming Languages**: ${formData.languages.trim()}\n`;
    }
    if (formData.frameworks.trim()) {
      md += `- **Frameworks & Libraries**: ${formData.frameworks.trim()}\n`;
    }
    if (formData.databasesTools.trim()) {
      md += `- **Databases & Cloud / Tools**: ${formData.databasesTools.trim()}\n`;
    }
    if (formData.coreCompetencies.trim()) {
      md += `- **Core Competencies**: ${formData.coreCompetencies.trim()}\n`;
    }
    md += `\n---\n\n`;

    // Projects or Experience
    const sectionTitle = isStudent ? 'NOTABLE TECHNICAL PROJECTS' : 'PROFESSIONAL EXPERIENCE';
    md += `## 💼 ${sectionTitle}\n\n`;

    formData.experiences.forEach((exp) => {
      if (!exp.title.trim()) return;
      const orgString = exp.organization.trim() ? ` | *${exp.organization.trim()}*` : '';
      const durationString = exp.duration.trim() ? ` *(${exp.duration.trim()})*` : '';
      md += `### **${exp.title.trim()}**${orgString}${durationString}\n`;
      if (exp.technologies.trim()) {
        md += `*Tech Stack: ${exp.technologies.trim()}*\n`;
      }
      if (exp.problemSolved.trim()) {
        md += `- ${exp.problemSolved.trim()}\n`;
      }
      if (exp.quantifiableMetrics.trim()) {
        md += `- **Impact & Scale**: ${exp.quantifiableMetrics.trim()}\n`;
      }
      md += `\n`;
    });

    md += `---\n\n`;

    // Education & Certifications
    md += `## 🎓 EDUCATION & CERTIFICATIONS\n`;
    if (formData.degree.trim()) {
      md += `**${formData.degree.trim()}**\n`;
    }
    const eduSub = [
      formData.institution.trim(),
      formData.gradYear.trim() && `Graduation: ${formData.gradYear.trim()}`
    ].filter(Boolean).join(' • ');
    if (eduSub) {
      md += `*${eduSub}*\n`;
    }
    if (formData.gpaOrHonors.trim()) {
      md += `- **Academic Honors & Performance**: ${formData.gpaOrHonors.trim()}\n`;
    }
    if (formData.courseworkOrCerts.trim()) {
      md += `- **Relevant Coursework & Certifications**: ${formData.courseworkOrCerts.trim()}\n`;
    }

    return {
      title: `ATS-Optimized Resume: ${roleTitle}`,
      content: md
    };
  };

  const handleFinalSubmit = () => {
    const generated = generateResumeMarkdown();
    onGenerateResume(generated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-500 font-bold border border-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                Resume Generator Questionnaire
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                  Step {currentStep} of {totalSteps}
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Answer these targeted questions to produce a custom, metric-focused ATS resume.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 border-b border-[var(--border-color)] text-[11px] font-medium bg-[var(--bg-surface)]">
          {[
            { step: 1, label: 'Profile & Role' },
            { step: 2, label: 'Technical Skills' },
            { step: 3, label: 'Projects / Exp' },
            { step: 4, label: 'Education' },
            { step: 5, label: 'Summary & Review' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setCurrentStep(item.step)}
              className={`py-2 px-1 sm:px-2 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                currentStep === item.step
                  ? 'border-blue-500 text-blue-500 font-semibold bg-blue-500/5'
                  : currentStep > item.step
                  ? 'border-emerald-500 text-emerald-500'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                currentStep === item.step
                  ? 'bg-blue-600 text-white'
                  : currentStep > item.step
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[var(--bg-surface-hover)] text-[var(--text-muted)]'
              }`}>
                {currentStep > item.step ? '✓' : item.step}
              </span>
              <span className="hidden sm:inline truncate">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-[var(--bg-main)]">

          {/* STEP 1: Profile & Target Role */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-[var(--text-main)]">
                💡 <strong>Question 1 of 5:</strong> Who are you and what specific career role are you applying for?
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Sowmya"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Target Role *
                  </label>
                  <input
                    type="text"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Data Scientist / Machine Learning Engineer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                  Candidate Track
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, track: 'student_fresher' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.track === 'student_fresher'
                        ? 'border-blue-500 bg-blue-500/10 text-[var(--text-main)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      Student / Fresher Track
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">
                      Focuses on academic projects, hackathons, analytical coursework, and practical foundation.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, track: 'experienced' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.track === 'experienced'
                        ? 'border-blue-500 bg-blue-500/10 text-[var(--text-main)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-emerald-500" />
                      Experienced Professional Track
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">
                      Focuses on production architecture, team leadership, revenue impact, and business scale.
                    </p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                    placeholder="e.g. sowmya@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                    placeholder="e.g. San Francisco, CA / Remote"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                    placeholder="e.g. linkedin.com/in/sowmya"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    GitHub or Portfolio URL
                  </label>
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                    placeholder="e.g. github.com/sowmya"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Technical Skills */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-[var(--text-main)]">
                💡 <strong>Question 2 of 5:</strong> What are your primary programming languages, frameworks, and technical toolsets?
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Programming Languages (Comma-separated) *
                </label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Python, SQL, R, Bash, C++"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Frameworks, Libraries & Modeling Tools
                </label>
                <input
                  type="text"
                  value={formData.frameworks}
                  onChange={(e) => setFormData({ ...formData, frameworks: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Pandas, NumPy, Scikit-Learn, PyTorch, TensorFlow, Streamlit"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Databases, Cloud & Developer Tools
                </label>
                <input
                  type="text"
                  value={formData.databasesTools}
                  onChange={(e) => setFormData({ ...formData, databasesTools: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                  placeholder="e.g. PostgreSQL, MySQL, AWS S3/EC2, Docker, Git / GitHub, Jupyter Notebooks"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Core Methodologies & Concepts
                </label>
                <input
                  type="text"
                  value={formData.coreCompetencies}
                  onChange={(e) => setFormData({ ...formData, coreCompetencies: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Supervised/Unsupervised Learning, Exploratory Data Analysis (EDA), ETL Pipelines, Feature Engineering"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Projects & Work Experience */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-[var(--text-main)] flex items-center justify-between">
                <span>
                  💡 <strong>Question 3 of 5:</strong> What are your 2 key technical projects or work experiences, including quantified metrics?
                </span>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Another Project
                </button>
              </div>

              {formData.experiences.map((exp, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-3 relative"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                    <span className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-blue-500" />
                      {formData.track === 'student_fresher' ? `Project #${idx + 1}` : `Experience / Role #${idx + 1}`}
                    </span>
                    {formData.experiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(idx)}
                        className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">
                        {formData.track === 'student_fresher' ? 'Project Title *' : 'Job Title / Role *'}
                      </label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => handleUpdateExperience(idx, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Predictive Machine Learning Classification Pipeline"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">
                        Duration / Timeline
                      </label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => handleUpdateExperience(idx, 'duration', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                        placeholder="e.g. 2025 – 2026"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">
                        Organization / Context
                      </label>
                      <input
                        type="text"
                        value={exp.organization}
                        onChange={(e) => handleUpdateExperience(idx, 'organization', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Academic Capstone Project / FinTech Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">
                        Technologies Used
                      </label>
                      <input
                        type="text"
                        value={exp.technologies}
                        onChange={(e) => handleUpdateExperience(idx, 'technologies', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Python, Scikit-Learn, Streamlit, PostgreSQL"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">
                      Problem Solved & Action Taken *
                    </label>
                    <textarea
                      rows={2}
                      value={exp.problemSolved}
                      onChange={(e) => handleUpdateExperience(idx, 'problemSolved', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 leading-relaxed"
                      placeholder="e.g. Built end-to-end binary predictive classification model on 120,000+ data records using XGBoost and Random Forest."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">
                      Quantifiable Impact & Metrics (ATS Gold Standard) *
                    </label>
                    <input
                      type="text"
                      value={exp.quantifiableMetrics}
                      onChange={(e) => handleUpdateExperience(idx, 'quantifiableMetrics', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 font-mono"
                      placeholder="e.g. Achieved 91.4% ROC-AUC accuracy; reduced manual evaluation time by 45%."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: Education & Certifications */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-[var(--text-main)]">
                💡 <strong>Question 4 of 5:</strong> What formal degree, university, GPA/honors, or specialized certifications do you hold?
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Degree & Major *
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Bachelor of Science in Computer Science / Data Science"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    College / University Name *
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                    placeholder="e.g. State University of Technology"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Graduation Year (or Expected)
                  </label>
                  <input
                    type="text"
                    value={formData.gradYear}
                    onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                    placeholder="e.g. 2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Academic Honors or GPA
                </label>
                <input
                  type="text"
                  value={formData.gpaOrHonors}
                  onChange={(e) => setFormData({ ...formData, gpaOrHonors: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                  placeholder="e.g. GPA: 3.85 / 4.0 • Dean's Honor Roll"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Relevant Coursework or Certifications
                </label>
                <input
                  type="text"
                  value={formData.courseworkOrCerts}
                  onChange={(e) => setFormData({ ...formData, courseworkOrCerts: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Machine Learning Specialization, Applied Statistics, Data Structures & Algorithms, PostgreSQL"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Professional Summary & Review */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-[var(--text-main)]">
                💡 <strong>Question 5 of 5:</strong> What is your career objective or elevator pitch for hiring managers?
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text-main)]">
                    Professional Summary (2–3 high-impact sentences)
                  </label>
                  <button
                    type="button"
                    onClick={autoGenerateObjective}
                    className="text-[11px] text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    Auto-Draft from My Answers
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={formData.careerObjective}
                  onChange={(e) => setFormData({ ...formData, careerObjective: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 leading-relaxed"
                  placeholder="Summarize your technical strengths and the value you bring to the role..."
                />
              </div>

              {/* Review Snapshot */}
              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2.5">
                <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider block">
                  📋 Answers Summary Checklist
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] block">Candidate</span>
                    <strong className="text-[var(--text-main)] truncate block">{formData.fullName}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] block">Target Role</span>
                    <strong className="text-[var(--text-main)] truncate block">{formData.targetRole}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] block">Track</span>
                    <strong className="text-blue-500 truncate block">
                      {formData.track === 'student_fresher' ? 'Student / Fresher' : 'Experienced'}
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] block">Projects Logged</span>
                    <strong className="text-emerald-500 block">{formData.experiences.length} Projects</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5 hover:bg-[var(--border-color)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Question
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
            >
              Next Question
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              Generate ATS Resume Now
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
