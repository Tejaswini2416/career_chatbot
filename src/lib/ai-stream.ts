import { AppMode, UserProfile } from './types';
import { getResourcesForRole } from './resources';

/**
 * Generates a comprehensive personalized Career Plan based on the questions
 * answered by the user during registration (skills, experience, target role, industry).
 */
export function generateCareerPlanFromProfile(profile: UserProfile): string {
  const name = profile.fullName || 'Professional';
  const targetRole = profile.targetRoles?.[0] || 'Senior / Staff Professional';
  const targetComp = profile.targetSalary || '$200,000+ TC';
  const resources = getResourcesForRole(targetRole, profile.keySkills);
  const youtubeResources = resources.filter(r => r.type === 'youtube');
  const practiceResources = resources.filter(r => r.type === 'practice' || r.type === 'test' || r.type === 'roadmap');

  const isStudent = 
    profile.candidateTrack === 'student_fresher' ||
    /student|fresher|intern|undergrad|graduate/i.test(profile.currentRole || '') ||
    profile.yearsOfExperience <= 1;

  // Track 1: Student and Fresher (16 Questions Baseline)
  if (isStudent) {
    const student = profile.studentAnswers || {};
    const degree = student.degreeAndMajor || 'B.S. in Computer Science / Data Science (Expected 2026)';
    const coursework = student.courseworkAndProjects || 'Machine Learning, Algorithms & Data Structures, Capstone Predictive Model';
    const skills = student.technicalToolsAndLanguages || (profile.keySkills || []).join(', ') || 'Python, SQL, Pandas, Scikit-Learn, Git';
    const leadership = student.internshipsAndLeadership || 'AI Club leadership & academic lab research';
    const softSkills = student.softSkills || 'Analytical problem solving, rapid learning, clear technical communication';
    const priorities = student.firstJobPriorities || 'Strong mentorship and rapid technical learning curves';
    const environment = student.preferredWorkEnvironment || 'High-growth collaborative technology environment';
    const roleType = student.roleType || 'Full-time Entry-Level / New Grad';
    const location = student.workLocationPreference || 'Hybrid or Remote; open to tech hubs';
    const companies = student.dreamCompaniesAndTitles || (profile.targetCompanies || ['Tier-1 Tech Companies', 'High-Growth AI Startups']).join(', ');

    return `### 🎓 Personalized Early-Career Launchpad for ${name}

Welcome to Apex Career AI! Based on your **Student & Fresher Diagnostic**, here is your customized strategic roadmap to launch your career as an entry-level **${targetRole}** targeting **${targetComp}**.

---

#### 📋 1. Academic & Early-Career Baseline Audit
* **Academic Foundation**: ${degree}.
* **Coursework & Academic Projects**: ${coursework}.
* **Technical Repertoire**: ${skills}.
* **Internships & Campus Leadership**: ${leadership}.
* **Soft Skills & Superpowers**: ${softSkills}.
* **Target Objective**: **${roleType}** in a **${environment}** (${location}).
* **Core Career Value**: Prioritizing **${priorities}**.

---

#### 🎯 2. Target Role Requirements: Entry-Level ${targetRole}
To secure a high-paying offer as an entry-level **${targetRole}**, hiring teams evaluate:
1. *Production Engineering Foundations*: Moving beyond school labs and single Jupyter notebooks to clean, modular code with Git version control, unit tests, and virtual environments.
2. *Demonstrated Portfolio Depth*: 2-3 end-to-end, reproducible portfolio projects deployed on GitHub/HuggingFace with live READMEs explaining data sources, trade-offs, and metrics.
3. *Technical Problem Solving & STAR Fluency*: Solving algorithmic questions under time constraints and answering behavioral questions using academic team and leadership challenges.

---

#### 🚀 3. Actionable 30-60-90 Day New Grad Milestone Roadmap

##### 📅 Month 1 (Days 1–30): Production Portfolio & ATS Resume Overhaul
* **Portfolio Showcase**: Package your top academic project into a production-grade GitHub repo with clean modular code, unit tests, Dockerfile, and a live web demo (Streamlit / Vercel).
* **ATS Entry-Level Resume Overhaul**: In **Document Studio**, reformat your resume to lead with technical projects and quantifiable outcomes (e.g. *"trained a classifier on 250k rows achieving 91% F1-score with 12ms inference latency"*).
* **Core Skill Reinforcement**: Complete daily algorithmic and SQL problems to build speed and accuracy.

##### 📅 Month 2 (Days 31–60): Targeted Early-Career Applications & Technical Prep
* **Early-Career Outreach**: Submit targeted applications for new grad and associate roles at your target companies (${companies}).
* **Alumni & Recruiter Networking**: Conduct 5 informational chats with university alumni currently working as a ${targetRole}.
* **Live Mock Interview Practice**: Run weekly sessions in **Mock Interview Studio** to practice technical coding and behavioral STAR questions.

##### 📅 Month 3 (Days 61–90): High-Stakes Rounds & Offer Negotiation
* **Mock Interview Mastery**: Complete the sequential 3-round interview simulator with live speech telemetry and eye-contact tracking.
* **Offer Evaluation & Mentorship Assessment**: In the **Comp Negotiation Lab**, evaluate competing offers for mentorship quality, equity, and learning velocity.
* **First 90 Days Readiness**: Review the **First 90 Days Roadmap** to ensure you establish immediate credibility on your new team.

---

#### 🎥 4. Curated YouTube Learning Playlists & Courses for ${targetRole}
${youtubeResources.slice(0, 4).map(r => `* [**${r.title}**](${r.url}) — *${r.description}*`).join('\n')}

---

#### 🧪 5. Testing, Certification & Hands-On Practice Sites for ${targetRole}
${practiceResources.slice(0, 4).map(r => `* [**${r.title}**](${r.url}) — *${r.description}*`).join('\n')}

---

*Ready to start? Launch your **Mock Interview Studio**, refine your **ATS Resume** in Document Studio, or ask any strategic career question below!*`;
  }

  // Track 2: Experienced Professional (16 Questions Baseline)
  const exp = profile.experiencedAnswers || {};
  const currentRole = profile.currentRole || 'Software Engineer';
  const expYears = profile.yearsOfExperience || 4;
  const skillsList = exp.proficientSkillsAndTools || (profile.keySkills || []).join(', ') || 'System Architecture, Python, Cloud Platforms';
  const skillsToLeave = exp.skillsToLeaveBehind || 'Legacy maintenance and manual reporting';
  const careerGoal = exp.careerGoalType || `Advance to Staff / Lead ${targetRole}`;
  const priority = exp.nextRolePriorities || 'Higher compensation and high technical scope';
  const weeklyHours = exp.weeklyUpskillingHours || '8-10 hours per week';
  const companies = exp.targetCompaniesAndTitles || (profile.targetCompanies || ['Tier-1 Tech Companies']).join(', ');

  return `### 🎯 Personalized Career Acceleration Plan for ${name}

Welcome to Apex Career AI! Based on your **Experienced Professional Diagnostic**, here is your customized strategic roadmap to transition from **${currentRole}** (${expYears} YOE) to **${targetRole}** targeting **${targetComp}**.

---

#### 📊 1. Baseline Career Audit & Gap Benchmark
* **Current Baseline**: ${expYears} years as ${currentRole} with core competencies in **${skillsList}**.
* **Skills Focus & Evolution**: Actively scaling high-leverage architecture while sunsetting **${skillsToLeave}**.
* **Career Objective**: ${careerGoal} with priority on **${priority}**.
* **Weekly Bandwidth**: Committing **${weeklyHours}** toward strategic career positioning.

---

#### 🏛️ 2. Target Role Requirements: ${targetRole}
Transitioning to **${targetRole}** requires:
1. *Cross-Team Architectural Ownership*: Authoring formal RFCs/ADRs, capacity planning, and leading failure mode analysis.
2. *Executive Framing & Business Impact*: Translating technical architecture into revenue enabled, cost reductions, and developer velocity.
3. *FAANG / Tier-1 Bar-Raiser Readiness*: Mastering rigorous system design, concurrency bottlenecks, and executive STAR interviews.

---

#### 🚀 3. Actionable 30-60-90 Day Milestone Roadmap

##### 📅 Month 1 (Days 1–30): Foundation & High-Leverage Scope
* **Scope Identification**: Audit your current ecosystem. Find an unowned architectural bottleneck affecting multiple teams or critical revenue paths.
* **Author an RFC/ADR**: Create a formal 2-page design doc outlining options, trade-offs, and failure recovery.
* **Executive ATS Resume Overhaul**: Update your resume in **Document Studio** to feature quantified scale and executive impact.

##### 📅 Month 2 (Days 31–60): Ownership & Delivery Verification
* **Lead Delivery**: Direct the rollout of high-leverage architecture with automated observability and alerting.
* **Team Mentorship**: Coach team members through technical roadblocks to build your organizational multiplier track record.
* **Multimodal Interview Practice**: Run weekly sessions in **Mock Interview Studio** with live speech and presence telemetry.

##### 📅 Month 3 (Days 61–90): Narrative Packaging & Compensation Positioning
* **Staff Brag Sheet**: Compile a quantitative portfolio of reliability gains and business revenue unlocked.
* **Strategic Market Outreach**: Deploy targeted recruiter outreach and warm referrals at top-tier organizations (${companies}).
* **Comp Negotiation**: Formulate data-backed counter-offers in the **Comp Negotiation Lab**.

---

#### 🎥 4. Curated YouTube Learning Playlists & Courses for ${targetRole}
${youtubeResources.slice(0, 4).map(r => `* [**${r.title}**](${r.url}) — *${r.description}*`).join('\n')}

---

#### 🧪 5. Testing, Certification & Hands-On Practice Sites for ${targetRole}
${practiceResources.slice(0, 4).map(r => `* [**${r.title}**](${r.url}) — *${r.description}*`).join('\n')}

---

*Ready to start? Launch your **Mock Interview Studio**, refine your **ATS Resume** in Document Studio, or ask any strategic career question below!*`;
}

/**
 * Intelligent contextual response simulator for Apex AI Career Coach.
 * Supports structured mock interviews (evaluation only at the end) and role-specific guidance.
 */
export function generateContextualApexResponse(
  prompt: string,
  profile: UserProfile,
  mode: AppMode,
  messagesHistory: { role: string; content: string }[] = []
): string {
  const name = profile.fullName || 'there';
  const role = profile.currentRole || 'Software Engineer';
  const targetRoles = profile.targetRoles?.join(' or ') || 'Staff Engineer';
  const targetRoleSingle = profile.targetRoles?.[0] || 'Staff Software Engineer';
  const skills = profile.keySkills?.slice(0, 5).join(', ') || 'System Architecture, TypeScript, Cloud Platforms';
  const targetCompanies = profile.targetCompanies?.slice(0, 3).join(', ') || 'Tier-1 Tech Companies';
  const lowerPrompt = prompt.toLowerCase();
  const resources = getResourcesForRole(targetRoleSingle, profile.keySkills);

  // 1. MOCK INTERVIEW MODE
  if (mode === 'interview' || lowerPrompt.includes('mock interview') || lowerPrompt.includes('start interview')) {
    
    // Count how many questions were already asked in this session
    const interviewMessages = messagesHistory.filter(m => 
      m.content.includes('Question 1') || 
      m.content.includes('Question 2') || 
      m.content.includes('Question 3') ||
      m.role === 'user'
    );
    const userAnswersCount = messagesHistory.filter(m => m.role === 'user').length;

    const isExplicitFinish = 
      lowerPrompt.includes('finish') || 
      lowerPrompt.includes('wrap up') || 
      lowerPrompt.includes('debrief') || 
      lowerPrompt.includes('results') ||
      lowerPrompt.includes('score') ||
      userAnswersCount >= 3;

    // A. END OF INTERVIEW: Comprehensive Results, Scoring & Suggestions
    if (isExplicitFinish && userAnswersCount >= 1) {
      const youtubeLinks = resources.filter(r => r.type === 'youtube').slice(0, 3);
      const testLinks = resources.filter(r => r.type === 'practice' || r.type === 'test').slice(0, 3);

      return `### 📋 Comprehensive Mock Interview Results & Performance Report

Candidate: **${name}**  
Target Role: **${targetRoleSingle}**  
Interview Domain: **Behavioral STAR & Technical Architecture Bar-Raiser**  
Outcome: **STRONG HIRE (Score: 8.6 / 10)**

---

#### 📊 1. Overall Performance Summary
You demonstrated strong technical credibility and crisp ownership tailored to the expectations of a **${targetRoleSingle}**. Your answers reflected real-world engineering depth and cross-functional leadership.

* **Situation Framing (8.5 / 10)**: Clear technical complexity and team scale established upfront.
* **Task Ownership (8.8 / 10)**: You clearly distinguished your specific leadership mandate from the general team effort.
* **Action & Technical Depth (9.0 / 10)**: Thorough articulation of trade-offs, architecture decisions, and alignment mechanisms.
* **Result & Metrics (8.1 / 10)**: Good delivery; attaching specific dollar values or percentage gains will elevate this to the top 1% tier.

---

#### 🔍 2. Question-by-Question Evaluation Breakdown

##### **Question 1: Resolving High-Stakes Technical Disagreements**
* **Score**: **8.8 / 10**
* **Observed Strengths**: Framed conflict objectively around architectural latency and data consistency rather than team politics.
* **Improvement Area**: Explicitly cite the consensus document used (e.g. authoring an RFC or Architecture Decision Record).
* **Apex Benchmark Answer**:
  > *"When senior leads deadlocked on synchronous REST vs. asynchronous Kafka event streaming, I authored a concise 2-page ADR comparing throughput requirements and p99 failure cascades. By establishing a phased hybrid milestone, we hit our quarterly launch date while guaranteeing 99.99% data consistency."*

##### **Question 2: Diagnosing Production Outages & Systemic Safeguards**
* **Score**: **8.5 / 10**
* **Observed Strengths**: Took extreme ownership of the failure, detailed the root-cause analysis (RCA), and focused on prevention.
* **Improvement Area**: Quantify the impact reduction (e.g. *"cut Mean Time to Detection from 45 min to under 90 sec via automated canary rollbacks"*).
* **Apex Benchmark Answer**:
  > *"Following a cascading Redis connection pool saturation that caused a 14-minute checkout outage, I led a blameless post-mortem. We implemented automated circuit-breakers with adaptive rate limiting and synthetic canary probes, completely preventing recurrence and recovering $320k in at-risk revenue."*

##### **Question 3: Influencing Executive Leadership & Product Deadlines**
* **Score**: **8.6 / 10**
* **Observed Strengths**: Balanced engineering rigor with business empathy, articulating why paying down technical debt enabled long-term feature velocity.
* **Improvement Area**: Use financial language (ROI, risk reduction, customer retention) when pitching to VPs.

---

#### 💡 3. Key Suggestions for Improvement
1. **Always Anchor on Business Dollars & Velocity**: Top-tier tech firms look for engineers who understand that technical excellence serves business goals.
2. **Standardize the STAR Rhythm**: Limit Situation to 15%, Task to 15%, spend 50% on deliberate Actions taken, and reserve 20% for concrete Results.
3. **Highlight Reusable Organizational Impact**: Emphasize how your solutions became company-wide templates or standards.

---

#### 🎥 4. Recommended Study & Practice Resources
To practice and perfect your interview delivery for **${targetRoleSingle}**:

##### Curated YouTube Tutorials:
${youtubeLinks.map(r => `* [**${r.title}**](${r.url}) — *${r.description}*`).join('\n')}

##### Interactive Testing & Mock Platforms:
${testLinks.map(r => `* [**${r.title}**](${r.url}) — *${r.description}*`).join('\n')}

---
*Interview session completed! You can review your debrief, start a fresh interview round, or export your results.*`;
    }

    // B. QUESTION 2 OF 3 (After user answers Question 1)
    if (userAnswersCount === 1) {
      return `### 🎙️ Mock Interview in Progress (Role: ${targetRoleSingle})

*Answer recorded for Question 1. All performance ratings, STAR feedback, and improvement suggestions will be delivered together at the end of the round.*

---

#### ❓ Question 2 of 3:
> **"Tell me about a high-severity production failure, outage, or scaling bottleneck that occurred under your watch. Walk me through how you diagnosed the root cause under pressure, and what systemic architectural safeguards you implemented to ensure it could never happen again."**

*Tip: Be transparent about the failure, detail your diagnostic methodology, and quantify how the safeguards improved long-term reliability. Type or speak your answer below.*`;
    }

    // C. QUESTION 3 OF 3 (After user answers Question 2)
    if (userAnswersCount === 2) {
      return `### 🎙️ Mock Interview in Progress (Role: ${targetRoleSingle})

*Answer recorded for Question 2. Proceeding to the final question of this round.*

---

#### ❓ Question 3 of 3:
> **"Describe a situation where Product or Executive leadership pushed for an aggressive launch deadline that would have introduced unacceptable technical debt or security risk. How did you negotiate scope, align stakeholders, and protect system integrity without damaging relationships?"**

*Tip: Emphasize business trade-offs, executive empathy, and the quantifiable outcome. After you answer this question, your full comprehensive evaluation report will be generated!*`;
    }

    // D. INITIAL QUESTION 1 OF 3 (Interview Kickoff)
    return `### 🎙️ Live Mock Interview Round: ${targetRoleSingle}

Welcome, **${name}**. I will be conducting your structured **Technical & Behavioral Bar-Raiser Interview** tailored specifically to the role of **${targetRoleSingle}**.

#### 📋 Interview Format:
* **3 Progressive Questions** covering Technical Ownership, Production Resilience, and Executive Alignment.
* Answer each question sequentially.
* **Comprehensive Performance Results, STAR Scores (1-10), Apex Benchmark Model Answers, and Curated YouTube/Practice Study Links will be delivered at the conclusion of the interview.**

---

#### ❓ Question 1 of 3:
> **"Describe a high-stakes scenario where two senior engineering leads had fundamentally opposing technical opinions on a critical architecture decision. How did you evaluate the trade-offs, resolve the deadlock, gain stakeholder buy-in, and what was the quantifiable outcome?"**

*Structure your answer with Situation, Task, Action, and Result. When you are ready, type or speak your answer below.*`;
  }

  // 2. DOCUMENT STUDIO MODE
  if (mode === 'studio' || lowerPrompt.includes('resume') || lowerPrompt.includes('cover letter') || lowerPrompt.includes('ats')) {
    if (lowerPrompt.includes('cover letter')) {
      return `### 📄 Targeted Executive Cover Letter

**${profile.fullName}**  
${profile.currentRole} | ${profile.industry}  
Target: **${targetRoles}** at **${targetCompanies}**

---

Dear Hiring Team at **${targetCompanies.split(',')[0]}**,

I am writing to express my enthusiastic interest in the **${targetRoleSingle}** opening. With over **${profile.yearsOfExperience} years** of experience scaling high-throughput distributed systems and leading cross-functional engineering pods, I have consistently focused on building resilient architectures that unlock measurable business velocity.

At my current role as **${role}**, I directed critical platform initiatives leveraging **${skills}**, leading cross-team efforts that slashed latency and supported millions in transaction volume. My approach balances rigorous technical execution with empathetic squad mentorship—ensuring that architecture decisions directly serve long-term product roadmaps.

What particularly draws me to **${targetCompanies.split(',')[0]}** is your commitment to developer velocity and high-scale reliability. I am eager to bring my background in high-availability platforms, proactive system governance, and cross-team leadership to help accelerate your engineering initiatives.

Thank you for your time and consideration. I welcome the opportunity to discuss how my technical leadership can drive immediate impact for your organization.

Sincerely,  
**${profile.fullName}**`;
    }

    const asksForQuestionFlow = lowerPrompt.includes('ask a series') || 
      lowerPrompt.includes('ask questions') || 
      lowerPrompt.includes('ask me') || 
      lowerPrompt.includes('questionnaire') ||
      lowerPrompt.includes('question series') ||
      lowerPrompt.includes('build resume via q&a');

    // If user explicitly asks the chatbot to ask a series of questions before generating the resume
    if (asksForQuestionFlow) {
      return `### 📝 Interactive ATS Resume Builder: Targeted Question Series

I will craft an ATS-optimized, high-conversion resume tailored strictly to your real accomplishments! Please answer these 5 targeted questions (you can reply with all answers at once, or one at a time):

---

#### 1️⃣ Target Role & Candidate Track
* What exact role are you targeting (e.g. *${targetRoleSingle}*, *Machine Learning Engineer*, *Full-Stack Developer*)?
* Are you on the **Student / Fresher Track** (emphasizing academic capstones, hackathons, and foundational coursework) or the **Experienced Professional Track** (emphasizing production scale, leadership, and business metrics)?

#### 2️⃣ Core Technical Proficiencies
* What are your primary **Programming Languages** (e.g., Python, SQL, C++, TypeScript)?
* What **Frameworks & Libraries** (e.g., Pandas, Scikit-Learn, PyTorch, React)?
* What **Databases & Tools** (e.g., PostgreSQL, Docker, Git, AWS)?

#### 3️⃣ Key Technical Projects or Work Experience (With Quantifiable Metrics)
* **Project / Role 1**: Title, organization, technologies used, problem solved, and specific measurable outcome (e.g. *"Achieved 91.4% ROC-AUC on 120k records", "Reduced latency by 40%"*).
* **Project / Role 2**: Title, technologies used, and key accomplishments.

#### 4️⃣ Formal Education & Certifications
* What is your Degree and Major?
* What College / University and Graduation Year?
* Any GPA, Academic Honors, or specialized Certifications (e.g. AWS, Coursera)?

#### 5️⃣ Contact & Online Profiles
* Your preferred Email, Location, LinkedIn URL, and GitHub / Portfolio link.

---

> 💡 **Tip**: You can reply directly here with your answers, or click the **"✨ Generate via Q&A"** button in Document Studio to use the visual step-by-step questionnaire modal with live preview and 1-click PDF download!`;
    }

    const isStudent = profile.candidateTrack === 'student_fresher' || /student|fresher|intern/i.test(profile.currentRole);

    if (isStudent) {
      return `### 📄 ATS-Optimized Resume Draft

# **${profile.fullName.toUpperCase()}**
**Aspiring ${targetRoleSingle} | Early-Career Specialist**  
Email: ${profile.fullName.toLowerCase().replace(/\s+/g, '.')}@example.com | San Francisco, CA | LinkedIn / GitHub

---

## 🎯 PROFESSIONAL SUMMARY
Analytical and high-velocity Computer Science & Data graduate targeting entry-level **${targetRoleSingle}** positions. Strong practical foundation in **${profile.keySkills.join(', ') || 'Python, SQL, Machine Learning'}**. Proven track record building end-to-end predictive models, conducting exploratory data analysis on real-world datasets, and orchestrating automated data pipelines.

---

## 🛠️ CORE TECHNICAL SKILLS
- **Programming & Analysis**: ${profile.keySkills.join(', ')}, Python (Pandas, NumPy, Scikit-Learn), SQL, R, Bash
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
- **Academic Honors**: Dean's Honor Roll, Member of Campus AI & Data Science Society`;
    }

    return `### 📄 ATS-Optimized Resume Draft

# **${profile.fullName.toUpperCase()}**
**${profile.currentRole}** | Target: **${targetRoles}**  
Email: ${profile.fullName.toLowerCase().replace(/\s+/g, '.')}@example.com | San Francisco, CA | LinkedIn / GitHub

---

## 🎯 PROFESSIONAL SUMMARY
Strategic and metric-driven **${profile.currentRole}** with **${profile.yearsOfExperience}+ years** of hands-on expertise architecting resilient cloud systems, microservices, and modern web platforms. Proven track record leading squads of 8+ engineers, reducing system p99 latencies by up to 75%, and driving multi-million dollar business impact across ${profile.industry}.

---

## 🛠️ CORE COMPETENCIES & TECHNICAL SKILLS
- **Languages & Frameworks**: ${profile.keySkills.join(', ')}
- **Architecture & Infrastructure**: Distributed Systems, Microservices, Event-Driven Architecture, CI/CD, Observability
- **Leadership**: Technical Roadmapping, ADR/RFC Governance, Cross-Team Mentorship, Agile Delivery, OKR Alignment

---

## 💼 PROFESSIONAL EXPERIENCE

### **${role.toUpperCase()}** | Current Organization *(2022 – Present)*
- Architected enterprise cloud infrastructure utilizing **${profile.keySkills[0] || 'TypeScript'}** and **${profile.keySkills[1] || 'Distributed Systems'}**, maintaining 99.99% SLA across high-traffic production workloads.
- Spearheaded performance optimization initiative, decreasing p99 server response time from 450ms to 85ms across 15M+ daily requests.
- Mentored and championed career progression for 5 junior and mid-level engineers, fostering an engineering culture of code excellence and proactive testing.
- Partnered directly with Product and Executive leadership to translate strategic business objectives into executable technical roadmaps.

### **SOFTWARE ENGINEER II** | Tech Growth Scale-Up *(2019 – 2022)*
- Developed real-time event streaming pipelines handling 40k+ events/second with automated failure recovery.
- Optimized database indexing and caching strategies in PostgreSQL and Redis, cutting annual cloud infrastructure costs by 28%.
- Integrated automated end-to-end testing suites, reducing critical production regressions by 40%.

---

## 🎓 EDUCATION & CERTIFICATIONS
- **B.S. in Computer Science / Engineering**
- Advanced Distributed Systems & Cloud Architecture Certifications`;
  }

  // 3. COMPENSATION & NEGOTIATION MODE
  if (mode === 'negotiation' || lowerPrompt.includes('salary') || lowerPrompt.includes('equity') || lowerPrompt.includes('offer')) {
    return `### 💼 Compensation & Offer Negotiation Strategy: ${targetRoleSingle}

Navigating compensation for **${targetRoleSingle}** at **${targetCompanies}** requires anchored market data and strategic positioning.

---

#### 🎯 Target Compensation Benchmark
* **Target Base Range**: ${profile.targetSalary || '$220,000 – $260,000'}
* **Target Total Comp (TC)**: $320k - $380k (including RSUs / Equity & Performance Bonus)
* **Market Percentile**: 75th to 90th percentile for ${profile.yearsOfExperience} YOE.

---

#### 🛡️ The 3 Golden Rules of Executive Counter-Offers
1. **Never negotiate against yourself**: Acknowledge enthusiasm for the team first before presenting data-backed counter figures.
2. **Anchor on Total Compensation & Impact**: Tie your counter-offer directly to the high-leverage initiatives you will deliver in the first 6 months.
3. **Bundle Levers**: If base salary is capped, push on Sign-on Bonus, Initial Equity Grant, and Accelerated 6-Month Review Clauses.

---

#### 📝 High-Impact Counter-Offer Email Script
\`\`\`markdown
Subject: Following up on Offer - ${profile.fullName} | ${targetRoleSingle} Role

Hi [Recruiter / Hiring Manager Name],

Thank you so much for extending the offer to join [Company Name] as ${targetRoleSingle}. I am genuinely energized by the team's mission and the scale of the upcoming platform initiatives.

Given my ${profile.yearsOfExperience}+ years of experience scaling distributed systems and the specific technical leadership scope we discussed, I am looking to align the total package with top-of-market benchmarks.

Specifically, I would be thrilled to sign immediately if we can adjust the package to:
- Base Salary: $245,000
- Equity Grant: $200,000 (over 4 years)
- Sign-On Bonus: $25,000

I am confident in my ability to deliver immediate, measurable ROI for the organization and look forward to partnering closely. Please let me know your thoughts on adjusting these levers!

Warm regards,
${profile.fullName}
\`\`\``;
  }

  // 4. ROADMAP & SKILL GAP MODE
  if (mode === 'roadmap' || lowerPrompt.includes('roadmap') || lowerPrompt.includes('skill gap')) {
    const youtubeLinks = resources.filter(r => r.type === 'youtube').slice(0, 3);
    const testLinks = resources.filter(r => r.type === 'practice' || r.type === 'roadmap').slice(0, 3);

    return `### 🗺️ Strategic Career Roadmap & Skill Gap Matrix

Target: **${role}** ➔ **${targetRoleSingle}**  
Execution Horizon: **30 - 60 - 90 Days**

---

#### 🔍 Skill Gap Matrix
| Competency | Current Level | Target Bar (${targetRoleSingle}) | Actionable Priority |
| :--- | :--- | :--- | :--- |
| **System Architecture** | Senior (Single-Domain) | Staff (Multi-System / Org-Wide) | 🔴 High (Author RFCs) |
| **Technical Governance** | Code Reviewer | Standards Creator / Tech Lead | 🟡 Medium |
| **Executive Influence** | Team Internal | Cross-Team / Director Alignment | 🔴 High |
| **Cloud Scale & Reliability** | Advanced | Principal Resilience Specialist | 🟢 On Track |

---

#### 🚀 30-60-90 Day Execution Plan

##### 📅 Month 1 (Days 1–30): Foundation & Cross-Team Visibility
- Identify an unowned, high-friction bottleneck between two engineering teams.
- Author an Architecture Decision Record (ADR) proposing a standard interface.
- Establish weekly 1-on-1s with adjacent Staff Engineers to identify shared platform risks.

##### 📅 Month 2 (Days 31–60): Execution & Measurable Metrics
- Lead the implementation of the approved ADR.
- Track metrics rigorously (e.g., latency reduction, deployment frequency, error rate).
- Present findings in an Engineering All-Hands or tech demo.

##### 📅 Month 3 (Days 61–90): Promotion Narrative & Formal Review
- Compile your **Staff Brag Sheet** detailing squad mentorship, business ROI, and system resilience.
- Schedule a career roadmap alignment meeting with your Engineering Director.

---

#### 🎥 Recommended YouTube Study Playlists
${youtubeLinks.map(r => `* [**${r.title}**](${r.url}) — *${r.description}*`).join('\n')}

#### 🧪 Practice & Testing Roadmaps
${testLinks.map(r => `* [**${r.title}**](${r.url}) — *${r.description}*`).join('\n')}`;
  }

  // 5. MULTIMODAL AUDIO & VOICE INTERVIEW MODE
  if (mode === 'audio_interview' || lowerPrompt.includes('voice') || lowerPrompt.includes('telemetry') || lowerPrompt.includes('audio')) {
    return `### 🎙️ Apex Live Audio & Voice Telemetry Evaluation

Candidate: **${name}** | Target Seniority: **${targetRoleSingle}**

---

#### 📊 Live Speech Telemetry Breakdown
* **Pacing & Cadence**: **138 Words Per Minute** (Optimal executive range is 120–150 WPM).
* **Filler Word Count**: **2 detected** (*"um"*, *"basically"*). Excellent restraint under high-pressure questioning.
* **Response Latency**: **1.4s** pause before answering. Demonstrates composed, deliberate structuring rather than frantic reaction.
* **Perceived Confidence Index**: **92 / 100** (Clear tone modulation and steady vocal projection).

---

#### 💡 Staff Presence Coaching Tip
> *"When framing distributed architectural trade-offs, pause after stating the high-impact metric ($2.4M at-risk or 350ms p99 reduction) for 1 full second. This emphasizes executive gravitas and invites active interviewer engagement."*

*Ready for the next verbal drill? Click **Simulate Answer & Feedback** above or speak your next response.*`;
  }

  // 6. TECHNICAL & ARCHITECTURE SANDBOX MODE
  if (mode === 'sandbox' || lowerPrompt.includes('chaos') || lowerPrompt.includes('system design') || lowerPrompt.includes('sandbox')) {
    return `### 💻 Technical Architecture & Chaos Engineering Evaluation

Architecture: **High-Throughput Global Settlement Topology**  
Evaluation Framework: **CAP Theorem & Multi-Region Resilience**

---

#### ⚡ Chaos Event Analysis: Database Partition Split-Brain
* **Injected Failure**: Secondary AZ Network Partition with 1,200ms tail latency spike.
* **Resilience Assessment**:
  1. *Consensus Quorum*: Raft leader election maintained on primary partition; secondary read-replicas appropriately entered safe degraded read-only mode.
  2. *Connection Multiplexing*: Recommend placing transaction-mode **PgBouncer** ahead of the primary to prevent worker socket starvation.
  3. *Idempotency Guarantee*: Redis cluster write-through caching correctly validated client request idempotency tokens.

---

#### 🛠️ Actionable Recommendation
Deploy an Envoy proxy adaptive rate-limiting filter with exponential backoff and jitter to absorb sudden client reconnect stampedes.`;
  }

  // 7. MARKET INTELLIGENCE & JOB RAG MODE
  if (mode === 'market_intel' || lowerPrompt.includes('market') || lowerPrompt.includes('job description') || lowerPrompt.includes('ingest')) {
    return `### 🧠 Market Intelligence & Skill Delta Analysis

Target Benchmark: **${targetRoleSingle}** at Tier-1 Cloud & FinTech Platforms

---

#### 📊 Compatibility & Delta Summary
* **Overall Market Match**: **86% Alignment** with top 2026 job requisites.
* **Key Differentiators (Top 5% Tier)**:
  - Proven 7+ YOE building high-throughput microservices and distributed event streams.
  - Production TypeScript & cloud platform architecture.
* **Critical Bridge Gap**:
  - Deepen formal RFC/ADR governance and multi-region cross-AZ consensus (Raft/Paxos).

---

#### 📈 Technology Volatility Index
* 🔻 **Declining**: Legacy SOAP (-34%), Traditional jQuery (-48%).
* 🚀 **Surging**: Distributed Vector Databases (+88%), eBPF Observability (+62%), Agentic AI Pipelines (+94%).`;
  }

  // 8. APPLICATION KANBAN & OPPORTUNITY FUNNEL MODE
  if (mode === 'kanban' || lowerPrompt.includes('kanban') || lowerPrompt.includes('application') || lowerPrompt.includes('pipeline')) {
    return `### 📋 Application Pipeline Strategy & Interview Debrief

Candidate: **${name}** | Active Pipeline: **4 Tracked Opportunities**

---

#### 🎯 Pipeline Velocity Recommendations
* **Stage 1 (Wishlist)**: Secure warm 1st-degree referrals for **Scale AI** to increase screening conversion rate from 18% to 65%.
* **Stage 4 (Tech Rounds)**: System Design interview with **Stripe** scheduled for Thursday. Prioritize Raft consensus and p99 latency tuning.
* **Stage 5 (Offer Received)**: Reviewing **Airbnb** offer ($245k Base + $220k Equity). Deploy the **Comp & Tax Lab** to evaluate 4-year vesting and formulate your counter-offer.

---

#### ✉️ Automated 2-Hour Post-Interview Thank-You Blueprint
Keep post-round thank-you emails concise (under 150 words), reiterate enthusiasm, and proactively address any topic where you felt your technical answer was incomplete.`;
  }

  // 9. ON-THE-JOB COMPANION & LONGEVITY MODE
  if (mode === 'on_the_job' || lowerPrompt.includes('first 90 days') || lowerPrompt.includes('brag sheet') || lowerPrompt.includes('burnout')) {
    return `### 🛡️ On-the-Job Longevity & Executive Onboarding Guide

Target Role: **${targetRoleSingle}** | Horizon: **First 90 Days**

---

#### 🗓️ The 30-60-90 Day Impact Sequence
1. **Days 1–30 (Listen & Map)**: Conduct stakeholder interviews with 8 adjacent leads; ship a small CI/CD improvement within week 1.
2. **Days 31–60 (Quick Wins & RFC)**: Author your first architecture RFC and cut system p99 latency on a bottleneck service by 200ms.
3. **Days 61–90 (Strategic Scale)**: Present multi-quarter technical OKRs to the VP of Engineering; establish peer mentorship office hours.

---

#### 🏆 Weekly Brag Sheet Logging
Document every shipped PR, architectural RFC, and cost savings immediately. Quantified tracking accelerates your promotion timeline by 6–12 months.`;
  }

  // 10. DEFAULT GENERAL STRATEGY MODE
  return `### 🚀 Apex Career Strategy Assessment

Hello **${name}**! Based on your profile as a **${role}** targeting **${targetRoleSingle}**, here is your strategic assessment:

---

#### 📌 Context & Alignment
* **Current Trajectory**: ${profile.yearsOfExperience} years of experience in ${profile.industry}.
* **Core Skills**: ${skills}.
* **Target Objective**: Transitioning to **${targetRoleSingle}** with a compensation goal of **${profile.targetSalary || '$220k+'}**.

---

#### 🎯 3 High-Leverage Strategic Priorities
1. **Shift from "Building Features" to "Owning System Constraints"**: Document capacity projections, latency SLAs, and failure modes for core services.
2. **Refine your Narrative for High-Tier Interviews**: Demonstrate metric ownership and deliberate technical trade-offs across every answer.
3. **Curate an Unbeatable Artifact Portfolio**: Keep an updated **ATS-Optimized Resume** and **Staff Brag Sheet** with quantified business metrics.

---

#### 📚 Recommended Study & Practice Links
${resources.slice(0, 4).map(r => `* [**${r.title}**](${r.url}) — *${r.description}*`).join('\n')}

---

*Would you like to start a **Mock Interview** round for ${targetRoleSingle}, polish your **ATS Resume**, or dive into your **30-60-90 Day Roadmap**?*`;
}
