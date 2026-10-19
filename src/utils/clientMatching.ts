// Comprehensive matching utility to safely correlate Accounts, Projects, ClientAccounts, Contacts, Leads and Directory entries

export function normalizeClientKey(str?: string | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]/g, '');     // keep only alphanumeric
}

const NOISE_WORDS = new Set([
  'clinica', 'clínica', 'odontologia', 'odonto', 'estetica', 'estética',
  'instituto', 'dr', 'dra', 'doutor', 'doutora', 'ltda', 'me', 'eireli',
  'sa', 'servicos', 'serviços', 'grupo', 'holding', 'bistro', 'bistrô',
  'gastronomia', 'financeiras', 'solucoes', 'soluções', 'consultoria',
  'advocacia', 'medicina', 'saude', 'saúde', 'studio', 'estudio'
]);

export function extractSignificantTokens(str?: string | null): string[] {
  if (!str) return [];
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .map(t => t.trim())
    .filter(t => t.length >= 3 && !NOISE_WORDS.has(t));
}

export interface ClientEntityCandidate {
  id?: string;
  accountId?: string;
  projectId?: string;
  leadId?: string;
  clientId?: string;
  companyName?: string;
  clientName?: string;
  name?: string;
  company?: string;
  email?: string;
}

export function isClientMatch(
  candidate: ClientEntityCandidate | string | undefined | null,
  target: string | undefined | null
): boolean {
  if (!candidate || !target) return false;

  const targetStr = typeof target === 'string' ? target.trim() : '';
  if (!targetStr) return false;

  const targetNorm = normalizeClientKey(targetStr);
  const targetLower = targetStr.toLowerCase();
  const targetTokens = extractSignificantTokens(targetStr);

  // If candidate is a direct string (e.g. ID or companyName)
  if (typeof candidate === 'string') {
    const candTrim = candidate.trim();
    if (candTrim === targetStr) return true;
    if (candTrim.toLowerCase() === targetLower) return true;
    const candNorm = normalizeClientKey(candTrim);
    if (candNorm === targetNorm) return true;
    if (candNorm.length >= 4 && targetNorm.length >= 4) {
      if (candNorm.includes(targetNorm) || targetNorm.includes(candNorm)) return true;
    }
    const candTokens = extractSignificantTokens(candTrim);
    if (candTokens.some(t => targetTokens.includes(t))) return true;
    return false;
  }

  // 1. Direct ID checks
  const candIds = [
    candidate.id,
    candidate.accountId,
    candidate.projectId,
    candidate.leadId,
    candidate.clientId
  ].filter(Boolean) as string[];

  for (const id of candIds) {
    if (id === targetStr) return true;
    if (id.toLowerCase() === targetLower) return true;
    if (normalizeClientKey(id) === targetNorm) return true;
  }

  // 2. Name & Company checks
  const candNames = [
    candidate.companyName,
    candidate.company,
    candidate.clientName,
    candidate.name
  ].filter(Boolean) as string[];

  for (const name of candNames) {
    const nameTrim = name.trim();
    if (nameTrim.toLowerCase() === targetLower) return true;

    const nameNorm = normalizeClientKey(nameTrim);
    if (nameNorm === targetNorm) return true;

    // Substring check
    if (nameNorm.length >= 4 && targetNorm.length >= 4) {
      if (nameNorm.includes(targetNorm) || targetNorm.includes(nameNorm)) return true;
    }

    // Token check
    const nameTokens = extractSignificantTokens(nameTrim);
    if (nameTokens.some(t => targetTokens.includes(t))) {
      return true;
    }
  }

  // 3. Email check
  if (candidate.email && targetStr.includes('@')) {
    if (candidate.email.toLowerCase().trim() === targetLower) return true;
  }

  return false;
}
