import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  Volume2, 
  VolumeX, 
  Download,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Code
} from 'lucide-react';
import { ChatMessage as ChatMessageType, GeneratedDocument, UserProfile } from '@/lib/types';
import { ScoreCard } from '../interview/ScoreCard';
import { exportResumeToPdf } from '@/lib/pdf-export';

interface ChatMessageProps {
  message: ChatMessageType;
  onOpenDocument?: (doc: GeneratedDocument) => void;
  isLatest?: boolean;
  userProfile?: UserProfile;
}

export function ChatMessage({ message, onOpenDocument, isLatest, userProfile }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const plainText = message.content.replace(/[#*`_~[\]()]/g, '');
      const utterance = new SpeechSynthesisUtterance(plainText.slice(0, 350));
      utterance.rate = 1.05;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleDownloadPdf = async (doc: GeneratedDocument) => {
    try {
      setIsDownloadingPdf(true);
      await exportResumeToPdf(doc.title, doc.content, userProfile);
    } catch (err) {
      console.error('Failed to download PDF', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // USER MESSAGE BUBBLE
  if (!isAssistant) {
    return (
      <div className="w-full max-w-3xl mx-auto flex justify-end px-2 sm:px-4 py-2">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl bg-[var(--bg-bubble-user)] text-[var(--text-bubble-user)] px-5 py-3 text-sm leading-relaxed border border-[var(--border-color)] shadow-sm">
          <p className="whitespace-pre-wrap font-medium">{message.content}</p>
          <div className="text-[10px] opacity-75 mt-1 text-right">
            {message.createdAt}
          </div>
        </div>
      </div>
    );
  }

  // ASSISTANT MESSAGE
  return (
    <div className="w-full max-w-3xl mx-auto flex gap-3.5 sm:gap-4 px-2 sm:px-4 py-4 group">
      {/* Assistant Avatar */}
      <div className="shrink-0 mt-0.5">
        <div className="w-7 h-7 rounded-full bg-[var(--assistant-avatar-bg)] text-[var(--assistant-avatar-text)] flex items-center justify-center font-bold shadow-sm ring-1 ring-[var(--border-color)]">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Assistant Header */}
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text-main)]">Apex Career AI</span>
            {message.mode && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] capitalize">
                {message.mode}
              </span>
            )}
            <span className="text-[10px] text-[var(--text-muted)]">{message.createdAt}</span>
          </div>
        </div>

        {/* Markdown Render Area */}
        <div className="prose-chatgpt text-[var(--text-main)] text-sm leading-relaxed space-y-2.5">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-3 rounded-lg border border-[var(--border-color)]">
                  <table className="min-w-full divide-y divide-[var(--border-color)] bg-[var(--bg-surface)] text-xs">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-3 py-2 text-left font-semibold text-[var(--text-main)] bg-[var(--bg-surface-hover)]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3 py-2 text-[var(--text-main)] border-t border-[var(--border-color)]">
                  {children}
                </td>
              ),
              code: ({ inline, className, children, ...props }: any) => {
                if (inline) {
                  return (
                    <code className="bg-[var(--bg-surface)] text-[var(--text-main)] px-1.5 py-0.5 rounded text-xs border border-[var(--border-color)] font-mono font-semibold">
                      {children}
                    </code>
                  );
                }
                return (
                  <div className="my-3 rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-surface)]">
                    <div className="bg-[var(--bg-surface-hover)] px-3.5 py-1.5 flex items-center justify-between text-[11px] text-[var(--text-muted)] border-b border-[var(--border-color)]">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Code className="w-3 h-3 text-[var(--text-muted)]" />
                        Code / Format
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(String(children));
                        }}
                        className="hover:text-[var(--text-main)] transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="p-3 text-xs overflow-x-auto font-mono text-[var(--text-main)]">
                      <code>{children}</code>
                    </pre>
                  </div>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* STAR Interview Scorecard Widget */}
        {message.starFeedback && (
          <div className="mt-4 pt-1">
            <ScoreCard feedback={message.starFeedback} />
          </div>
        )}

        {/* Extracted Document Card with Download as PDF & Open Studio buttons */}
        {message.extractedDoc && (
          <div className="mt-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[var(--text-main)]">{message.extractedDoc.title}</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--bg-surface-hover)] text-[var(--text-main)] border border-[var(--border-color)]">
                    ATS Ready
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Generated career artifact ready for instant PDF export or live editing.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Primary PDF Download Button */}
              <button
                onClick={() => handleDownloadPdf(message.extractedDoc!)}
                disabled={isDownloadingPdf}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloadingPdf ? 'Generating...' : 'Download PDF'}</span>
              </button>

              {/* Open in Studio Button */}
              {onOpenDocument && (
                <button
                  onClick={() => onOpenDocument(message.extractedDoc!)}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-surface-hover)] text-[var(--text-main)] hover:border-[var(--border-color)] border border-transparent text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Edit in Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="pt-2 flex items-center gap-2 text-[var(--text-muted)] opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            title="Copy message"
            className="p-1.5 rounded-lg hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleSpeech}
            title={isSpeaking ? 'Stop reading' : 'Read aloud'}
            className="p-1.5 rounded-lg hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-emerald-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
            title="Good response"
            className={`p-1.5 rounded-lg hover:bg-[var(--bg-surface-hover)] transition-colors ${feedback === 'up' ? 'text-[var(--text-main)] font-bold' : 'hover:text-[var(--text-main)]'}`}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>

          <button
            onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
            title="Bad response"
            className={`p-1.5 rounded-lg hover:bg-[var(--bg-surface-hover)] transition-colors ${feedback === 'down' ? 'text-rose-500 font-bold' : 'hover:text-[var(--text-main)]'}`}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
