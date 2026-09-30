import React, { useState } from 'react';
import { 
  UserCheck, 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText, 
  Target, 
  Briefcase, 
  DollarSign, 
  Award, 
  Save, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { ExperienceLevel, UserProfile } from '@/lib/types';
import { SAMPLE_PERSONAS } from '@/lib/constants';
import { calculateProfileCompleteness } from '@/lib/utils';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export function ProfileDrawer({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
}: ProfileDrawerProps) {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Sync state if prop changes
  React.useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

  if (!isOpen) return null;

  const completeness = calculateProfileCompleteness(formData);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.keySkills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        keySkills: [...formData.keySkills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      keySkills: formData.keySkills.filter(s => s !== skillToRemove)
    });
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRole.trim() && !formData.targetRoles.includes(newRole.trim())) {
      setFormData({
        ...formData,
        targetRoles: [...formData.targetRoles, newRole.trim()]
      });
      setNewRole('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setFormData({
      ...formData,
      targetRoles: formData.targetRoles.filter(r => r !== roleToRemove)
    });
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompany.trim() && !formData.targetCompanies.includes(newCompany.trim())) {
      setFormData({
        ...formData,
        targetCompanies: [...formData.targetCompanies, newCompany.trim()]
      });
      setNewCompany('');
    }
  };

  const handleRemoveCompany = (companyToRemove: string) => {
    setFormData({
      ...formData,
      targetCompanies: formData.targetCompanies.filter(c => c !== companyToRemove)
    });
  };

  const handleLoadPersona = (persona: typeof SAMPLE_PERSONAS[0]) => {
    setFormData({ ...persona.profile });
    setIsSavedRecently(false);
  };

  const handleSave = () => {
    onSaveProfile(formData);
    setIsSavedRecently(true);
    setTimeout(() => {
      setIsSavedRecently(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-slate-950/95 border-l border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Personalized Profile & Coach Memory
              </h2>
              <p className="text-xs text-slate-400">
                Injected into Apex context for tailored feedback on every run.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Persona Quick Selector */}
        <div className="px-6 py-3 bg-slate-900/80 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Quick Load Sample Personas:
            </span>
            <span className="text-[11px] text-slate-400">1-click demo profiles</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_PERSONAS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleLoadPersona(p)}
                className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-primary-500/50 hover:bg-slate-800/60 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-primary-300">
                    {p.name}
                  </span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1">
                    {p.tag}
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {p.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Completeness Banner */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-white">
                Profile Completeness: <span className="text-primary-400">{completeness}%</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {completeness >= 80 
                  ? 'Excellent context! Apex will deliver hyper-accurate responses.'
                  : 'Add your target roles and resume text to unlock best-in-class coaching.'}
              </p>
            </div>
            <div className="w-24 bg-slate-800 h-2.5 rounded-full overflow-hidden shrink-0">
              <div
                className={`h-full transition-all duration-300 ${
                  completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-500' : 'bg-primary-500'
                }`}
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          {/* Core Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-primary-400" />
              Current Background
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Current Role / Title
                </label>
                <input
                  type="text"
                  value={formData.currentRole}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="Junior (0-2 yrs)">Junior (0-2 yrs)</option>
                  <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                  <option value="Senior (6-8 yrs)">Senior (6-8 yrs)</option>
                  <option value="Lead / Staff (9-12 yrs)">Lead / Staff (9-12 yrs)</option>
                  <option value="Principal / Exec (12+ yrs)">Principal / Exec (12+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g. FinTech, Enterprise SaaS, AI Tools"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Key Skills Tag Input */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Key Skills & Tech Stack
            </h3>

            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-lg bg-slate-900 border border-slate-700">
              {formData.keySkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-400 transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <form onSubmit={handleAddSkill} className="inline-flex">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="+ Add skill (Press Enter)"
                  className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none px-2 py-1"
                />
              </form>
            </div>
          </div>

          {/* Target Aspirations */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              Career Aspirations & Target Roles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Roles
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-700 min-h-[38px]">
                  {formData.targetRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/60 text-xs font-medium text-emerald-300 border border-emerald-700/50"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role)}
                        className="text-emerald-400 hover:text-red-400 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <form onSubmit={handleAddRole} className="inline-flex">
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="+ Target role"
                      className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none px-2 py-1"
                    />
                  </form>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Companies
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-700 min-h-[38px]">
                  {formData.targetCompanies.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-950/60 text-xs font-medium text-primary-300 border border-primary-700/50"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => handleRemoveCompany(c)}
                        className="text-primary-400 hover:text-red-400 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <form onSubmit={handleAddCompany} className="inline-flex">
                    <input
                      type="text"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      placeholder="+ Company"
                      className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none px-2 py-1"
                    />
                  </form>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Compensation / Range
              </label>
              <input
                type="text"
                value={formData.targetSalary}
                onChange={(e) => setFormData({ ...formData, targetSalary: e.target.value })}
                placeholder="e.g. $240k Base + Equity ($350k+ TC)"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* Goals & Feedback */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Strategic Goals & Past Feedback
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Short-Term Goals (3-6 Months)
              </label>
              <textarea
                rows={2}
                value={formData.shortTermGoals}
                onChange={(e) => setFormData({ ...formData, shortTermGoals: e.target.value })}
                placeholder="e.g. Lead an org-wide architecture RFC, master Staff-level behavioral answers, secure 2 top offers."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Past Performance Feedback / Known Growth Areas
              </label>
              <textarea
                rows={2}
                value={formData.pastFeedback}
                onChange={(e) => setFormData({ ...formData, pastFeedback: e.target.value })}
                placeholder="e.g. Needs to elevate executive presence in VP meetings, improve business metric attribution."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* Resume Raw Text */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-violet-400" />
              Resume Text (Markdown or Plaintext)
            </h3>
            <p className="text-[11px] text-slate-400">
              Paste your current resume content below. Apex extracts your career achievements to ground document generation and mock interviews.
            </p>
            <textarea
              rows={6}
              value={formData.resumeText}
              onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
              placeholder="Paste your resume content, experience bullets, and achievements here..."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-primary-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>

          <Button
            variant="gradient"
            size="md"
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            {isSavedRecently ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved & Synchronized!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Context</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
