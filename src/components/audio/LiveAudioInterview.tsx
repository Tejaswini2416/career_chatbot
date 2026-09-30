'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Play, 
  Square, 
  Volume2, 
  Activity, 
  Eye, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  Zap,
  Clock,
  Gauge
} from 'lucide-react';
import { SpeechTelemetryData, UserProfile } from '@/lib/types';

interface LiveAudioInterviewProps {
  userProfile: UserProfile;
  onSendFeedbackPrompt?: (feedbackSummary: string) => void;
}

const COMMON_FILLERS = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'sort of', 'kind of'];

export function LiveAudioInterview({ userProfile }: LiveAudioInterviewProps) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  
  // Real-time Speech Telemetry
  const [telemetry, setTelemetry] = useState<SpeechTelemetryData>({
    wordsPerMinute: 138,
    fillerWordsCount: 2,
    detectedFillers: ['um', 'basically'],
    stutterCount: 1,
    latencyPauseSeconds: 1.4,
    confidenceScore: 86,
    eyeContactConsistency: 91,
    postureStatus: 'Optimal Alignment'
  });

  const [currentPrompt, setCurrentPrompt] = useState<string>(
    `"Alex, walk me through an architectural trade-off where you had to push back on immediate product delivery deadlines in favor of core distributed resilience."`
  );

  const [transcript, setTranscript] = useState<string>('');
  const [interviewerPhase, setInterviewerPhase] = useState<'Awaiting Answer' | 'Listening & Analyzing' | 'Apex Evaluating'>('Awaiting Answer');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize simulated audio visualizer & video feed
  useEffect(() => {
    if (isSessionActive && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let step = 0;
      const drawWaveform = () => {
        step += 0.08;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = isAiSpeaking ? '#10b981' : isMicOn ? '#3b82f6' : '#64748b';
        ctx.beginPath();

        const amplitude = isAiSpeaking ? 20 : isMicOn ? 14 : 2;
        for (let x = 0; x < canvas.width; x++) {
          const y = (canvas.height / 2) + Math.sin(x * 0.05 + step) * amplitude * Math.sin(x / canvas.width * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        animationFrameRef.current = requestAnimationFrame(drawWaveform);
      };

      drawWaveform();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSessionActive, isAiSpeaking, isMicOn]);

  // Video feed toggle handling
  useEffect(() => {
    if (isVideoOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera unavailable or denied: gracefully show simulated frame
        });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
    }
  }, [isVideoOn]);

  // Telemetry fluctuation simulator when active
  useEffect(() => {
    if (!isSessionActive) return;

    const interval = setInterval(() => {
      setTelemetry(prev => {
        const jitter = (Math.random() - 0.5) * 6;
        const newWpm = Math.max(90, Math.min(180, Math.round(prev.wordsPerMinute + jitter)));
        const newEye = Math.max(70, Math.min(99, Math.round(prev.eyeContactConsistency + (Math.random() - 0.45) * 4)));
        const newConfidence = Math.max(65, Math.min(98, Math.round(prev.confidenceScore + (Math.random() - 0.4) * 3)));
        
        return {
          ...prev,
          wordsPerMinute: newWpm,
          eyeContactConsistency: newEye,
          confidenceScore: newConfidence,
          latencyPauseSeconds: Number((1.2 + Math.random() * 0.4).toFixed(1))
        };
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isSessionActive]);

  const handleStartSession = () => {
    setIsSessionActive(true);
    setInterviewerPhase('Listening & Analyzing');
    playAIText("Hello Alex. Let's begin your real-time voice interview. " + currentPrompt);
  };

  const handleStopSession = () => {
    setIsSessionActive(false);
    setIsAiSpeaking(false);
    setInterviewerPhase('Awaiting Answer');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playAIText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSimulateAnswer = () => {
    const sampleAnswer = "In our payment ingestion pipeline, we faced a hard deadline for Q3 merchant onboarding. However, our Kafka partition replication was unvalidated across secondary availability zones. I convened an emergency technical review with the Director of Product and proved that a failure would risk $2.4M in stalled settlements. We compromised by launching a controlled 5% canary first while stabilizing zero-loss consumer offsets.";
    setTranscript(sampleAnswer);
    setTelemetry(prev => ({
      ...prev,
      fillerWordsCount: prev.fillerWordsCount + 1,
      detectedFillers: Array.from(new Set([...prev.detectedFillers, 'like'])),
      confidenceScore: 92
    }));
    setInterviewerPhase('Apex Evaluating');
    setTimeout(() => {
      playAIText("Excellent executive articulation Alex. Your STAR situation framing was crisp, and quantifying the $2.4M risk was key. Let's dig deeper: how did you monitor the consumer offsets during the 5% canary rollout?");
      setCurrentPrompt("How did you ensure end-to-end idempotent processing during that canary rollout without risking double-credit to merchant accounts?");
      setInterviewerPhase('Listening & Analyzing');
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-main)] overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto w-full mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Pillar 1 • WebRTC Live Audio
              </span>
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> Zero-Lag Telemetry
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] mt-1">
              Multimodal & Live Audio Interviewing
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Real-time voice-to-voice simulation with instantaneous speech telemetry, filler detection, and non-verbal presence metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isSessionActive ? (
              <button
                onClick={handleStartSession}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-sm active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" /> Start Live Interview
              </button>
            ) : (
              <button
                onClick={handleStopSession}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-all shadow-sm active:scale-95"
              >
                <Square className="w-4 h-4 fill-white" /> End Session
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        
        {/* Left Stage: Live Audio/Video Feed & Prompt (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Main Visualizer & Camera Box */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-sm">
            {/* Top Status Indicators */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isSessionActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]">
                  {isSessionActive ? (isAiSpeaking ? 'Apex Speaking' : 'Listening to You') : 'Session Standby'}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-[var(--bg-main)]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Target: {userProfile.targetRoles[0] || 'Staff Software Engineer'}</span>
              </div>
            </div>

            {/* Video / Webcam Stage or Audio Wave Canvas */}
            <div className="my-auto relative flex flex-col items-center justify-center py-6">
              {isVideoOn ? (
                <div className="w-full max-w-md h-56 rounded-xl overflow-hidden border border-[var(--border-color)] bg-black relative shadow-inner">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-white flex items-center gap-1">
                    <Eye className="w-3 h-3 text-emerald-400" /> Face Tracking Active
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center">
                  <canvas ref={canvasRef} width={460} height={100} className="w-full max-w-md h-24" />
                  <div className="text-xs text-[var(--text-muted)] mt-2 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-blue-500" /> Web Audio Waveform Stream
                  </div>
                </div>
              )}
            </div>

            {/* In-Call Controls */}
            <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-3 z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  disabled={!isSessionActive}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isMicOn 
                      ? 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]' 
                      : 'bg-red-500/10 border-red-500/30 text-red-500'
                  }`}
                  title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  disabled={!isSessionActive}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isVideoOn 
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' 
                      : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                  title={isVideoOn ? 'Disable Camera' : 'Enable Camera'}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
              </div>

              {isSessionActive && (
                <button
                  onClick={handleSimulateAnswer}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Simulate Answer & Feedback
                </button>
              )}
            </div>
          </div>

          {/* Current Question & Transcript Card */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
              <span>ACTIVE QUESTION PROMPT</span>
              <span className="text-blue-500">{interviewerPhase}</span>
            </div>
            <p className="text-base font-medium text-[var(--text-main)] italic">
              {currentPrompt}
            </p>

            {transcript && (
              <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
                <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                  Candidate Verbal Response (Live Speech-to-Text):
                </span>
                <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-color)] leading-relaxed">
                  "{transcript}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Stage: Speech Telemetry & Non-Verbal Telemetry (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Telemetry Dashboard */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-500" />
                <h3 className="font-semibold text-sm text-[var(--text-main)]">Speech & Voice Telemetry</h3>
              </div>
              <span className="text-[11px] text-emerald-500 font-mono">100Hz Sensor</span>
            </div>

            {/* WPM & Cadence */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" /> Cadence (Words Per Minute)
                </span>
                <span className="font-mono font-bold text-[var(--text-main)]">{telemetry.wordsPerMinute} WPM</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--bg-main)] overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    telemetry.wordsPerMinute > 160 ? 'bg-amber-500' : telemetry.wordsPerMinute < 110 ? 'bg-amber-400' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (telemetry.wordsPerMinute / 190) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {telemetry.wordsPerMinute >= 120 && telemetry.wordsPerMinute <= 150 
                  ? '✨ Ideal executive pacing (120-150 WPM).' 
                  : telemetry.wordsPerMinute > 150 ? '⚠️ High speed: slow down to project calm authority.' : '⚠️ Deliberate/slow cadence.'}
              </p>
            </div>

            {/* Filler Words */}
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--text-main)]">Filler Word Detector</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  telemetry.fillerWordsCount <= 2 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {telemetry.fillerWordsCount} Detected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {telemetry.detectedFillers.map((filler, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-mono border border-amber-500/20">
                    "{filler}"
                  </span>
                ))}
                {telemetry.detectedFillers.length === 0 && (
                  <span className="text-[11px] text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Zero fillers detected in current turn
                  </span>
                )}
              </div>
            </div>

            {/* Pause & Latency */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <span className="text-[var(--text-muted)] block text-[11px]">Answer Latency</span>
                <span className="text-base font-bold text-[var(--text-main)] font-mono mt-0.5 block">
                  {telemetry.latencyPauseSeconds}s
                </span>
                <span className="text-[10px] text-emerald-500">Natural composure</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <span className="text-[var(--text-muted)] block text-[11px]">Stutter Frequency</span>
                <span className="text-base font-bold text-[var(--text-main)] font-mono mt-0.5 block">
                  {telemetry.stutterCount}
                </span>
                <span className="text-[10px] text-emerald-500">Smooth articulation</span>
              </div>
            </div>
          </div>

          {/* Non-Verbal Vision & Presence Radar */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-sm text-[var(--text-main)]">Non-Verbal Presence Analysis</h3>
              </div>
              <span className="text-[11px] text-blue-500 font-medium">Computer Vision</span>
            </div>

            {/* Eye Contact */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Eye Contact Consistency</span>
                <span className="font-bold font-mono text-[var(--text-main)]">{telemetry.eyeContactConsistency}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--bg-main)] overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${telemetry.eyeContactConsistency}%` }}
                />
              </div>
            </div>

            {/* Head Posture */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs">
              <span className="text-[var(--text-muted)]">Head Posture</span>
              <span className="font-semibold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {telemetry.postureStatus}
              </span>
            </div>

            {/* Perceived Executive Confidence */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Overall Executive Confidence Score</span>
                <span className="font-bold font-mono text-emerald-500">{telemetry.confidenceScore}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--bg-main)] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${telemetry.confidenceScore}%` }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
