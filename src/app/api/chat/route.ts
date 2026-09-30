import { NextRequest, NextResponse } from 'next/server';
import { APEX_SYSTEM_PROMPT } from '@/lib/constants';
import { AppMode, UserProfile } from '@/lib/types';
import { generateContextualApexResponse } from '@/lib/ai-stream';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      profile,
      mode = 'strategy',
      interviewCategory,
      customApiKey,
      provider = 'openai',
      interviewerArchetype = 'staff_architect'
    }: {
      messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
      profile: UserProfile;
      mode: AppMode;
      interviewCategory?: string;
      customApiKey?: string;
      provider?: string;
      interviewerArchetype?: string;
    } = body;

    const apiKey = customApiKey || process.env.OPENAI_API_KEY;
    const latestUserMessage = messages[messages.length - 1]?.content || '';

    const archetypeDirective = {
      staff_architect: `\nINTERVIEWER ARCHETYPE: The Skeptical Staff Architect. Rigorous, probes distributed failure modes, CAP theorem tradeoffs, p99 tail latency, and edge cases.`,
      seed_founder: `\nINTERVIEWER ARCHETYPE: The Fast-Talking Seed Founder. Rewards 0-to-1 speed of delivery, pragmatic trade-offs, scrappiness, customer intuition, and bias for action.`,
      product_vp: `\nINTERVIEWER ARCHETYPE: The Metric-Driven Product VP. Focuses on cross-squad alignment, ARR OKR impact, churn reduction, and executive presence.`
    }[interviewerArchetype] || '';

    // Construct rich dynamic user profile context
    const profileContext = profile ? `
USER PROFILE CONTEXT:
- Full Name: ${profile.fullName || 'User'}
- Current Role: ${profile.currentRole || 'Professional'}
- Experience Level: ${profile.experienceLevel || 'Mid-Senior'}
- Years of Experience: ${profile.yearsOfExperience || 5} years
- Industry/Domain: ${profile.industry || 'Technology'}
- Core Skills: ${(profile.keySkills || []).join(', ')}
- Target Roles: ${(profile.targetRoles || []).join(', ')}
- Target Companies: ${(profile.targetCompanies || []).join(', ')}
- Target Salary / Compensation: ${profile.targetSalary || 'Market Top Tier'}
- Short-term Goals (3-6 mo): ${profile.shortTermGoals || 'Accelerate career growth'}
- Long-term Goals (1-3 yr): ${profile.longTermGoals || 'Reach senior leadership'}
- Past Performance Feedback / Growth Areas: ${profile.pastFeedback || 'Elevate cross-functional impact'}
- Resume Summary / Highlights:
"""
${profile.resumeText ? profile.resumeText.slice(0, 1500) : 'No resume uploaded.'}
"""
` : '';

    const modeDirectives = {
      strategy: `CURRENT MODE: General Career Strategy. Provide holistic, high-impact career guidance, promotion blueprints, actionable next steps, and curated YouTube/practice site links.`,
      interview: `CURRENT MODE: Mock Interview Mode (Category: ${interviewCategory || 'Behavioral STAR'}).
MANDATORY RULES:
1. Conduct the interview tailored strictly to the candidate's chosen target role: "${profile?.targetRoles?.[0] || 'Staff Software Engineer'}".
2. The interview consists of 3 sequential progressive questions. Ask ONE question at a time.
3. While the interview is in progress (Questions 1 and 2), DO NOT score or evaluate yet. Simply acknowledge ("Answer recorded for Question X") and present the next question.
4. AT THE END (after Question 3 is answered, or if the user asks for results/debrief): PROVIDE THE COMPREHENSIVE FINAL PERFORMANCE REPORT: Overall candidate score (1-10), hiring recommendation, question-by-question STAR breakdown, observed strengths, specific improvement suggestions, Apex benchmark model answers, and curated clickable YouTube tutorials & practice testing site links.`,
      studio: `CURRENT MODE: Document Studio Mode. Produce clean, ATS-compliant, highly tailored documents (Resume, Cover Letter, Outreach, Negotiation script). Include rich Markdown formatting.`,
      roadmap: `CURRENT MODE: Skill Gap & Career Roadmap Studio. Benchmark the user's current experience vs target roles, provide a 30-60-90 day milestone execution plan with YouTube and practice site links.`,
      negotiation: `CURRENT MODE: Compensation & Offer Negotiation Lab. Formulate counter-offers, total comp breakdowns, and verbatim negotiation email scripts.`,
      audio_interview: `CURRENT MODE: Multimodal Voice & Audio Interview. Provide direct, natural verbal dialogue with real-time speech and non-verbal telemetry pointers.`,
      sandbox: `CURRENT MODE: Technical & Architecture Sandbox. Challenge the candidate on distributed systems resilience, in-browser code implementation, and Socratic outage debugging.`,
      market_intel: `CURRENT MODE: Market Intelligence & Job Ingestion. Analyze job postings against user skills, calculate skill deltas, and highlight industry technology volatility.`,
      kanban: `CURRENT MODE: Application Lifecycle & Opportunity Funnel. Manage job pipeline stages, clip job descriptions, and produce automated 2-hour interview debriefs.`,
      on_the_job: `CURRENT MODE: On-the-Job Companion & Longevity. Guide the candidate through their first 90 days, log weekly brag sheets for promotion packets, and monitor cognitive fatigue.`
    }[mode] || '';

    const fullSystemPrompt = `${APEX_SYSTEM_PROMPT}\n${archetypeDirective}\n\n${profileContext}\n\n${modeDirectives}`;

    // If an external OpenAI key is available, use OpenAI streaming API
    if (apiKey && apiKey.startsWith('sk-') && provider === 'openai') {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: fullSystemPrompt },
              ...messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
            ],
            stream: true,
            temperature: 0.7,
          }),
        });

        if (response.ok && response.body) {
          const encoder = new TextEncoder();
          const decoder = new TextDecoder();

          const stream = new ReadableStream({
            async start(controller) {
              const reader = response.body!.getReader();
              let buffer = '';

              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  buffer += decoder.decode(value, { stream: true });
                  const lines = buffer.split('\n');
                  buffer = lines.pop() || '';

                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
                      try {
                        const json = JSON.parse(trimmed.slice(6));
                        const text = json.choices?.[0]?.delta?.content;
                        if (text) {
                          controller.enqueue(encoder.encode(text));
                        }
                      } catch (e) {
                        // ignore malformed chunk
                      }
                    }
                  }
                }
              } catch (err) {
                controller.error(err);
              } finally {
                controller.close();
              }
            }
          });

          return new Response(stream, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Transfer-Encoding': 'chunked',
            },
          });
        }
      } catch (err) {
        console.warn('OpenAI stream failed, falling back to Apex dynamic generator', err);
      }
    }

    // High-fidelity fallback streaming engine
    const fullText = generateContextualApexResponse(latestUserMessage, profile, mode, messages);
    const words = fullText.split(' ');
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const chunkSize = 3;
        for (let i = 0; i < words.length; i += chunkSize) {
          const chunk = (i === 0 ? '' : ' ') + words.slice(i, i + chunkSize).join(' ');
          controller.enqueue(encoder.encode(chunk));
          await new Promise(resolve => setTimeout(resolve, 8));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
