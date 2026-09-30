import { AppSettings, GeneratedDocument, UserProfile, ChatMessage } from './types';
import { DEFAULT_USER_PROFILE } from './constants';

const PROFILE_STORAGE_KEY = 'apex_user_profile_v1';
const CHAT_STORAGE_KEY = 'apex_chat_messages_v1';
const DOCS_STORAGE_KEY = 'apex_documents_v1';
const SETTINGS_STORAGE_KEY = 'apex_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  apiProvider: 'openai',
  modelName: 'gpt-4o-mini',
  soundEnabled: true,
  streamSpeed: 'fast',
  themeMode: 'bw-light',
  platformView: 'desktop',
  interviewerArchetype: 'staff_architect',
  piiRedactionEnabled: true,
};

export function loadStoredProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
  try {
    const item = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (item) {
      return { ...DEFAULT_USER_PROFILE, ...JSON.parse(item) };
    }
  } catch (e) {
    console.error('Failed to load user profile from storage', e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveStoredProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to storage', e);
  }
}

export function loadStoredChat(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(CHAT_STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error('Failed to load chat history', e);
  }
  return [];
}

export function saveStoredChat(messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-50)));
  } catch (e) {
    console.error('Failed to save chat history', e);
  }
}

export function loadStoredDocuments(): GeneratedDocument[] {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(DOCS_STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error('Failed to load documents', e);
  }
  return [];
}

export function saveStoredDocuments(docs: GeneratedDocument[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save documents', e);
  }
}

export function loadStoredSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const item = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (item) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(item) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}
