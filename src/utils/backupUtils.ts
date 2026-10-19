import { INITIAL_LEADS, INITIAL_PROJECTS, INITIAL_STAFF, INITIAL_CLIENT_ACCOUNTS, INITIAL_MEETINGS, INITIAL_CHAT_MESSAGES, INITIAL_VISUAL_INSPIRATIONS } from '../data/mockData';
import { getUnifiedClients, INITIAL_UNIFIED_CLIENTS } from '../data/methodologyData';
import { initializeSingleSourceData, STORAGE_KEYS as CANONICAL_STORAGE_KEYS } from '../data/singleSourceData';

export interface DataBackupCollections {
  accounts: any[];
  contacts: any[];
  duplicateNotices: any[];
  opportunities: any[];
  contracts: any[];
  deliveryTemplates: any[];
  leads: any[];
  projects: any[];
  clientAccounts: any[];
  clients: any[];
  methodologyClients: any[];
  staffMembers: any[];
  meetings: any[];
  chatMessages: any[];
  notifications: any[];
  visualInspirations: any[];
  [key: string]: any[];
}

export interface DataBackup {
  version: number;
  createdAt: string;
  collections: DataBackupCollections;
}

const STORAGE_KEYS = {
  // Canonical Single Source Keys
  accounts: CANONICAL_STORAGE_KEYS.accounts,
  contacts: CANONICAL_STORAGE_KEYS.contacts,
  duplicateNotices: CANONICAL_STORAGE_KEYS.duplicateNotices,
  opportunities: CANONICAL_STORAGE_KEYS.opportunities,
  contracts: CANONICAL_STORAGE_KEYS.contracts,
  deliveryTemplates: CANONICAL_STORAGE_KEYS.deliveryTemplates,
  auditEvents: CANONICAL_STORAGE_KEYS.auditEvents,
  diagnostics: CANONICAL_STORAGE_KEYS.diagnosticRecords,

  // App core keys
  leads: 'sharp_leads',
  projects: 'sharp_projects',
  clientAccounts: 'sharp_client_accounts',
  clientsDirectory: 'sharp_clients_directory',
  clientsDirectoryUnified: 'sharp_clients_directory_unified',
  methodologyClients: 'sharp_methodology_clients_v2',
  staffMembers: 'sharp_staff_members',
  meetings: 'sharp_meetings',
  chatMessages: 'sharp_chat_messages',
  notifications: 'sharp_notifications',
  visualInspirations: 'sharp_visual_inspirations',
  backupLatest: 'sharp_backup_latest',
  backupHistory: 'sharp_backup_history'
};

function safeGetArray(key: string, fallback: any[] = []): any[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

/**
 * Cria uma cópia de segurança completa de todas as coleções do sistema Sharp,
 * incluindo prioritariamente as coleções canônicas de Single Source.
 */
export function createDataBackup(): DataBackup {
  const singleSourceInit = initializeSingleSourceData();

  const accounts = safeGetArray(STORAGE_KEYS.accounts, singleSourceInit.accounts);
  const contacts = safeGetArray(STORAGE_KEYS.contacts, singleSourceInit.contacts);
  const duplicateNotices = safeGetArray(STORAGE_KEYS.duplicateNotices, singleSourceInit.duplicateNotices);
  const opportunities = safeGetArray(STORAGE_KEYS.opportunities, singleSourceInit.opportunities);
  const contracts = safeGetArray(STORAGE_KEYS.contracts, singleSourceInit.contracts);
  const deliveryTemplates = safeGetArray(STORAGE_KEYS.deliveryTemplates, singleSourceInit.deliveryTemplates);

  const leads = safeGetArray(STORAGE_KEYS.leads, INITIAL_LEADS);
  const projects = safeGetArray(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  const clientAccounts = safeGetArray(STORAGE_KEYS.clientAccounts, INITIAL_CLIENT_ACCOUNTS);
  const unifiedClients = getUnifiedClients();
  const rawDirectory = safeGetArray(STORAGE_KEYS.clientsDirectory, []);
  const methodologyClients = safeGetArray(STORAGE_KEYS.methodologyClients, INITIAL_UNIFIED_CLIENTS);
  const staffMembers = safeGetArray(STORAGE_KEYS.staffMembers, INITIAL_STAFF);
  const meetings = safeGetArray(STORAGE_KEYS.meetings, INITIAL_MEETINGS);
  const chatMessages = safeGetArray(STORAGE_KEYS.chatMessages, INITIAL_CHAT_MESSAGES);
  const notifications = safeGetArray(STORAGE_KEYS.notifications, []);
  const visualInspirations = safeGetArray(STORAGE_KEYS.visualInspirations, INITIAL_VISUAL_INSPIRATIONS);

  const backup: DataBackup = {
    version: 2,
    createdAt: new Date().toISOString(),
    collections: {
      accounts,
      contacts,
      duplicateNotices,
      opportunities,
      contracts,
      deliveryTemplates,
      leads,
      projects,
      clientAccounts,
      clients: accounts.length > 0 ? accounts : (unifiedClients.length > 0 ? unifiedClients : (rawDirectory.length > 0 ? rawDirectory : INITIAL_UNIFIED_CLIENTS)),
      methodologyClients,
      staffMembers,
      meetings,
      chatMessages,
      notifications,
      visualInspirations
    }
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.backupLatest, JSON.stringify(backup));
      
      // Save in history (up to last 5 backups)
      const history = safeGetArray(STORAGE_KEYS.backupHistory, []);
      const updatedHistory = [
        { 
          version: backup.version, 
          createdAt: backup.createdAt, 
          summary: `Contas: ${accounts.length}, Oportunidades: ${opportunities.length}, Leads: ${leads.length}, Projetos: ${projects.length}` 
        },
        ...history
      ].slice(0, 5);
      localStorage.setItem(STORAGE_KEYS.backupHistory, JSON.stringify(updatedHistory));
    } catch (err) {
      console.warn('Não foi possível persistir snapshot de backup no localStorage:', err);
    }
  }

  return backup;
}

/**
 * Restaura os dados a partir de um backup válido.
 * Prioriza a restauração nas coleções canônicas single-source.
 */
export function restoreDataBackup(backupPayload?: DataBackup | string): { success: boolean; message: string; details?: any } {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Restauração não suportada fora do ambiente de navegador.' };
  }

  let backup: DataBackup;

  if (!backupPayload) {
    const rawLatest = localStorage.getItem(STORAGE_KEYS.backupLatest);
    if (!rawLatest) {
      return { success: false, message: 'Nenhum backup recente foi encontrado para restauração.' };
    }
    try {
      backup = JSON.parse(rawLatest);
    } catch (e) {
      return { success: false, message: 'O arquivo de backup mais recente está corrompido.' };
    }
  } else if (typeof backupPayload === 'string') {
    try {
      backup = JSON.parse(backupPayload);
    } catch (e) {
      return { success: false, message: 'O formato JSON do backup é inválido.' };
    }
  } else {
    backup = backupPayload;
  }

  if (!backup || !backup.collections || typeof backup.collections !== 'object') {
    return { success: false, message: 'Estrutura de dados de backup incompatível.' };
  }

  try {
    const c = backup.collections;

    // 1. Restore Canonical Single Source Collections
    if (Array.isArray(c.accounts)) {
      localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(c.accounts));
    }
    if (Array.isArray(c.contacts)) {
      localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(c.contacts));
    }
    if (Array.isArray(c.duplicateNotices)) {
      localStorage.setItem(STORAGE_KEYS.duplicateNotices, JSON.stringify(c.duplicateNotices));
    }
    if (Array.isArray(c.opportunities)) {
      localStorage.setItem(STORAGE_KEYS.opportunities, JSON.stringify(c.opportunities));
    }
    if (Array.isArray(c.contracts)) {
      localStorage.setItem(STORAGE_KEYS.contracts, JSON.stringify(c.contracts));
    }
    if (Array.isArray(c.deliveryTemplates)) {
      localStorage.setItem(STORAGE_KEYS.deliveryTemplates, JSON.stringify(c.deliveryTemplates));
    }

    // 2. Restore Operational Collections
    if (Array.isArray(c.leads)) {
      localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(c.leads));
    }
    if (Array.isArray(c.projects)) {
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(c.projects));
    }
    if (Array.isArray(c.clientAccounts)) {
      localStorage.setItem(STORAGE_KEYS.clientAccounts, JSON.stringify(c.clientAccounts));
    }
    if (Array.isArray(c.staffMembers)) {
      localStorage.setItem(STORAGE_KEYS.staffMembers, JSON.stringify(c.staffMembers));
    }
    if (Array.isArray(c.meetings)) {
      localStorage.setItem(STORAGE_KEYS.meetings, JSON.stringify(c.meetings));
    }
    if (Array.isArray(c.chatMessages)) {
      localStorage.setItem(STORAGE_KEYS.chatMessages, JSON.stringify(c.chatMessages));
    }
    if (Array.isArray(c.notifications)) {
      localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(c.notifications));
    }
    if (Array.isArray(c.visualInspirations)) {
      localStorage.setItem(STORAGE_KEYS.visualInspirations, JSON.stringify(c.visualInspirations));
    }

    // Trigger local events for re-sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sharp_data_restored', { detail: backup }));
    }

    return {
      success: true,
      message: 'Backup restaurado com sucesso.',
      details: {
        createdAt: backup.createdAt,
        version: backup.version,
        counts: {
          accounts: c.accounts?.length || 0,
          contacts: c.contacts?.length || 0,
          opportunities: c.opportunities?.length || 0,
          contracts: c.contracts?.length || 0,
          leads: c.leads?.length || 0,
          projects: c.projects?.length || 0
        }
      }
    };
  } catch (err: any) {
    console.error('Erro ao restaurar backup:', err);
    return { success: false, message: `Erro na restauração: ${err?.message || String(err)}` };
  }
}

/**
 * Retorna o backup mais recente salvo.
 */
export function getLatestBackup(): DataBackup | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.backupLatest);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Garante que um backup inicial de segurança exista antes de qualquer mudança estrutural.
 */
export function ensureInitialSafetyBackup(): DataBackup {
  const existing = getLatestBackup();
  if (existing) return existing;
  return createDataBackup();
}

