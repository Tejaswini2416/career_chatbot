'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Layers, 
  HelpCircle,
  Award,
  Compass,
  Building,
  DollarSign,
  Clock,
  BookOpen,
  Code2
} from 'lucide-react';
import { UserProfile, CandidateTrack, StudentFresherAnswers, ExperiencedAnswers } from '@/lib/types';

interface CareerAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveAssessment: (updatedProfile: Partial<UserProfile>, triggerNewPlan?: boolean) => void;
}

export function CareerAssessmentModal({
  isOpen,
  onClose,
  userProfile,
  onSaveAssessment
}: CareerAssessmentModalProps) {
  // Determine default track based on profile
  const isStudentDefault = 
    userProfile.candidateTrack === 'student_fresher' ||
    /student|fresher|intern|undergrad|graduate/i.test(userProfile.currentRole) ||
    userProfile.yearsOfExperience <= 1;

  const [activeTrack, setActiveTrack] = useState<CandidateTrack>(
    userProfile.candidateTrack || (isStudentDefault ? 'student_fresher' : 'experienced')
  );

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Student / Fresher 16 Questions State
  const [studentData, setStudentData] = useState<StudentFresherAnswers>({
    degreeAndMajor: userProfile.studentAnswers?.degreeAndMajor || 'B.S. in Computer Science / Data Science (Expected May 2026)',
    courseworkAndProjects: userProfile.studentAnswers?.courseworkAndProjects || 'Machine Learning, Algorithms & Data Structures, Database Systems, Capstone Predictive Model',
    technicalToolsAndLanguages: userProfile.studentAnswers?.technicalToolsAndLanguages || (userProfile.keySkills?.join(', ') || 'Python, SQL, Pandas, Scikit-Learn, Git'),
    internshipsAndLeadership: userProfile.studentAnswers?.internshipsAndLeadership || 'AI Club Vice President, 1 Summer Research Assistantship on Causal Inference',
    softSkills: userProfile.studentAnswers?.softSkills || 'Analytical Problem Solving, Technical Writing, Teamwork, Fast Learning',
    enjoyedSubjects: userProfile.studentAnswers?.enjoyedSubjects || 'Applied Machine Learning, Statistical Inference, Data Visualization',
    firstJobPriorities: userProfile.studentAnswers?.firstJobPriorities || 'Strong Mentorship & Learning Opportunities, followed by Career Growth',
    preferredWorkEnvironment: userProfile.studentAnswers?.preferredWorkEnvironment || 'Fast-paced Tech / Structured High-Growth Startup with collaborative mentorship',
    roleType: userProfile.studentAnswers?.roleType || 'Full-time Entry-Level / New Grad (or Summer Internship)',
    workLocationPreference: userProfile.studentAnswers?.workLocationPreference || 'Hybrid or Remote; Open to relocating to major tech hubs',
    targetStartingSalary: userProfile.studentAnswers?.targetStartingSalary || (userProfile.targetSalary || '$95,000 - $130,000 Base ($140k+ TC)'),
    availabilityDate: userProfile.studentAnswers?.availabilityDate || 'Immediately upon graduation / Summer 2026',
    careerVsHigherEd: userProfile.studentAnswers?.careerVsHigherEd || 'Entering the workforce immediately to gain hands-on production engineering experience',
    dreamCompaniesAndTitles: userProfile.studentAnswers?.dreamCompaniesAndTitles || `Junior Data Scientist, Associate ML Engineer, Data Analyst at ${(userProfile.targetCompanies || ['Google', 'Meta', 'Stripe']).join(', ')}`,
    supportAreasNeeded: userProfile.studentAnswers?.supportAreasNeeded || 'ATS Resume Optimization, GitHub Project Showcase, and Technical/STAR Interview Preparation',
    recommendedCertificationsNeeded: userProfile.studentAnswers?.recommendedCertificationsNeeded || 'Yes, recommendations for AWS Cloud Practitioner, Coursera DeepLearning.AI, and production MLOps projects'
  });

  // Experienced Professional 16 Questions State
  const [experiencedData, setExperiencedData] = useState<ExperiencedAnswers>({
    currentRoleAndTenure: userProfile.experiencedAnswers?.currentRoleAndTenure || `${userProfile.currentRole} (${userProfile.yearsOfExperience || 4} years)`,
    proficientSkillsAndTools: userProfile.experiencedAnswers?.proficientSkillsAndTools || (userProfile.keySkills?.join(', ') || 'Python, Distributed Systems, SQL, Cloud Architecture, Team Leadership'),
    skillsToLeaveBehind: userProfile.experiencedAnswers?.skillsToLeaveBehind || 'Enjoy: End-to-end architecture & cross-functional modeling. Leave behind: Legacy ETL maintenance and manual reporting.',
    formalEducationAndCerts: userProfile.experiencedAnswers?.formalEducationAndCerts || 'B.S. in Computer Science / Engineering, AWS Certified Solutions Architect',
    nextRolePriorities: userProfile.experiencedAnswers?.nextRolePriorities || 'Higher Earning Potential ($250k+ TC) and Rapid Progression to Staff / Principal scope',
    idealManagementStyle: userProfile.experiencedAnswers?.idealManagementStyle || 'High-trust, autonomous leadership with clear OKRs and engineering sponsor support',
    energizingPastProjects: userProfile.experiencedAnswers?.energizingPastProjects || 'Architected a low-latency caching layer that cut p99 response time by 65% and unblocked $2M ARR',
    workLocationPreference: userProfile.experiencedAnswers?.workLocationPreference || 'Remote or Hybrid (SF / New York / Remote)',
    targetCompensation: userProfile.experiencedAnswers?.targetCompensation || (userProfile.targetSalary || '$180,000 - $230,000 Base ($300k+ Total Comp)'),
    weeklyUpskillingHours: userProfile.experiencedAnswers?.weeklyUpskillingHours || '8-10 hours per week for interview prep and system design deep-dives',
    careerMoveUrgency: userProfile.experiencedAnswers?.careerMoveUrgency || 'Actively preparing to transition within the next 3 to 6 months',
    careerGoalType: userProfile.experiencedAnswers?.careerGoalType || 'Grow into Staff Individual Contributor (or Lead) with cross-team architectural ownership',
    targetCompaniesAndTitles: userProfile.experiencedAnswers?.targetCompaniesAndTitles || `${userProfile.targetRoles?.[0] || 'Staff Engineer'} at ${(userProfile.targetCompanies || ['Stripe', 'Datadog', 'Amazon', 'Meta']).join(', ')}`,
    emergingVsTraditional: userProfile.experiencedAnswers?.emergingVsTraditional || 'High-growth emerging AI / Cloud platforms with modern tech stack',
    desiredGuidanceFormat: userProfile.experiencedAnswers?.desiredGuidanceFormat || 'Structured 30-60-90 day milestone roadmap and rigorous FAANG Bar-Raiser mock interview practice',
    qualificationBridgeNeeds: userProfile.experiencedAnswers?.qualificationBridgeNeeds || 'Guidance on executive presence framing and multi-region distributed disaster recovery RFCs'
  });

  const [chosenTargetRole, setChosenTargetRole] = useState(userProfile.targetRoles?.[0] || 'Data Scientist');
  const [chosenCurrentRole, setChosenCurrentRole] = useState(userProfile.currentRole || 'Student');

  if (!isOpen) return null;

  const handleSaveAndGenerate = () => {
    const updatedProfile: Partial<UserProfile> = {
      candidateTrack: activeTrack,
      currentRole: chosenCurrentRole,
      targetRoles: [chosenTargetRole],
      targetSalary: activeTrack === 'student_fresher' ? studentData.targetStartingSalary : experiencedData.targetCompensation,
      yearsOfExperience: activeTrack === 'student_fresher' ? 0 : (userProfile.yearsOfExperience || 4),
      experienceLevel: activeTrack === 'student_fresher' ? 'Junior (0-2 yrs)' : (userProfile.experienceLevel || 'Mid-Level (3-5 yrs)'),
      studentAnswers: activeTrack === 'student_fresher' ? studentData : userProfile.studentAnswers,
      experiencedAnswers: activeTrack === 'experienced' ? experiencedData : userProfile.experiencedAnswers,
      keySkills: activeTrack === 'student_fresher'
        ? (studentData.technicalToolsAndLanguages?.split(',').map(s => s.trim()).filter(Boolean) || userProfile.keySkills)
        : (experiencedData.proficientSkillsAndTools?.split(',').map(s => s.trim()).filter(Boolean) || userProfile.keySkills)
    };

    onSaveAssessment(updatedProfile, true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[var(--text-main)]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-main)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--text-main)]">
                Apex 16-Question Career Diagnostic
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Provide your specific answers so all chatbot roadmaps, interview simulations, and advice match your exact background and chosen role.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Track Selector Bar */}
        <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Candidate Track:</span>
            <button
              onClick={() => setActiveTrack('student_fresher')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTrack === 'student_fresher'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student & Fresher (16 Questions)</span>
            </button>

            <button
              onClick={() => setActiveTrack('experienced')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTrack === 'experienced'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Experienced Professional (16 Questions)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">Target Role:</span>
            <input
              type="text"
              value={chosenTargetRole}
              onChange={(e) => setChosenTargetRole(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-bold focus:outline-none w-36"
              placeholder="e.g. Data Scientist"
            />
          </div>
        </div>

        {/* Steps Pagination Tabs */}
        <div className="px-5 py-2 border-b border-[var(--border-color)] bg-[var(--bg-main)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { num: 1, label: 'Background & Education' },
              { num: 2, label: 'Skills & Experience' },
              { num: 3, label: 'Preferences & Priorities' },
              { num: 4, label: 'Goals & Guidance' }
            ].map(step => (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num as any)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  activeStep === step.num
                    ? 'bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Part {step.num}: {step.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-[var(--text-muted)] font-mono">
            {activeStep} of 4 (4 Questions per section)
          </span>
        </div>

        {/* Questions Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* TRACK 1: STUDENT & FRESHER QUESTIONS */}
          {activeTrack === 'student_fresher' && (
            <div className="space-y-4 animate-fade-in">
              {activeStep === 1 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">1</span>
                      What is your degree, major, and graduation date (or expected graduation date)?
                    </label>
                    <input
                      type="text"
                      value={studentData.degreeAndMajor || ''}
                      onChange={(e) => setStudentData({ ...studentData, degreeAndMajor: e.target.value })}
                      placeholder="e.g. B.S. in Computer Science / Statistics, Graduating May 2026"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">2</span>
                      What relevant coursework, academic projects, or lab work have you completed?
                    </label>
                    <textarea
                      rows={2}
                      value={studentData.courseworkAndProjects || ''}
                      onChange={(e) => setStudentData({ ...studentData, courseworkAndProjects: e.target.value })}
                      placeholder="e.g. Machine Learning, Natural Language Processing, Capstone Fraud Detection Classifier"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">3</span>
                      What technical tools, software, programming languages, or practical skills do you know?
                    </label>
                    <input
                      type="text"
                      value={studentData.technicalToolsAndLanguages || ''}
                      onChange={(e) => setStudentData({ ...studentData, technicalToolsAndLanguages: e.target.value })}
                      placeholder="e.g. Python, SQL, Pandas, Scikit-Learn, Git, PyTorch, Docker"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">4</span>
                      Have you completed any internships, volunteer work, campus leadership roles, or part-time jobs?
                    </label>
                    <textarea
                      rows={2}
                      value={studentData.internshipsAndLeadership || ''}
                      onChange={(e) => setStudentData({ ...studentData, internshipsAndLeadership: e.target.value })}
                      placeholder="e.g. 1 summer Data Analyst internship, VP of Women in STEM, Peer Math Tutor"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">5</span>
                      What soft skills (e.g., communication, problem-solving, teamwork) do you feel are your strongest?
                    </label>
                    <input
                      type="text"
                      value={studentData.softSkills || ''}
                      onChange={(e) => setStudentData({ ...studentData, softSkills: e.target.value })}
                      placeholder="e.g. Analytical reasoning, clear data presentation, cross-functional collaboration"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">6</span>
                      Which subjects or project topics have you enjoyed the most during your studies?
                    </label>
                    <input
                      type="text"
                      value={studentData.enjoyedSubjects || ''}
                      onChange={(e) => setStudentData({ ...studentData, enjoyedSubjects: e.target.value })}
                      placeholder="e.g. Predictive Modeling, Time-Series Forecasting, Deep Learning Architectures"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">7</span>
                      What key factors matter most in your first job—learning opportunities, mentorship, brand reputation, salary, or work-life balance?
                    </label>
                    <input
                      type="text"
                      value={studentData.firstJobPriorities || ''}
                      onChange={(e) => setStudentData({ ...studentData, firstJobPriorities: e.target.value })}
                      placeholder="e.g. Structured 1:1 mentorship and fast technical learning curves"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">8</span>
                      What type of work environment or company culture do you prefer (e.g., fast-paced startup, structured corporate, research lab)?
                    </label>
                    <input
                      type="text"
                      value={studentData.preferredWorkEnvironment || ''}
                      onChange={(e) => setStudentData({ ...studentData, preferredWorkEnvironment: e.target.value })}
                      placeholder="e.g. Fast-paced high-growth startup or collaborative mid-stage tech company"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {activeStep === 3 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">9</span>
                      Are you looking for full-time roles, internships, or graduate training programs?
                    </label>
                    <input
                      type="text"
                      value={studentData.roleType || ''}
                      onChange={(e) => setStudentData({ ...studentData, roleType: e.target.value })}
                      placeholder="e.g. Full-time New Grad Data Scientist / Associate ML Engineer"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">10</span>
                      Are you looking for remote, hybrid, or on-site positions, and are you open to relocating?
                    </label>
                    <input
                      type="text"
                      value={studentData.workLocationPreference || ''}
                      onChange={(e) => setStudentData({ ...studentData, workLocationPreference: e.target.value })}
                      placeholder="e.g. Open to hybrid in SF/Seattle/New York, or fully remote"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">11</span>
                      What is your target starting salary or minimum compensation requirement?
                    </label>
                    <input
                      type="text"
                      value={studentData.targetStartingSalary || ''}
                      onChange={(e) => setStudentData({ ...studentData, targetStartingSalary: e.target.value })}
                      placeholder="e.g. $95,000 - $125,000 Base ($140k+ TC)"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">12</span>
                      How soon are you available to start working?
                    </label>
                    <input
                      type="text"
                      value={studentData.availabilityDate || ''}
                      onChange={(e) => setStudentData({ ...studentData, availabilityDate: e.target.value })}
                      placeholder="e.g. Available immediately or starting June 2026 post-graduation"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {activeStep === 4 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">13</span>
                      Are you planning to enter the workforce immediately, or considering higher education/further studies?
                    </label>
                    <input
                      type="text"
                      value={studentData.careerVsHigherEd || ''}
                      onChange={(e) => setStudentData({ ...studentData, careerVsHigherEd: e.target.value })}
                      placeholder="e.g. Entering the workforce immediately to build real-world experience"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">14</span>
                      Are there specific entry-level job titles, target industries, or dream companies you want to pursue?
                    </label>
                    <input
                      type="text"
                      value={studentData.dreamCompaniesAndTitles || ''}
                      onChange={(e) => setStudentData({ ...studentData, dreamCompaniesAndTitles: e.target.value })}
                      placeholder="e.g. Junior Data Scientist, ML Engineer at Google, Spotify, Snowflake"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">15</span>
                      Do you need help with resume building, portfolio creation, LinkedIn optimization, or interview preparation?
                    </label>
                    <input
                      type="text"
                      value={studentData.supportAreasNeeded || ''}
                      onChange={(e) => setStudentData({ ...studentData, supportAreasNeeded: e.target.value })}
                      placeholder="e.g. Resume building, GitHub project showcase, and mock behavioral interviews"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold">16</span>
                      Would you like recommendations for certifications, online courses, or hands-on projects to make your profile stand out?
                    </label>
                    <input
                      type="text"
                      value={studentData.recommendedCertificationsNeeded || ''}
                      onChange={(e) => setStudentData({ ...studentData, recommendedCertificationsNeeded: e.target.value })}
                      placeholder="e.g. Yes! High-signal certifications and portfolio project ideas"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* TRACK 2: EXPERIENCED PROFESSIONAL QUESTIONS */}
          {activeTrack === 'experienced' && (
            <div className="space-y-4 animate-fade-in">
              {activeStep === 1 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">1</span>
                      What is your current role or field of study, and how long have you been in it?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.currentRoleAndTenure || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, currentRoleAndTenure: e.target.value })}
                      placeholder="e.g. Senior Data Analyst (4 years in FinTech)"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">2</span>
                      What technical skills, soft skills, or tools are you most proficient at?
                    </label>
                    <textarea
                      rows={2}
                      value={experiencedData.proficientSkillsAndTools || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, proficientSkillsAndTools: e.target.value })}
                      placeholder="e.g. Python, SQL, dbt, Snowflake, Distributed Pipelines, Stakeholder Management"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">3</span>
                      Which of your current skills do you enjoy using the most, and which would you prefer to leave behind?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.skillsToLeaveBehind || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, skillsToLeaveBehind: e.target.value })}
                      placeholder="e.g. Enjoy: System architecture & ML modeling. Leave behind: Manual reporting & legacy Excel"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">4</span>
                      What formal education, certifications, or specialized training do you currently hold?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.formalEducationAndCerts || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, formalEducationAndCerts: e.target.value })}
                      placeholder="e.g. B.S. in Computer Science, AWS Certified Solutions Architect Associate"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">5</span>
                      What matters most to you in your next role—higher earning potential, work-life balance, rapid progression, impact, or job security?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.nextRolePriorities || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, nextRolePriorities: e.target.value })}
                      placeholder="e.g. Higher earning potential ($250k+ TC) and high technical ownership"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">6</span>
                      What type of team dynamic or management style helps you perform at your best?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.idealManagementStyle || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, idealManagementStyle: e.target.value })}
                      placeholder="e.g. High autonomy, clear objectives, minimal micromanagement"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">7</span>
                      Looking back at past projects or jobs, what tasks made you feel most energized and accomplished?
                    </label>
                    <textarea
                      rows={2}
                      value={experiencedData.energizingPastProjects || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, energizingPastProjects: e.target.value })}
                      placeholder="e.g. Leading the design of our automated real-time fraud scoring pipeline"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">8</span>
                      Are you looking for remote, hybrid, or on-site roles, and are you open to relocating?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.workLocationPreference || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, workLocationPreference: e.target.value })}
                      placeholder="e.g. Remote or Hybrid (SF / NYC), open to relocation for the right offer"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </>
              )}

              {activeStep === 3 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">9</span>
                      What is your target salary or minimum compensation threshold?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.targetCompensation || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, targetCompensation: e.target.value })}
                      placeholder="e.g. $190,000 - $240,000 Base ($300k+ TC)"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">10</span>
                      How much time can you dedicate to upskilling, job searching, or transitional training per week?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.weeklyUpskillingHours || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, weeklyUpskillingHours: e.target.value })}
                      placeholder="e.g. 8-10 hours per week"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">11</span>
                      How urgently do you need or want to make a career move?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.careerMoveUrgency || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, careerMoveUrgency: e.target.value })}
                      placeholder="e.g. Within the next 3 to 6 months"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">12</span>
                      Are you looking to grow within your current domain, pivot to a completely new industry, or transition into management?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.careerGoalType || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, careerGoalType: e.target.value })}
                      placeholder="e.g. Pivot from Data Analyst to Staff Data Scientist / Applied ML"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </>
              )}

              {activeStep === 4 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">13</span>
                      Are there specific job titles, target companies, or industries you are already curious about?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.targetCompaniesAndTitles || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, targetCompaniesAndTitles: e.target.value })}
                      placeholder="e.g. Staff Data Scientist at Stripe, Datadog, Snowflake, Uber"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">14</span>
                      Are you interested in emerging fields or do you prefer established traditional sectors?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.emergingVsTraditional || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, emergingVsTraditional: e.target.value })}
                      placeholder="e.g. Emerging Generative AI & Cloud infrastructure platforms"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">15</span>
                      Do you want a structured step-by-step roadmap, a broad list of recommended roles, or specific advice on resumes and interviews?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.desiredGuidanceFormat || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, desiredGuidanceFormat: e.target.value })}
                      placeholder="e.g. Step-by-step 30-60-90 roadmap + rigorous STAR mock interview coaching"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-bold">16</span>
                      Would you like recommendations on specific courses, certifications, or projects to bridge any missing qualifications?
                    </label>
                    <input
                      type="text"
                      value={experiencedData.qualificationBridgeNeeds || ''}
                      onChange={(e) => setExperiencedData({ ...experiencedData, qualificationBridgeNeeds: e.target.value })}
                      placeholder="e.g. Yes! Recommendations for System Design, Advanced ML Serving, and RFC Writing"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3 border-t border-[var(--border-color)] bg-[var(--bg-main)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep((activeStep - 1) as any)}
                className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous Part
              </button>
            )}

            {activeStep < 4 && (
              <button
                onClick={() => setActiveStep((activeStep + 1) as any)}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] flex items-center gap-1 transition-colors"
              >
                Next Part <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndGenerate}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Save Answers & Generate Plan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
