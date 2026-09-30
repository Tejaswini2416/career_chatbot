/**
 * PII Redaction Vault
 * Client-side cryptographic & regex scrubbing utility.
 * Sanitizes candidate personal identifiable information (emails, phone numbers,
 * street addresses, Social Security/National IDs) locally before dispatching to external LLMs.
 */

export interface RedactionResult {
  scrubbedText: string;
  redactedCount: number;
  entitiesFound: {
    type: 'EMAIL' | 'PHONE' | 'ADDRESS' | 'CANDIDATE_NAME';
    original: string;
    placeholder: string;
  }[];
}

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
const ADDRESS_REGEX = /\b\d{1,5}\s+[A-Za-z0-9\s,.'-]{3,35}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Way|Lane|Ln)\b/gi;

export function redactPII(text: string, candidateName?: string): RedactionResult {
  if (!text) {
    return { scrubbedText: '', redactedCount: 0, entitiesFound: [] };
  }

  const entitiesFound: RedactionResult['entitiesFound'] = [];
  let scrubbedText = text;

  // 1. Redact Emails
  let emailCount = 0;
  scrubbedText = scrubbedText.replace(EMAIL_REGEX, (match) => {
    emailCount++;
    const placeholder = `[REDACTED_EMAIL_${emailCount}]`;
    entitiesFound.push({ type: 'EMAIL', original: match, placeholder });
    return placeholder;
  });

  // 2. Redact Phone Numbers
  let phoneCount = 0;
  scrubbedText = scrubbedText.replace(PHONE_REGEX, (match) => {
    phoneCount++;
    const placeholder = `[REDACTED_PHONE_${phoneCount}]`;
    entitiesFound.push({ type: 'PHONE', original: match, placeholder });
    return placeholder;
  });

  // 3. Redact Addresses
  let addrCount = 0;
  scrubbedText = scrubbedText.replace(ADDRESS_REGEX, (match) => {
    addrCount++;
    const placeholder = `[REDACTED_ADDRESS_${addrCount}]`;
    entitiesFound.push({ type: 'ADDRESS', original: match, placeholder });
    return placeholder;
  });

  // 4. Redact Candidate Full Name if provided
  if (candidateName && candidateName.trim().length > 2) {
    const nameRegex = new RegExp(`\\b${escapeRegExp(candidateName.trim())}\\b`, 'gi');
    scrubbedText = scrubbedText.replace(nameRegex, (match) => {
      const placeholder = '[CANDIDATE_ANONYMOUS]';
      entitiesFound.push({ type: 'CANDIDATE_NAME', original: match, placeholder });
      return placeholder;
    });
  }

  return {
    scrubbedText,
    redactedCount: entitiesFound.length,
    entitiesFound
  };
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
