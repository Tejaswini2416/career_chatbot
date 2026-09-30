import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Sparkles, 
  Edit3, 
  Eye, 
  Wand2, 
  Mail, 
  DollarSign, 
  Send, 
  Minimize2, 
  Maximize2, 
  FileDown 
} from 'lucide-react';
import { GeneratedDocument, UserProfile } from '@/lib/types';
import { calculateAtsKeywordMatch, downloadAsFile } from '@/lib/utils';
import { exportResumeToPdf } from '@/lib/pdf-export';
import { AtsScoreCard } from './AtsScoreCard';
import { ResumeQuestionsModal } from './ResumeQuestionsModal';

interface DocumentStudioProps {
  currentDocument?: GeneratedDocument;
  userProfile: UserProfile;
  onSendPrompt: (prompt: string) => void;
  onUpdateDocument: (doc: GeneratedDocument) => void;
  isLoading: boolean;
  onClose?: () => void;
}

export function DocumentStudio({
  currentDocument,
  userProfile,
  onSendPrompt,
  onUpdateDocument,
  isLoading,
  onClose,
}: DocumentStudioProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');
  const [docContent, setDocContent] = useState<string>('');
  const [docTitle, setDocTitle] = useState<string>('ATS-Optimized Resume');
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);

  const targetRole = userProfile.targetRoles?.[0] || 'Data Scientist';
  const isStudent = userProfile.candidateTrack === 'student_fresher' || /student|fresher|intern/i.test(userProfile.currentRole);

  const getCleanResumeContent = (doc?: GeneratedDocument): { title: string; content: string } => {
    // If doc exists and is a valid resume (NOT a strategy assessment or career roadmap)
    if (doc && doc.content && !/Apex Career Strategy Assessment|Personalized Early-Career Launchpad|Career Diagnostic & Strategic Roadmap|Pillar \d|Specialized Modes/i.test(doc.content)) {
      return {
        title: doc.title || 'ATS-Optimized Resume',
        content: doc.content
      };
    }

    // Generate authentic, tailored ATS resume based on student/fresher vs experienced
    if (isStudent) {
      return {
        title: `ATS-Optimized Resume: ${targetRole}`,
        content: `# ${userProfile.fullName.toUpperCase()}
**Aspiring ${targetRole} | Early-Career Specialist**
Email: ${userProfile.fullName.toLowerCase().replace(/\\s+/g, '.')}@example.com | LinkedIn: linkedin.com/in/${userProfile.fullName.toLowerCase().replace(/\\s+/g, '')} | GitHub: github.com/${userProfile.fullName.toLowerCase().replace(/\\s+/g, '')} | San Francisco, CA / Remote

---

## 🎯 PROFESSIONAL SUMMARY
Analytical and high-velocity Computer Science & Data graduate targeting entry-level **${targetRole}** positions. Strong practical foundation in **${userProfile.keySkills.join(', ') || 'Python, SQL, Machine Learning'}**. Proven track record building end-to-end predictive models, conducting exploratory data analysis on real-world datasets, and orchestrating automated data pipelines.

---

## 🛠️ CORE TECHNICAL SKILLS
- **Programming & Analysis**: ${userProfile.keySkills.join(', ')}, Python (Pandas, NumPy, Scikit-Learn), SQL, R, Bash
- **Machine Learning & Modeling**: Supervised/Unsupervised Learning, Regression, Classification, Model Evaluation, Hyperparameter Tuning
- **Databases & Data Engineering**: PostgreSQL, MySQL, Data Cleaning, Feature Engineering, ETL Pipelines
- **Developer Tools**: Jupyter Notebooks, Git / GitHub, Docker Basics, Streamlit, Tableau

---

## 🔬 NOTABLE DATA SCIENCE PROJECTS

### **Predictive Machine Learning & Classification Pipeline** | *Python, Scikit-Learn, Streamlit*
- Built end-to-end binary classification model on 120,000+ records predicting key outcomes with **91.4% ROC-AUC** utilizing XGBoost and Random Forest.
- Engineered 16 behavioral domain features from raw datasets; evaluated feature importance using SHAP values.
- Deployed interactive Streamlit web dashboard enabling non-technical stakeholders to simulate predictive inferences in real time.

### **Large-Scale Exploratory Data Analysis & ETL Pipeline** | *PostgreSQL, Python, SQL*
- Authored complex analytical SQL queries (window functions, CTEs) to clean, aggregate, and transform 1.2M+ rows of transaction data.
- Automated weekly data ingestion pipeline, reducing manual reporting turnaround by **45%**.

---

## 🎓 EDUCATION & COURSEWORK
**Bachelor of Science in Computer Science / Data Science**
*Expected Graduation: 2026*
- **Relevant Coursework**: Machine Learning, Applied Statistics, Data Structures & Algorithms, Database Management Systems, Linear Algebra
- **Academic Honors**: Dean's Honor Roll, Member of Campus AI & Data Science Society`
      };
    }

    // Experienced track
    return {
      title: `ATS-Optimized Resume: ${targetRole}`,
      content: `# ${userProfile.fullName.toUpperCase()}
**${userProfile.currentRole}** | Target: **${targetRole}**
Email: ${userProfile.fullName.toLowerCase().replace(/\\s+/g, '.')}@example.com | San Francisco, CA | GitHub / LinkedIn

---

## 🎯 PROFESSIONAL SUMMARY
Strategic and metric-driven **${userProfile.currentRole}** with **${userProfile.yearsOfExperience || 3}+ years** of expertise architecting high-scale distributed systems and data architectures. Proven track record leading cross-functional pods, decreasing p99 latency by 75%, and delivering high-impact business velocity across ${userProfile.industry}.

---

## 🛠️ CORE TECHNICAL SKILLS
- **Primary Languages & Frameworks**: ${userProfile.keySkills.join(', ')}
- **Architecture & Infrastructure**: Microservices, Event-Driven Systems, Distributed Consensus, CI/CD, Observability
- **Leadership & Governance**: System Roadmaps, ADR Governance, Mentorship, Cross-Team Delivery

---

## 💼 PROFESSIONAL EXPERIENCE

### **${userProfile.currentRole.toUpperCase()}** | Growth Tech Corp *(2022 – Present)*
- Architected enterprise cloud infrastructure utilizing **${userProfile.keySkills[0] || 'Python'}** and **${userProfile.keySkills[1] || 'SQL'}**, guaranteeing 99.99% SLA across high-traffic production workloads.
- Spearheaded system optimization initiative, decreasing p99 server response time from 450ms to 85ms across 15M+ daily requests.
- Mentored and championed career progression for 5 junior and mid-level engineers, establishing coding and testing standards.

### **SOFTWARE ENGINEER II** | Scale Platform *(2019 – 2022)*
- Developed real-time event streaming pipelines handling 40k+ events/second with automated failure recovery.
- Optimized database indexing and caching strategies in PostgreSQL and Redis, cutting annual cloud infrastructure costs by 28%.

---

## 🎓 EDUCATION & CERTIFICATIONS
- **B.S. in Computer Science**
- Advanced Cloud Architecture & Distributed Systems Certifications`
    };
  };

  useEffect(() => {
    const clean = getCleanResumeContent(currentDocument);
    setDocContent(clean.content);
    setDocTitle(clean.title);
    if (!currentDocument || currentDocument.content !== clean.content) {
      onUpdateDocument({
        id: currentDocument?.id || 'doc_' + Date.now(),
        title: clean.title,
        type: 'resume',
        content: clean.content,
        updatedAt: 'Just now'
      });
    }
  }, [currentDocument, userProfile]);

  const atsAnalysis = calculateAtsKeywordMatch(docContent, userProfile.keySkills);

  const handleCopy = () => {
    navigator.clipboard.writeText(docContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      await exportResumeToPdf(docTitle, docContent, userProfile);
    } catch (err) {
      console.error('Failed to export PDF', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const filename = `${docTitle.toLowerCase().replace(/\s+/g, '_')}.md`;
    downloadAsFile(filename, docContent);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleContentChange = (newVal: string) => {
    setDocContent(newVal);
    if (currentDocument) {
      onUpdateDocument({
        ...currentDocument,
        content: newVal,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  const handleGenerateResumeFromQuestions = (generated: { title: string; content: string }) => {
    setDocTitle(generated.title);
    setDocContent(generated.content);
    setActiveTab('preview');
    onUpdateDocument({
      id: currentDocument?.id || 'doc_' + Date.now(),
      title: generated.title,
      type: 'resume',
      content: generated.content,
      updatedAt: 'Just now'
    });
  };

  const handleQuickAiRefine = (instruction: string) => {
    onSendPrompt(
      `Please revise the current active document (${docTitle}) with this specific requirement: "${instruction}". Ensure the output preserves high ATS readability and executive impact.`
    );
  };

  return (
    <div className={`h-full flex flex-col bg-[var(--bg-main)] border-l border-[var(--border-color)] transition-colors ${
      isFullScreen ? 'fixed inset-0 z-50 bg-[var(--bg-main)] p-6' : 'w-full'
    }`}>
      {/* Studio Header Toolbar */}
      <div className="p-3.5 sm:p-4 border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-surface)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[var(--text-main)]">{docTitle}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface-hover)] text-[var(--text-main)] border border-[var(--border-color)] font-medium">
                ATS Document Studio
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Target: <span className="text-[var(--text-main)]">{userProfile.targetRoles?.[0] || 'Staff Engineer'}</span>
            </p>
          </div>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="flex rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-color)] p-0.5">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'preview'
                  ? 'bg-[var(--bg-main)] text-[var(--text-main)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'edit'
                  ? 'bg-[var(--bg-main)] text-[var(--text-main)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
          </div>

          {/* Generate Resume via Q&A Button */}
          <button
            onClick={() => setIsQuestionsModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
            title="Answer a series of questions to generate an ATS resume matching your real experience"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Generate via Q&A</span>
          </button>

          {/* Primary Download PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-xs flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
            title="Download resume as a formatted PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Exporting...' : 'Download PDF'}</span>
          </button>

          {/* Secondary Actions */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-colors"
            title="Copy document content"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="p-1.5 rounded-lg bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-colors"
            title="Download as Markdown"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] hidden sm:flex transition-colors"
            title="Print"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            title={isFullScreen ? 'Exit full screen' : 'Expand full screen'}
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* AI Refine Toolbar */}
      <div className="px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-color)] flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-semibold text-[var(--text-main)] flex items-center gap-1 shrink-0">
          <Wand2 className="w-3 h-3" />
          Quick Polish:
        </span>
        <button
          disabled={isLoading}
          onClick={() => handleQuickAiRefine('Add powerful quantified business metrics, dollar values, and latency stats to all bullets.')}
          className="px-2.5 py-1 rounded-md bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[11px] text-[var(--text-main)] hover:border-[var(--text-main)] transition-all shrink-0"
        >
          ⚡ Add Quantifiable Metrics
        </button>
        <button
          disabled={isLoading}
          onClick={() => handleQuickAiRefine('Shorten and tighten bullets to strictly fit on 1 page without sacrificing seniority tone.')}
          className="px-2.5 py-1 rounded-md bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[11px] text-[var(--text-main)] hover:border-[var(--text-main)] transition-all shrink-0"
        >
          📄 1-Page ATS Compression
        </button>
        <button
          disabled={isLoading}
          onClick={() => handleQuickAiRefine('Rewrite the summary and lead bullets to reflect Staff / Principal level leadership and ADR governance.')}
          className="px-2.5 py-1 rounded-md bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[11px] text-[var(--text-main)] hover:border-[var(--text-main)] transition-all shrink-0"
        >
          👑 Elevate to Staff Scope
        </button>
      </div>

      {/* Main Studio Work Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[var(--bg-main)]">
        
        {/* Document Editor/Preview Container */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Questionnaire Callout Banner */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-900/20 via-blue-800/10 to-[var(--bg-surface)] border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-500 font-bold border border-blue-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-xs text-[var(--text-main)] block">
                  Build Resume via Guided Questionnaire
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Answer 5 targeted questions (role, skills, projects with metrics, education) to generate your custom ATS resume.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsQuestionsModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-102 shrink-0 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Questionnaire ➔</span>
            </button>
          </div>

          <div className="flex-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 shadow-xl min-h-[500px]">
            {activeTab === 'preview' ? (
              <div className="prose-chatgpt max-w-none text-[var(--text-main)]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {docContent}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={docContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-full min-h-[500px] bg-transparent border-none font-mono text-xs text-[var(--text-main)] focus:outline-none resize-none leading-relaxed"
                placeholder="Type or paste markdown content here..."
              />
            )}
          </div>
        </div>

        {/* Right Sidebar: ATS & Document Presets */}
        <div className="lg:col-span-4 space-y-4">
          {/* ATS Keyword Scanner */}
          <AtsScoreCard
            score={atsAnalysis.score}
            matchedKeywords={atsAnalysis.matchedKeywords}
            missingKeywords={atsAnalysis.missingKeywords}
            onAddKeywordToPrompt={(kw) => {
              handleQuickAiRefine(`Incorporate the core skill keyword "${kw}" naturally into the competencies and experience section.`);
            }}
          />

          {/* Quick Document Template Switcher */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2.5">
            <h4 className="text-xs font-semibold text-[var(--text-main)] tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Artifact Blueprints
            </h4>

            <div className="space-y-1.5">
              {/* Questionnaire Shortcut Button */}
              <button
                onClick={() => setIsQuestionsModalOpen(true)}
                className="w-full p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/30 hover:border-blue-500 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-semibold text-blue-500">
                    ✨ Generate Resume via Q&A
                  </span>
                </div>
              </button>

              {[
                {
                  title: 'ATS-Optimized Staff Resume',
                  icon: FileText,
                  prompt: 'Generate an ATS-optimized, high-impact resume tailored for Staff Software Engineer roles with quantifiable scale.'
                },
                {
                  title: 'Targeted High-Conversion Cover Letter',
                  icon: Mail,
                  prompt: 'Write a persuasive, tailored cover letter for my target company opening.'
                },
                {
                  title: 'Executive Recruiter Outreach DM',
                  icon: Send,
                  prompt: 'Draft 3 punchy LinkedIn cold outreach messages to Engineering Directors at my target companies.'
                },
                {
                  title: 'Annual Performance Brag Sheet',
                  icon: DollarSign,
                  prompt: 'Draft a promotion brag sheet highlighting my cross-team architecture delivery, uptime, and mentorship.'
                },
              ].map((tmpl) => {
                const Icon = tmpl.icon;
                return (
                  <button
                    key={tmpl.title}
                    disabled={isLoading}
                    onClick={() => {
                      setDocTitle(tmpl.title);
                      onSendPrompt(tmpl.prompt);
                    }}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-color)] hover:border-[var(--text-main)] text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-main)]" />
                      <span className="text-xs font-medium text-[var(--text-main)]">
                        {tmpl.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Resume Questions Modal */}
      <ResumeQuestionsModal
        isOpen={isQuestionsModalOpen}
        onClose={() => setIsQuestionsModalOpen(false)}
        userProfile={userProfile}
        onGenerateResume={handleGenerateResumeFromQuestions}
      />
    </div>
  );
}
