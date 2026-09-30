import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Apex - AI Career Coach & Strategic Advisor',
  description:
    'Apex is your full-stack personalized AI Career Coach: ATS-optimized resumes, real-time STAR mock interviews, benchmark skill gap roadmaps, and high-leverage compensation negotiation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light theme-bw-light h-screen overflow-hidden" suppressHydrationWarning>
      <body 
        className="bg-[var(--bg-main)] text-[var(--text-main)] antialiased h-screen overflow-hidden flex flex-col"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
