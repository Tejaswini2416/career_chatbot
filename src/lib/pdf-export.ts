import { jsPDF } from 'jspdf';
import { UserProfile } from './types';

/**
 * Cleanly strips markdown syntax and returns plain formatted text lines
 */
function cleanMarkdown(text: string): string {
  return text
    .replace(/^#+\s+/gm, '') // Remove heading hashes
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italics
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links
}

/**
 * Generates an ATS-optimized, beautifully formatted PDF resume or career document.
 */
export async function exportResumeToPdf(
  docTitle: string,
  markdownContent: string,
  profile?: UserProfile
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
  };

  // Extract candidate name and details
  const candidateName = profile?.fullName || 'CAREER PROFESSIONAL';
  const roleTitle = profile?.currentRole || profile?.targetRoles?.[0] || 'Software Engineer';
  const contactEmail = `${candidateName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
  const location = 'San Francisco, CA • LinkedIn • GitHub';

  // Parse lines from markdown
  const lines = markdownContent.split('\n');

  // Document Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(24, 24, 27); // Dark gray / black
  doc.text(candidateName.toUpperCase(), margin, cursorY);
  cursorY += 7;

  // Subtitle / Target Role
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229); // Accent indigo
  doc.text(roleTitle.toUpperCase(), margin, cursorY);
  cursorY += 5;

  // Contact info line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`${contactEmail} | ${location}`, margin, cursorY);
  cursorY += 4;

  // Top Divider line
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 6;

  // Process markdown body
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Skip empty lines
    if (!trimmed) {
      cursorY += 2;
      continue;
    }

    // Skip candidate name if repeated at top
    if (i < 3 && (trimmed.startsWith('# ') || trimmed.includes(candidateName.toUpperCase()))) {
      continue;
    }

    // Section Headers (## HEADING)
    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const headingText = cleanMarkdown(trimmed.replace(/^#+\s*/, '')).toUpperCase();
      checkPageBreak(12);
      cursorY += 4;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59); // Slate 800
      doc.text(headingText, margin, cursorY);
      cursorY += 2;

      // Section underline
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 4;
      continue;
    }

    // Sub-headings (### Job Title / Company)
    if (trimmed.startsWith('### ')) {
      const subHeadingText = cleanMarkdown(trimmed.replace(/^###\s*/, ''));
      checkPageBreak(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85); // Slate 700
      doc.text(subHeadingText, margin, cursorY);
      cursorY += 4.5;
      continue;
    }

    // Bullet points
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const bulletText = cleanMarkdown(trimmed.replace(/^[-*•]\s*/, ''));
      const bulletIndent = 5;
      const textWidth = contentWidth - bulletIndent;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);

      const wrappedLines = doc.splitTextToSize(bulletText, textWidth);
      checkPageBreak(wrappedLines.length * 4.2 + 2);

      // Draw bullet circle
      doc.setFillColor(79, 70, 229);
      doc.circle(margin + 1.5, cursorY - 1.2, 0.7, 'F');

      // Draw text
      doc.text(wrappedLines, margin + bulletIndent, cursorY);
      cursorY += wrappedLines.length * 4.2 + 1;
      continue;
    }

    // Divider line
    if (trimmed === '---' || trimmed === '***') {
      checkPageBreak(6);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 4;
      continue;
    }

    // Standard body paragraph
    const bodyText = cleanMarkdown(trimmed);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);

    const wrapped = doc.splitTextToSize(bodyText, contentWidth);
    checkPageBreak(wrapped.length * 4.2 + 2);
    doc.text(wrapped, margin, cursorY);
    cursorY += wrapped.length * 4.2 + 2;
  }

  // Footer on each page
  const totalPages = doc.internal.pages.length - 1;
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    const footerText = `${candidateName} — ${docTitle} | Page ${p} of ${totalPages}`;
    doc.text(footerText, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  // Download PDF
  const safeFilename = `${(candidateName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
  doc.save(safeFilename);
}
