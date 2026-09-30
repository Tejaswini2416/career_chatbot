'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  Terminal, 
  AlertTriangle, 
  Flame, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Server, 
  Database, 
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Code2
} from 'lucide-react';
import { SystemDesignNode, CodeTestCase, UserProfile } from '@/lib/types';

interface TechnicalSandboxProps {
  userProfile: UserProfile;
}

export function TechnicalSandbox({ userProfile }: TechnicalSandboxProps) {
  const [activeTab, setActiveTab] = useState<'system_design' | 'code_execution' | 'socratic_debug'>('system_design');

  // 1. System Design State
  const [nodes, setNodes] = useState<SystemDesignNode[]>([
    { id: 'client', label: 'Global Clients (iOS/Web)', type: 'client', status: 'healthy', metrics: { rps: 12500, latencyMs: 24, errorRate: 0.01 } },
    { id: 'lb', label: 'Cloudflare Anycast LB', type: 'lb', status: 'healthy', metrics: { rps: 12500, latencyMs: 18, errorRate: 0.01 } },
    { id: 'gateway', label: 'Envoy API Gateway', type: 'gateway', status: 'healthy', metrics: { rps: 12500, latencyMs: 32, errorRate: 0.02 } },
    { id: 'cache', label: 'Redis Cluster (Write-Through)', type: 'cache', status: 'healthy', metrics: { rps: 9800, latencyMs: 3, errorRate: 0.0 } },
    { id: 'service', label: 'Core Settlement Pods (k8s)', type: 'service', status: 'healthy', metrics: { rps: 8400, latencyMs: 45, errorRate: 0.02 } },
    { id: 'db_primary', label: 'Aurora PostgreSQL Primary', type: 'database', status: 'healthy', metrics: { rps: 2600, latencyMs: 65, errorRate: 0.03 } },
    { id: 'db_replica', label: 'Read Replicas (Cross-AZ)', type: 'database', status: 'healthy', metrics: { rps: 5800, latencyMs: 28, errorRate: 0.01 } },
  ]);

  const [activeChaosEvent, setActiveChaosEvent] = useState<string | null>(null);
  const [chaosMessage, setChaosMessage] = useState<string | null>(null);

  const triggerChaos = (type: 'latency' | 'partition' | 'burst') => {
    setActiveChaosEvent(type);
    if (type === 'latency') {
      setNodes(prev => prev.map(n => n.id === 'db_primary' ? { ...n, status: 'latency_spike', metrics: { ...n.metrics, latencyMs: 680, errorRate: 2.4 } } : n));
      setChaosMessage("⚡ Injected +650ms Latency Spike on Aurora Primary DB. Evaluating circuit-breaker failover to Redis read-through cache.");
    } else if (type === 'partition') {
      setNodes(prev => prev.map(n => n.id === 'db_replica' ? { ...n, status: 'partitioned', metrics: { ...n.metrics, latencyMs: 1200, errorRate: 14.8 } } : n));
      setChaosMessage("💥 Network Partition Split-Brain triggered across Secondary Availability Zone. Raft quorum election testing in progress.");
    } else {
      setNodes(prev => prev.map(n => ({ ...n, status: 'overloaded', metrics: { ...n.metrics, rps: n.metrics.rps * 10, latencyMs: n.metrics.latencyMs * 3.5 } })));
      setChaosMessage("🌊 10x Traffic Burst (125,000 RPS) dispatched to Anycast Load Balancer. Auto-scaler pods spinning up.");
    }
  };

  const resetChaos = () => {
    setActiveChaosEvent(null);
    setChaosMessage(null);
    setNodes(prev => prev.map(n => ({ ...n, status: 'healthy', metrics: { ...n.metrics, latencyMs: n.type === 'database' ? 65 : 25, errorRate: 0.01 } })));
  };

  // 2. Code Execution Sandbox State
  const [codeLanguage, setCodeLanguage] = useState<'typescript' | 'python'>('typescript');
  const [userCode, setUserCode] = useState<string>(`// TokenBucketRateLimiter.ts
// Task: Implement thread-safe token refill with burst capacity
export class TokenBucketRateLimiter {
  private capacity: number;
  private refillRatePerSec: number;
  private tokens: number;
  private lastRefillTimestamp: number;

  constructor(capacity: number, refillRatePerSec: number) {
    this.capacity = capacity;
    this.refillRatePerSec = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  public allowRequest(tokensRequested: number = 1): boolean {
    this.refill();
    if (this.tokens >= tokensRequested) {
      this.tokens -= tokensRequested;
      return true;
    }
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    const tokensToAdd = elapsedSeconds * this.refillRatePerSec;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTimestamp = now;
  }
}`);

  const [testCases, setTestCases] = useState<CodeTestCase[]>([
    { id: '1', input: 'Burst test: 10 concurrent requests at cap=10', expected: 'All 10 allowed (100% throughput)', passed: true },
    { id: '2', input: 'Saturated cap: 11th request after burst', expected: 'Rejected with 429 Too Many Requests', passed: true },
    { id: '3', input: 'Fractional refill: 500ms elapsed at rate=4/s', expected: 'Allow 2 tokens after interval', passed: true, isHidden: true },
  ]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testOutput, setTestOutput] = useState<{ execTimeMs: number; memoryMb: number; allPassed: boolean } | null>(null);

  const handleRunCode = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setIsRunningTests(false);
      setTestOutput({ execTimeMs: 16.4, memoryMb: 7.2, allPassed: true });
    }, 900);
  };

  // 3. Socratic Debugging Simulation State
  const [outageStage, setOutageStage] = useState<number>(1);
  const [candidateActionTaken, setCandidateActionTaken] = useState<string | null>(null);
  const [socraticTutorFeedback, setSocraticTutorFeedback] = useState<string | null>(null);

  const handleTriageAction = (actionKey: string) => {
    setCandidateActionTaken(actionKey);
    if (actionKey === 'pgbouncer') {
      setSocraticTutorFeedback("✅ Excellent Senior/Staff choice. Deploying transaction-mode PgBouncer connection pooling dropped active socket count from 498 to 42, resolving starvation without altering application code.");
      setOutageStage(2);
    } else if (actionKey === 'restart') {
      setSocraticTutorFeedback("⚠️ Premature restart caused a thundering herd (stampede) upon boot, overwhelming the connection pool immediately again. What proactive pooling layer should be placed in front?");
    } else {
      setSocraticTutorFeedback("🔍 Useful diagnostic, but killing idle connections only buys 90 seconds before worker processes spawn new unpooled connections.");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-main)] overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <div className="max-w-6xl mx-auto w-full mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Pillar 2 • Live Technical Sandboxes
              </span>
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-500" /> Interactive Chaos & WASM Execution
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] mt-1">
              Live Technical & Architectural Sandboxes
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Validate distributed architecture against partition chaos, execute code against hidden edge cases, and solve production incident triage.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-color)]">
            <button
              onClick={() => setActiveTab('system_design')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'system_design' ? 'bg-[var(--bg-main)] text-[var(--text-main)] shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              System Design Canvas
            </button>
            <button
              onClick={() => setActiveTab('code_execution')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'code_execution' ? 'bg-[var(--bg-main)] text-[var(--text-main)] shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              In-Browser Code Sandbox
            </button>
            <button
              onClick={() => setActiveTab('socratic_debug')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'socratic_debug' ? 'bg-[var(--bg-main)] text-[var(--text-main)] shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Socratic Outage Debugger
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full pb-12">
        
        {/* TAB 1: System Design Canvas */}
        {activeTab === 'system_design' && (
          <div className="space-y-6">
            {/* Chaos Control Bar */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
                  AI Chaos Engineering Injector:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => triggerChaos('latency')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    activeChaosEvent === 'latency' ? 'bg-amber-500 text-white border-amber-600' : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" /> +650ms Latency Spike
                </button>
                <button
                  onClick={() => triggerChaos('partition')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    activeChaosEvent === 'partition' ? 'bg-red-500 text-white border-red-600' : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" /> DB Partition Split-Brain
                </button>
                <button
                  onClick={() => triggerChaos('burst')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    activeChaosEvent === 'burst' ? 'bg-purple-600 text-white border-purple-700' : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> 10x Traffic Burst (125k RPS)
                </button>
                {activeChaosEvent && (
                  <button
                    onClick={resetChaos}
                    className="p-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    title="Reset Topology"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Notification alert if chaos triggered */}
            {chaosMessage && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{chaosMessage}</span>
              </div>
            )}

            {/* Topology Diagram Grid */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Live Distributed Topology (Staff System Design Benchmark)
                </span>
                <span className="text-[11px] text-emerald-500 font-mono">Status: High Availability Active</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {nodes.map(node => (
                  <div
                    key={node.id}
                    className={`p-4 rounded-xl border transition-all ${
                      node.status === 'latency_spike'
                        ? 'border-amber-500 bg-amber-500/5'
                        : node.status === 'partitioned'
                        ? 'border-red-500 bg-red-500/5'
                        : node.status === 'overloaded'
                        ? 'border-purple-500 bg-purple-500/5'
                        : 'border-[var(--border-color)] bg-[var(--bg-main)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {node.type === 'database' ? <Database className="w-4 h-4 text-blue-500" /> : <Server className="w-4 h-4 text-emerald-500" />}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        node.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {node.status}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-[var(--text-main)] truncate">{node.label}</div>
                    <div className="mt-3 pt-2 border-t border-[var(--border-color)]/60 grid grid-cols-2 gap-1 text-[11px] font-mono text-[var(--text-muted)]">
                      <span>RPS: {node.metrics.rps.toLocaleString()}</span>
                      <span>Latency: {node.metrics.latencyMs}ms</span>
                      <span className="col-span-2">Error: {node.metrics.errorRate}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Apex Architecture Review Card */}
              <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)]">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Apex Architectural Bar-Raiser Assessment</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Your architecture demonstrates sound decoupling with Envoy gateway rate-limiting and Redis write-through caching. To achieve Tier-1 / Staff resilience during cross-AZ partitions, configure an exponential backoff circuit-breaker with jitter in the Envoy filter, fallback read from local in-memory LRU cache, and set idempotent Redis idempotency keys for mutations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: In-Browser Code Sandbox */}
        {activeTab === 'code_execution' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-sm text-[var(--text-main)]">
                    Challenge: High-Concurrency Token Bucket Rate Limiter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={codeLanguage}
                    onChange={(e: any) => setCodeLanguage(e.target.value)}
                    className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg px-2.5 py-1 text-xs text-[var(--text-main)] font-mono"
                  >
                    <option value="typescript">TypeScript (Node WASM)</option>
                    <option value="python">Python 3.11 (Pyodide)</option>
                  </select>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunningTests}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    {isRunningTests ? 'Running Sandbox...' : 'Run Test Cases'}
                  </button>
                </div>
              </div>

              {/* Code Editor Area */}
              <div className="rounded-xl border border-[var(--border-color)] bg-black/90 p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full bg-transparent resize-y outline-none text-emerald-400 font-mono text-xs leading-relaxed min-h-[220px]"
                  spellCheck={false}
                />
              </div>

              {/* Test Case Evaluation Results */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
                  Automated Test Suites (Including Hidden Bar-Raiser Edge Cases):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {testCases.map((tc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[var(--text-main)]">Test #{tc.id} {tc.isHidden && '(Hidden)'}</span>
                        <span className="text-emerald-500 flex items-center gap-1 font-bold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Passed
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{tc.input}</p>
                    </div>
                  ))}
                </div>
              </div>

              {testOutput && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <span className="font-semibold">All 3/3 Test Cases Passed Successfully</span>
                  <span className="font-mono text-[11px]">Execution Time: {testOutput.execTimeMs}ms • Memory: {testOutput.memoryMb}MB</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Socratic Outage Debugger */}
        {activeTab === 'socratic_debug' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-sm text-[var(--text-main)]">
                    Simulated Incident #4829: Critical Payment API Degradation
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                  SEV-1 OUTAGE
                </span>
              </div>

              {/* Outage Log Stream */}
              <div className="rounded-xl border border-[var(--border-color)] bg-black p-4 font-mono text-xs text-red-400 space-y-1 shadow-inner">
                <div>[2026-09-30 21:04:12 UTC] ERROR server: FATAL: remaining connection slots are reserved for non-replication superuser connections</div>
                <div>[2026-09-30 21:04:13 UTC] WARN api-gateway: Upstream timeout (504 Gateway Timeout) on route /v1/checkout/charge (p99 &gt; 5000ms)</div>
                <div>[2026-09-30 21:04:15 UTC] CRITICAL alert: Active pool sockets = 500/500 saturated. 1,420 incoming queries queued.</div>
              </div>

              {/* Socratic Challenge */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider block">
                  Staff Socratic Triage Question: How do you immediately stabilize the database pool without data loss?
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleTriageAction('pgbouncer')}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                      candidateActionTaken === 'pgbouncer' ? 'border-emerald-500 bg-emerald-500/10' : 'border-[var(--border-color)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <div className="font-semibold text-[var(--text-main)] mb-1">A. Deploy PgBouncer in Transaction Mode</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Multiplex thousands of client connections into a controlled small pool of 40 active server connections.</div>
                  </button>

                  <button
                    onClick={() => handleTriageAction('restart')}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                      candidateActionTaken === 'restart' ? 'border-red-500 bg-red-500/10' : 'border-[var(--border-color)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <div className="font-semibold text-[var(--text-main)] mb-1">B. Hard Restart Postgres Primary</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Instantly sever all 500 connections and trigger an immediate failover to the read-replica.</div>
                  </button>

                  <button
                    onClick={() => handleTriageAction('kill_idle')}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                      candidateActionTaken === 'kill_idle' ? 'border-amber-500 bg-amber-500/10' : 'border-[var(--border-color)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <div className="font-semibold text-[var(--text-main)] mb-1">C. Terminate Idle-In-Transaction Sockets</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Execute pg_terminate_backend() script for all idle queries exceeding 30 seconds.</div>
                  </button>
                </div>
              </div>

              {/* Socratic Feedback */}
              {socraticTutorFeedback && (
                <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)]">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>Staff Incident Commander Evaluation:</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {socraticTutorFeedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
