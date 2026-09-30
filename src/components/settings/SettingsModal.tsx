import React, { useState } from 'react';
import { 
  Key, 
  Settings, 
  Trash2, 
  Download, 
  Check, 
  Moon,
  Sun,
  Palette,
  Monitor,
  Tablet,
  Smartphone,
  ShieldCheck,
  Brain,
  Search,
  Sparkles,
  Users
} from 'lucide-react';
import { AppSettings, UserProfile, ChatMessage, ThemeMode, PlatformView, InterviewerArchetype } from '@/lib/types';
import { Modal } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { downloadAsFile } from '@/lib/utils';
import { getEpisodicMemories, searchEpisodicMemory } from '@/lib/episodic-memory';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onClearChat: () => void;
  userProfile: UserProfile;
  messages: ChatMessage[];
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onClearChat,
  userProfile,
  messages,
}: SettingsModalProps) {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'memory'>('general');
  const [memoryQuery, setMemoryQuery] = useState('');
  const [memories, setMemories] = useState(getEpisodicMemories());

  React.useEffect(() => {
    setFormData(settings);
    setMemories(getEpisodicMemories());
  }, [settings, isOpen]);

  const handleSearchMemory = (q: string) => {
    setMemoryQuery(q);
    setMemories(searchEpisodicMemory(q));
  };

  const handleSave = () => {
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 400);
  };

  const handleExportData = () => {
    const exportBundle = {
      profile: userProfile,
      chatHistory: messages,
      memories: getEpisodicMemories(),
      exportedAt: new Date().toISOString(),
    };
    downloadAsFile('apex_career_coach_export.json', JSON.stringify(exportBundle, null, 2), 'application/json');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application & Intelligence Settings"
      description="Configure your visual theme, interviewer archetype, PII privacy vault, and episodic memory."
      maxWidth="lg"
    >
      {/* Sub Tabs */}
      <div className="flex border-b border-[var(--border-color)] mb-4">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'general' ? 'border-[var(--bg-accent)] text-[var(--text-main)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          General & AI Settings
        </button>
        <button
          onClick={() => setActiveTab('memory')}
          className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'memory' ? 'border-[var(--bg-accent)] text-[var(--text-main)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-purple-500" />
          <span>Vectorized Episodic Memory</span>
        </button>
      </div>

      {activeTab === 'general' ? (
        <div className="space-y-4 text-xs max-h-[65vh] overflow-y-auto pr-1">
          
          {/* Role-Specific Agent Swarms */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-[var(--text-main)] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              Role-Specific Interviewer Archetype (Pillar 7)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { 
                  id: 'staff_architect', 
                  name: 'Staff Architect', 
                  desc: 'Skeptical, tests edge cases & distributed partition modes' 
                },
                { 
                  id: 'seed_founder', 
                  name: 'Seed Founder', 
                  desc: 'Fast-talking, rewards 0-to-1 speed and pragmatic hustle' 
                },
                { 
                  id: 'product_vp', 
                  name: 'Product VP', 
                  desc: 'Metric-driven, evaluates ARR, user churn & alignment' 
                },
              ].map((arch) => {
                const isSelected = formData.interviewerArchetype === arch.id;
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, interviewerArchetype: arch.id as InterviewerArchetype })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[var(--bg-surface-hover)] border-[var(--bg-accent)] text-[var(--text-main)] font-semibold shadow-xs'
                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <p className="font-bold text-xs text-[var(--text-main)]">{arch.name}</p>
                    <p className="text-[10px] opacity-75 mt-0.5 leading-tight">{arch.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Client-Side PII Redaction Vault Toggle */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-xs text-[var(--text-main)]">
                  Client-Side PII Redaction Vault
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.piiRedactionEnabled ?? true}
                onChange={(e) => setFormData({ ...formData, piiRedactionEnabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              When enabled, candidate personal data (email, phone number, address, and name) is automatically sanitized and masked locally in your browser before sending queries to LLMs.
            </p>
          </div>

          {/* Visual Theme Selection */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-[var(--text-main)]">
              Visual Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bw-dark', name: 'B&W Dark', desc: 'Monochrome pure black', icon: Moon },
                { id: 'bw-light', name: 'B&W Light', desc: 'Monochrome crisp white', icon: Sun },
                { id: 'chatgpt', name: 'ChatGPT Dark', desc: 'Classic emerald dark', icon: Palette },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = formData.themeMode === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, themeMode: t.id as ThemeMode })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[var(--bg-surface-hover)] border-[var(--bg-accent)] text-[var(--text-main)] font-semibold shadow-xs'
                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{t.name}</span>
                    </div>
                    <p className="text-[10px] opacity-75">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multi-Platform Viewport Selection */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-[var(--text-main)]">
              Multi-Platform Viewport Simulator
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'desktop', name: 'Desktop', desc: 'Full screen responsive', icon: Monitor },
                { id: 'tablet', name: 'Tablet', desc: 'iPad 768px frame', icon: Tablet },
                { id: 'mobile', name: 'Mobile', desc: 'iPhone 390px frame', icon: Smartphone },
              ].map((v) => {
                const Icon = v.icon;
                const isSelected = formData.platformView === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, platformView: v.id as PlatformView })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[var(--bg-surface-hover)] border-[var(--bg-accent)] text-[var(--text-main)] font-semibold shadow-xs'
                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{v.name}</span>
                    </div>
                    <p className="text-[10px] opacity-75">{v.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Provider Selector */}
          <div className="space-y-1.5 pt-2 border-t border-[var(--border-color)]">
            <label className="block font-semibold text-[var(--text-main)]">
              AI Provider & Intelligence Engine
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'openai', name: 'OpenAI (GPT-4o)', desc: 'Live OpenAI streaming with custom key' },
                { id: 'mock', name: 'Apex Simulator Engine', desc: 'Contextual AI without API key' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, apiProvider: p.id as any })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    formData.apiProvider === p.id
                      ? 'bg-[var(--bg-surface-hover)] border-[var(--bg-accent)] text-[var(--text-main)] font-semibold'
                      : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <p className="font-bold text-xs">{p.name}</p>
                  <p className="text-[10px] opacity-75 mt-0.5">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* API Key Input */}
          {formData.apiProvider === 'openai' && (
            <div className="space-y-1.5 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <label className="block font-semibold text-[var(--text-main)] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  OpenAI API Key (Optional)
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">Stored locally</span>
              </label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="sk-proj-..."
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono focus:outline-none"
              />
            </div>
          )}

          {/* Export & Data Management */}
          <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
            <label className="block font-semibold text-[var(--text-main)]">
              Data & Chat Export
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExportData}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-main)] flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Profile & Chat (.json)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to clear current chat messages?')) {
                    onClearChat();
                    onClose();
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 text-xs text-red-400 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Current Chat</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Vectorized Episodic Memory Explorer */
        <div className="space-y-3 text-xs max-h-[65vh] overflow-y-auto pr-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search indexed vector memories..."
              value={memoryQuery}
              onChange={(e) => handleSearchMemory(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none"
            />
          </div>

          <div className="space-y-2.5">
            {memories.map((mem) => (
              <div key={mem.id} className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-main)]">{mem.topic}</span>
                  <span className="font-mono text-[10px] text-purple-500 font-semibold bg-purple-500/10 px-1.5 py-0.5 rounded">
                    Score: {mem.similarityScore}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  {mem.summary}
                </p>
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1">
                  <span>{mem.timestamp}</span>
                  <div className="flex gap-1">
                    {mem.tags.map((t, idx) => (
                      <span key={idx} className="bg-[var(--bg-main)] px-1.5 py-0.2 rounded border border-[var(--border-color)]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] mt-3">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-xs flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
        >
          {savedSuccess ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
          <span>{savedSuccess ? 'Settings Applied!' : 'Save & Apply'}</span>
        </button>
      </div>
    </Modal>
  );
}
