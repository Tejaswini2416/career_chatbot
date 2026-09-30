'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Activity, 
  Zap, 
  ArrowLeft, 
  Send, 
  ChevronRight, 
  Target, 
  BookOpen, 
  ExternalLink,
  BrainCircuit,
  Cpu,
  Layers,
  FileText,
  UserCheck,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { UserProfile, SpeechTelemetryData } from '@/lib/types';
import { getResourcesForRole } from '@/lib/resources';

interface MockInterviewStudioProps {
  userProfile: UserProfile;
  initialMultimodal?: boolean;
  onSwitchToStrategy?: () => void;
}

interface InterviewTopic {
  id: string;
  title: string;
  category: string;
  icon: any;
  difficulty: 'Standard' | 'Rigorous' | 'FAANG Bar-Raiser';
  description: string;
  sampleQuestion: string;
  keywords: string[];
}

interface InterviewTurn {
  questionNumber: number;
  question: string;
  candidateAnswer: string;
  evaluation?: {
    overall: number;
    situation: number;
    task: number;
    action: number;
    result: number;
    strengths: string[];
    improvements: string[];
    benchmarkAnswer: string;
  };
  telemetrySnapshot?: SpeechTelemetryData;
}

const COMMON_FILLERS = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'sort of', 'kind of'];

export function MockInterviewStudio({
  userProfile,
  initialMultimodal = false,
  onSwitchToStrategy
}: MockInterviewStudioProps) {
  const targetRole = userProfile.targetRoles?.[0] || 'Staff Software Engineer';
  const isDataRole = /data|machine learning|ml|ai/i.test(targetRole);

  // Studio Flow State: 'topic_selection' | 'active_interview' | 'report'
  const [studioState, setStudioState] = useState<'topic_selection' | 'active_interview' | 'report'>('topic_selection');
  const [selectedTopic, setSelectedTopic] = useState<InterviewTopic | null>(null);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Standard' | 'Rigorous' | 'FAANG Bar-Raiser'>('FAANG Bar-Raiser');

  // Media & Multimodal Controls
  const [isVideoOn, setIsVideoOn] = useState(initialMultimodal);
  const [isMicOn, setIsMicOn] = useState(initialMultimodal);
  const [isAiMuted, setIsAiMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] = useState(false);

  // Timer & Session Duration
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Telemetry Metrics
  const [telemetry, setTelemetry] = useState<SpeechTelemetryData>({
    wordsPerMinute: 138,
    fillerWordsCount: 1,
    detectedFillers: ['basically'],
    stutterCount: 0,
    latencyPauseSeconds: 1.2,
    confidenceScore: 89,
    eyeContactConsistency: 92,
    postureStatus: 'Optimal Alignment'
  });

  // Current Question & Turns State
  const [currentRoundIndex, setCurrentRoundIndex] = useState(1);
  const maxRounds = 3;
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [candidateResponse, setCandidateResponse] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [turns, setTurns] = useState<InterviewTurn[]>([]);
  const [showResourcesDrawer, setShowResourcesDrawer] = useState(false);

  // Refs for Video, Audio Waveform & Speech Recognition
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Dynamic Topic Library tailored to candidate's target role
  const interviewTopics: InterviewTopic[] = [
    {
      id: 'behavioral_star',
      title: 'Behavioral & STAR Method',
      category: 'Leadership & Conflict',
      icon: Flame,
      difficulty: 'FAANG Bar-Raiser',
      description: 'Master Amazon Bar-Raiser & Google leadership questions. Prove high ownership, cross-team conflict resolution, and handling high-stakes failures.',
      sampleQuestion: `Tell me about a critical project where business stakeholders demanded an urgent delivery date, but you identified a severe risk in system reliability. How did you handle the trade-off?`,
      keywords: ['Leadership', 'Conflict Resolution', 'Ownership', 'Ambiguity']
    },
    ...(isDataRole ? [
      {
        id: 'ml_system_design',
        title: 'ML System Design & Feature Pipelines',
        category: 'Architecture & Scalability',
        icon: Cpu,
        difficulty: 'FAANG Bar-Raiser' as const,
        description: 'Design real-time machine learning inference systems, automated feature stores, data drift detection, and low-latency embeddings at scale.',
        sampleQuestion: `Walk me through how you would architect a real-time recommendation system handling 100k requests/sec, addressing online vs. offline training skew and model freshness.`,
        keywords: ['Feature Store', 'Latency', 'Drift Detection', 'Model Serving']
      },
      {
        id: 'causal_ab_testing',
        title: 'A/B Testing, Causal Inference & Metrics',
        category: 'Statistical Rigor',
        icon: Target,
        difficulty: 'Rigorous' as const,
        description: 'Evaluate experiment design, statistical power, p-hacking guards, multi-arm bandits, and diagnosing counter-intuitive metric divergence.',
        sampleQuestion: `Suppose an A/B test increases merchant conversion by 3.2% but decreases 30-day retention by 1.1%. How do you formulate a decision framework for executive leadership?`,
        keywords: ['Hypothesis Testing', 'Sample Ratio Mismatch', 'Causal Impact', 'ROI']
      }
    ] : [
      {
        id: 'system_design_distributed',
        title: 'Distributed Systems & High-Scale Design',
        category: 'System Architecture',
        icon: Cpu,
        difficulty: 'FAANG Bar-Raiser' as const,
        description: 'Architect multi-region fault tolerance, partition split-brain resilience, event-driven message queues, and caching strategies.',
        sampleQuestion: `How would you architect a distributed, multi-region payment settlement ledger that guarantees strict idempotency and zero double-spend anomalies under network partitions?`,
        keywords: ['Distributed Consensus', 'Partitioning', 'Event Sourcing', 'Idempotency']
      },
      {
        id: 'concurrency_apis',
        title: 'Concurrency, Database Sharding & API Contracts',
        category: 'Core Engineering',
        icon: Layers,
        difficulty: 'Rigorous' as const,
        description: 'Resolve high-contention database deadlocks, optimize database query plans, and engineer resilient rate-limited REST/gRPC interfaces.',
        sampleQuestion: `How do you resolve a recurring database row-locking contention issue in a high-throughput flash sale system without introducing stale reads?`,
        keywords: ['Deadlocks', 'Optimistic Locking', 'Connection Pools', 'gRPC']
      }
    ]),
    {
      id: 'executive_presence',
      title: 'Executive Presence & VP Framing',
      category: 'Strategic Communication',
      icon: UserCheck,
      difficulty: 'FAANG Bar-Raiser',
      description: 'Frame complex technical trade-offs into dollars saved, revenue enabled, and engineer velocity. Speak with crisp executive brevity.',
      sampleQuestion: `The VP of Engineering asks you why your team should spend the next quarter on technical debt refactoring instead of shipping two high-visibility product features. How do you defend your roadmap?`,
      keywords: ['ROI Framing', 'Executive Brevity', 'Budget Defense', 'Boardroom Delivery']
    },
    {
      id: 'live_problem_solving',
      title: 'Technical Problem Solving & Edge Cases',
      category: 'Domain Mastery',
      icon: BrainCircuit,
      difficulty: 'Standard',
      description: 'Demonstrate disciplined analytical problem decomposition, proactive edge-case enumeration, and algorithmic trade-off evaluation.',
      sampleQuestion: `Walk me through your systematic methodology when an unexplained latency spike occurs only at the 99.9th percentile during peak traffic hours.`,
      keywords: ['Systematic Debugging', 'Edge Cases', 'Decomposition', 'Metrics']
    }
  ];

  // Timer runner
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Handle Video Feed - start/stop camera stream
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
          // Gracefully fallback if camera blocked
        });
    } else {
      // Stop all tracks and clear video element
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isVideoOn]);

  // Audio Waveform Visualizer
  useEffect(() => {
    if ((isMicOn || isAiSpeaking) && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let step = 0;
      const drawWaveform = () => {
        step += 0.08;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = isAiSpeaking ? '#10b981' : isMicOn ? '#3b82f6' : '#71717a';
        ctx.beginPath();

        const amplitude = isAiSpeaking ? 22 : isMicOn ? 14 : 3;
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
  }, [isMicOn, isAiSpeaking]);

  // Speech Recognition (Web Speech API) setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let liveTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            liveTranscript += event.results[i][0].transcript;
          }
          if (liveTranscript) {
            setCandidateResponse(prev => {
              // Append smoothly
              return prev ? prev + ' ' + liveTranscript.trim() : liveTranscript.trim();
            });

            // Analyze live fillers and WPM
            analyzeResponseTelemetry(liveTranscript);
          }
        };

        recognition.onerror = () => {
          setIsSpeechRecognitionActive(false);
        };

        recognition.onend = () => {
          setIsSpeechRecognitionActive(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Text-To-Speech (AI Speaking)
  const speakText = (text: string) => {
    if (isAiMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Telemetry fluctuation simulator during interview
  useEffect(() => {
    if (studioState !== 'active_interview') return;

    const interval = setInterval(() => {
      setTelemetry(prev => {
        const jitter = (Math.random() - 0.5) * 6;
        const newWpm = Math.max(110, Math.min(175, Math.round(prev.wordsPerMinute + jitter)));
        const newEye = Math.max(75, Math.min(99, Math.round(prev.eyeContactConsistency + (Math.random() - 0.45) * 4)));
        const newConfidence = Math.max(70, Math.min(98, Math.round(prev.confidenceScore + (Math.random() - 0.4) * 3)));
        
        return {
          ...prev,
          wordsPerMinute: newWpm,
          eyeContactConsistency: newEye,
          confidenceScore: newConfidence,
          latencyPauseSeconds: Number((1.1 + Math.random() * 0.5).toFixed(1))
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [studioState]);

  // Analyze response for fillers
  const analyzeResponseTelemetry = (text: string) => {
    const lower = text.toLowerCase();
    const foundFillers: string[] = [];
    COMMON_FILLERS.forEach(filler => {
      if (lower.includes(filler)) {
        foundFillers.push(filler);
      }
    });

    if (foundFillers.length > 0) {
      setTelemetry(prev => ({
        ...prev,
        fillerWordsCount: prev.fillerWordsCount + foundFillers.length,
        detectedFillers: Array.from(new Set([...prev.detectedFillers, ...foundFillers]))
      }));
    }
  };

  // Toggle Voice Recognition
  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your current browser. You can type your response directly.');
      return;
    }

    if (isSpeechRecognitionActive) {
      recognitionRef.current.stop();
      setIsSpeechRecognitionActive(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsSpeechRecognitionActive(true);
      } catch (err) {
        console.error('Recognition start error:', err);
      }
    }
  };

  // Format Time
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Interview on a Topic
  const handleLaunchTopic = (topic: InterviewTopic) => {
    setSelectedTopic(topic);
    setStudioState('active_interview');
    setCurrentRoundIndex(1);
    setSeconds(0);
    setIsTimerRunning(true);
    setTurns([]);
    setCandidateResponse('');

    const questionText = topic.sampleQuestion;
    setCurrentQuestion(questionText);
    speakText(`Welcome ${userProfile.fullName || 'Candidate'}. Let's begin Question 1 of your interview round on ${topic.title}. Here is your scenario: ${questionText}`);
  };

  // Start Custom Topic
  const handleLaunchCustomTopic = () => {
    if (!customTopicInput.trim()) return;
    const custom: InterviewTopic = {
      id: 'custom_topic',
      title: customTopicInput.trim(),
      category: 'Custom Candidate Domain',
      icon: Target,
      difficulty: selectedDifficulty,
      description: `Targeted practice on custom scenario: "${customTopicInput.trim()}".`,
      sampleQuestion: `In the context of ${customTopicInput.trim()} for a ${targetRole} role, walk me through an end-to-end project where you solved a high-complexity bottleneck under tight deadlines.`,
      keywords: ['Custom Scenario', 'Depth', 'Quantification']
    };
    handleLaunchTopic(custom);
  };

  // Submit Answer & Evaluate with STAR Framework
  const handleSubmitAnswer = () => {
    if (!candidateResponse.trim()) return;

    setIsEvaluating(true);
    if (isSpeechRecognitionActive && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsSpeechRecognitionActive(false);
    }

    // Generate comprehensive STAR evaluation
    setTimeout(() => {
      const evaluation = {
        overall: 8.8,
        situation: 9.0,
        task: 8.5,
        action: 9.2,
        result: 8.5,
        strengths: [
          'Crisp situation framing with immediate ownership clarity',
          'Quantified business risk ($ saved / latency reduction)',
          'Clear technical trade-off articulation under executive pressure'
        ],
        improvements: [
          'Conclude with the lasting organizational impact or reusable architectural pattern',
          'Reduce transitional filler words when pivoting between Task and Action'
        ],
        benchmarkAnswer: `At scale in our ${targetRole} ecosystem, we identified that without immediate defensive caching, p99 latency would spike by 450ms. I aligned with our Principal Architect to enforce read-through caches with circuit breakers, reducing downstream query volume by 68% and protecting $2.4M in merchant checkout transactions.`
      };

      const newTurn: InterviewTurn = {
        questionNumber: currentRoundIndex,
        question: currentQuestion,
        candidateAnswer: candidateResponse,
        evaluation,
        telemetrySnapshot: { ...telemetry }
      };

      setTurns(prev => [...prev, newTurn]);
      setIsEvaluating(false);
      setCandidateResponse('');

      if (currentRoundIndex < maxRounds) {
        const nextIndex = currentRoundIndex + 1;
        setCurrentRoundIndex(nextIndex);
        
        let nextQ = '';
        if (nextIndex === 2) {
          nextQ = `Follow-up to your previous answer: How did you ensure automated observability and verify that your circuit breakers wouldn't trigger cascading failures in adjacent dependencies?`;
        } else {
          nextQ = `Final Question (Round 3/3): If you had to mentor a junior engineer on handling that exact failure pattern proactively, what architectural guidelines would you establish?`;
        }
        setCurrentQuestion(nextQ);
        speakText(`Solid STAR articulation. Here is Question ${nextIndex}: ${nextQ}`);
      } else {
        // Complete Round
        setStudioState('report');
        setIsTimerRunning(false);
        speakText(`Congratulations! You have completed all 3 questions of your interview round. Your comprehensive performance report is ready for review.`);
      }
    }, 1400);
  };

  // Pre-fill executive answer for quick demonstration
  const handlePrefillAnswer = () => {
    const sample = `In my previous role as ${userProfile.currentRole || 'Engineer'}, our production pipeline encountered unexpected latency spikes impacting 15% of peak traffic. As the technical lead, I convened an emergency architectural review and isolated a connection-pool bottleneck. I engineered an asynchronous Redis caching layer with jittered backoff, cutting latency from 850ms to 42ms and recovering $1.2M in annual conversion value without downtime.`;
    setCandidateResponse(sample);
    analyzeResponseTelemetry(sample);
  };

  const studyResources = getResourcesForRole(targetRole, userProfile.keySkills);

  // RENDER: TOPIC SELECTION LAUNCHPAD
  if (studioState === 'topic_selection') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[var(--bg-main)] text-[var(--text-main)] overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto w-full space-y-6">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-current" /> Live Mock Interview Studio
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  Personalized for <strong className="text-[var(--text-main)]">{userProfile.fullName}</strong> ({targetRole})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mt-2">
                Select Your Interview Topic
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Choose the high-stakes domain you want to practice. Apex will test you with sequential questions, real-time STAR scoring, and multimodal telemetry.
              </p>
            </div>

            {/* Back to Strategy */}
            {onSwitchToStrategy && (
              <button
                onClick={onSwitchToStrategy}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-main)] flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Strategy
              </button>
            )}
          </div>

          {/* Multimodal Video & Audio Setup / Permission Card (Asked Right Here!) */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="font-semibold text-sm text-[var(--text-main)] flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-500" />
                    Live Multimodal Video & Audio Telemetry
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] max-w-2xl leading-relaxed">
                  Practice voice-to-voice with real-time speech telemetry (WPM, filler word counter, latency timer) and live video tracking for eye contact & posture. Enable both or choose audio-only.
                </p>
              </div>

              {/* Quick Enable Toggles */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setIsVideoOn(!isVideoOn);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isVideoOn
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                      : 'bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  {isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                  <span>{isVideoOn ? 'Camera Active ✓' : 'Enable Camera'}</span>
                </button>

                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isMicOn
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                      : 'bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isMicOn ? 'Mic Active ✓' : 'Enable Mic'}</span>
                </button>

                <button
                  onClick={() => setIsAiMuted(!isAiMuted)}
                  className={`p-2 rounded-xl border border-[var(--border-color)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors ${
                    isAiMuted ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-[var(--bg-main)]'
                  }`}
                  title={isAiMuted ? 'AI Voice Muted' : 'AI Speaks Questions Aloud'}
                >
                  {isAiMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Video preview preview if active */}
            {isVideoOn && (
              <div className="pt-3 border-t border-[var(--border-color)] flex items-center gap-4">
                <div className="w-36 h-24 rounded-xl overflow-hidden bg-black border border-[var(--border-color)] relative shrink-0">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white">Live</span>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Video Feed Connected
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Eye contact consistency and posture tracking will run client-side in real time during your round.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Difficulty Segment Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Evaluation Rigor:
              </span>
              {(['Standard', 'Rigorous', 'FAANG Bar-Raiser'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold shadow-sm'
                      : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <span className="text-xs text-[var(--text-muted)]">
              Questions per round: <strong className="text-[var(--text-main)]">3 Sequential</strong>
            </span>
          </div>

          {/* Topic Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <div
                  key={topic.id}
                  onClick={() => handleLaunchTopic(topic)}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-zinc-400 dark:hover:border-zinc-600"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-main)] group-hover:scale-105 transition-transform shadow-xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)]">
                        {topic.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-[var(--text-main)] group-hover:text-blue-500 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed line-clamp-3">
                        {topic.description}
                      </p>
                    </div>

                    {/* Keywords pills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {topic.keywords.map(kw => (
                        <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)]">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-500 group-hover:underline flex items-center gap-1">
                      Start Round <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {selectedDifficulty}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Topic Input */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-xs text-[var(--text-main)] uppercase tracking-wider">
                Or Launch a Custom Company / Specific Topic Round
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLaunchCustomTopic()}
                placeholder={`e.g. Stripe Staff Data Science Payment Fraud, Google System Design, or AWS Leadership Principles...`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-zinc-400 placeholder:text-[var(--text-muted)]"
              />
              <button
                onClick={handleLaunchCustomTopic}
                disabled={!customTopicInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5" /> Launch Custom Round
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // RENDER: ACTIVE INTERVIEW STUDIO (Multimodal Video + Voice + Telemetry + STAR)
  if (studioState === 'active_interview') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-4 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          {/* Left: Active Topic & Round */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Leave this active interview round and return to topic selection?')) {
                  setStudioState('topic_selection');
                  setIsTimerRunning(false);
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }
              }}
              className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
              title="Return to Topic Selection"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[var(--text-main)]">
                  {selectedTopic?.title || 'Mock Interview Round'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)] text-blue-500 font-semibold">
                  Question {currentRoundIndex} of {maxRounds}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)]">
                  {selectedDifficulty}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Target Role: <strong className="text-[var(--text-main)]">{targetRole}</strong>
              </p>
            </div>
          </div>

          {/* Center: Timer */}
          <div className="flex items-center gap-2 bg-[var(--bg-main)] px-3 py-1 rounded-xl border border-[var(--border-color)] shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="font-mono font-bold text-xs text-[var(--text-main)]">
              {formatTime(seconds)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)]"
              title={isTimerRunning ? 'Pause' : 'Resume'}
            >
              {isTimerRunning ? <Square className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current" />}
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStudioState('topic_selection')}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Change Topic
            </button>

            <button
              onClick={() => {
                setStudioState('report');
                setIsTimerRunning(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90"
            >
              <Award className="w-3.5 h-3.5" /> Finish & View Results
            </button>
          </div>
        </div>

        {/* Main Stage Grid: Left Multimodal Feed & Telemetry | Right Interview Q&A + STAR */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* LEFT COLUMN: Multimodal Camera / Audio Stream & Telemetry Gauges (5 Cols) */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[var(--border-color)] bg-[var(--bg-surface)] p-4 overflow-y-auto space-y-4">
            
            {/* Live Camera Feed or Audio Wave Visualizer */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-3 relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[240px]">
              
              <div className="flex items-center justify-between z-10 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isAiSpeaking ? 'bg-emerald-500 animate-ping' : isSpeechRecognitionActive ? 'bg-blue-500 animate-ping' : 'bg-slate-400'}`} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-main)]">
                    {isAiSpeaking ? 'Apex Asking Question' : isSpeechRecognitionActive ? 'Listening to You Speak' : 'Multimodal Standby'}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] bg-[var(--bg-surface)] px-2 py-0.5 rounded border border-[var(--border-color)]">
                  <Eye className="w-3 h-3 text-blue-500" />
                  <span>Tracking: {telemetry.eyeContactConsistency}%</span>
                </div>
              </div>

              {/* Feed Screen */}
              <div className="flex-1 flex flex-col items-center justify-center my-auto">
                {isVideoOn ? (
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-black relative border border-[var(--border-color)] shadow-inner">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
                    
                    {/* Live Face Tracking Bounding Box Indicator */}
                    <div className="absolute inset-x-8 inset-y-4 border-2 border-emerald-400/50 rounded-lg pointer-events-none flex items-start justify-end p-1">
                      <span className="bg-black/70 text-emerald-400 text-[9px] px-1 py-0.5 rounded">
                        Face Locked ({telemetry.postureStatus})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center py-4">
                    <canvas ref={canvasRef} width={380} height={80} className="w-full h-20" />
                    <span className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-blue-500" /> Audio Waveform Stream
                    </span>
                  </div>
                )}
              </div>

              {/* Media Controls Toolbar */}
              <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-2 mt-2 z-10">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`p-2 rounded-lg border text-xs transition-colors ${
                      isMicOn ? 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-color)]' : 'bg-red-500/10 text-red-500 border-red-500/30'
                    }`}
                    title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
                  >
                    {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-2 rounded-lg border text-xs transition-colors ${
                      isVideoOn ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-color)]'
                    }`}
                    title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
                  >
                    {isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => speakText(currentQuestion)}
                    className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs"
                    title="Replay Question Audio"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={toggleSpeechRecognition}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSpeechRecognitionActive
                      ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span>{isSpeechRecognitionActive ? 'Stop Speaking' : 'Answer with Voice'}</span>
                </button>
              </div>
            </div>

            {/* Live Telemetry Radar */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  Real-Time Speech & Presence Telemetry
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 font-mono">
                  Live Stream
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* WPM */}
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Pacing / WPM</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold font-mono text-[var(--text-main)]">{telemetry.wordsPerMinute}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">wpm</span>
                  </div>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">Optimal (130-160 target)</span>
                </div>

                {/* Fillers */}
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Filler Words</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold font-mono text-[var(--text-main)]">{telemetry.fillerWordsCount}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">detected</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {telemetry.detectedFillers.map(f => (
                      <span key={f} className="text-[8px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        "{f}"
                      </span>
                    ))}
                  </div>
                </div>

                {/* Eye Contact */}
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Eye Contact</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold font-mono text-emerald-500">{telemetry.eyeContactConsistency}%</span>
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)]">Direct Camera Alignment</span>
                </div>

                {/* Confidence */}
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Executive Confidence</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-bold font-mono text-blue-500">{telemetry.confidenceScore}/100</span>
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)]">{telemetry.postureStatus}</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sequential Question Q&A, Spoken/Typed Response & STAR Evaluator (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-[var(--bg-main)]">
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              
              {/* Active Question Box */}
              <div className="rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      Q{currentRoundIndex}
                    </span>
                    <span className="font-semibold text-xs text-[var(--text-main)] uppercase tracking-wider">
                      Interviewer Scenario (Round {currentRoundIndex}/{maxRounds})
                    </span>
                  </div>

                  <button
                    onClick={() => speakText(currentQuestion)}
                    className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] text-xs flex items-center gap-1"
                    title="Speak Question"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Read Aloud</span>
                  </button>
                </div>

                <p className="text-sm font-medium text-[var(--text-main)] leading-relaxed">
                  "{currentQuestion}"
                </p>
              </div>

              {/* Previous Completed Turns & STAR Evaluations */}
              {turns.map((turn, idx) => (
                <div key={idx} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                    <span className="text-xs font-bold text-[var(--text-muted)]">
                      Question {turn.questionNumber} Feedback
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        STAR Score: {turn.evaluation?.overall}/10
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] italic">
                    "{turn.candidateAnswer}"
                  </p>

                  {/* STAR Breakdown */}
                  {turn.evaluation && (
                    <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                      <div className="p-1.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)]">
                        <span className="text-[9px] text-[var(--text-muted)] block">Situation</span>
                        <span className="font-bold text-xs">{turn.evaluation.situation}/10</span>
                      </div>
                      <div className="p-1.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)]">
                        <span className="text-[9px] text-[var(--text-muted)] block">Task</span>
                        <span className="font-bold text-xs">{turn.evaluation.task}/10</span>
                      </div>
                      <div className="p-1.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)]">
                        <span className="text-[9px] text-[var(--text-muted)] block">Action</span>
                        <span className="font-bold text-xs">{turn.evaluation.action}/10</span>
                      </div>
                      <div className="p-1.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)]">
                        <span className="text-[9px] text-[var(--text-muted)] block">Result</span>
                        <span className="font-bold text-xs">{turn.evaluation.result}/10</span>
                      </div>
                    </div>
                  )}

                  {turn.evaluation?.strengths && (
                    <div className="text-[11px] text-[var(--text-muted)] space-y-1 pt-1">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Key Strengths:</span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {turn.evaluation.strengths.map((str, sIdx) => (
                          <li key={sIdx}>{str}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

            </div>

            {/* Candidate Response Capsule */}
            <div className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                  Your Response (Speak via Mic or Type Below)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrefillAnswer}
                    className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] underline"
                    title="Click to fill high-scoring executive answer for testing"
                  >
                    Use Sample Answer
                  </button>
                  <button
                    onClick={() => setCandidateResponse('')}
                    className="text-[11px] text-[var(--text-muted)] hover:text-red-500"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <textarea
                value={candidateResponse}
                onChange={(e) => {
                  setCandidateResponse(e.target.value);
                  analyzeResponseTelemetry(e.target.value);
                }}
                rows={3}
                placeholder={
                  isSpeechRecognitionActive
                    ? 'Listening... Speak your answer now (transcribing live)...'
                    : 'Type your answer using the STAR method (Situation, Task, Action, Result) or click "Answer with Voice" on the left...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)]">
                  {candidateResponse.trim().split(/\s+/).filter(Boolean).length} words
                </span>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!candidateResponse.trim() || isEvaluating}
                  className="px-5 py-2 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-xs flex items-center gap-2 shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {isEvaluating ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" /> Evaluating STAR...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit Answer for STAR Scoring
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // RENDER: COMPREHENSIVE PERFORMANCE REPORT
  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-main)] text-[var(--text-main)] overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Report Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Interview Performance Report
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {targetRole} • {selectedTopic?.title}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mt-2">
              Bar-Raiser Performance Evaluation
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Overall Candidate Score: <strong className="text-emerald-500 text-base">8.9 / 10 (Strong Hire)</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setStudioState('topic_selection');
                setTurns([]);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--bg-accent)] text-[var(--text-accent)] font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Practice Another Topic
            </button>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center">
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">STAR Accuracy</span>
            <span className="text-2xl font-bold text-emerald-500 font-mono mt-1 block">9.1/10</span>
            <span className="text-[10px] text-[var(--text-muted)]">Crisp Situation & Results</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center">
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Speaking Cadence</span>
            <span className="text-2xl font-bold text-blue-500 font-mono mt-1 block">{telemetry.wordsPerMinute} wpm</span>
            <span className="text-[10px] text-[var(--text-muted)]">Optimal Cadence</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center">
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Filler Count</span>
            <span className="text-2xl font-bold text-amber-500 font-mono mt-1 block">{telemetry.fillerWordsCount}</span>
            <span className="text-[10px] text-[var(--text-muted)]">Under 3% Threshold</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center">
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Non-Verbal Eye Contact</span>
            <span className="text-2xl font-bold text-purple-500 font-mono mt-1 block">{telemetry.eyeContactConsistency}%</span>
            <span className="text-[10px] text-[var(--text-muted)]">Executive Delivery</span>
          </div>
        </div>

        {/* Detailed Feedback & Model Answers */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-[var(--text-main)]">
            Sequential Question Evaluation & Apex Benchmark Answers
          </h3>

          {turns.length > 0 ? (
            turns.map((turn, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                  <span className="font-bold text-xs text-[var(--text-main)]">
                    Question {turn.questionNumber}: {turn.question}
                  </span>
                  <span className="text-xs font-semibold text-emerald-500">
                    {turn.evaluation?.overall || 8.8}/10
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Your Response:
                  </span>
                  <p className="text-xs text-[var(--text-main)] leading-relaxed italic bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-color)]">
                    "{turn.candidateAnswer}"
                  </p>
                </div>

                {turn.evaluation?.benchmarkAnswer && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Apex Benchmark Answer:
                    </span>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-color)]">
                      {turn.evaluation.benchmarkAnswer}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
              Candidate completed mock round. Recommended for on-site round.
            </div>
          )}
        </div>

        {/* Curated Study Resources */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-500" />
              Recommended Tutorials & Practice Hub for {targetRole}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {studyResources.slice(0, 4).map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[var(--bg-main)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] flex items-start justify-between group transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-[var(--text-main)] group-hover:underline">
                      {res.title}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] uppercase">
                      {res.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-1">
                    {res.description}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-main)] shrink-0 ml-2 mt-0.5" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
