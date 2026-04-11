import { create } from 'zustand';
import { db } from './db';

const STORAGE_KEYS = {
  session: 'schoolpilot_session',
  migrated: 'schoolpilot_migrated_to_dexie',
  // Old keys for migration
  oldUsers: 'schoolpilot_users',
  oldRecords: 'schoolpilot_records',
  oldPrefs: 'schoolpilot_subject_prefs',
};

export const useStore = create((set, get) => ({
  currentUser: null,
  sidebarCollapsed: false,
  activeTab: 'dashboard',
  records: [], // Local cache of records
  users: [],

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  initDB: async () => {
    try {
      // 1. Check for migration from localStorage
      const isMigrated = localStorage.getItem(STORAGE_KEYS.migrated);
      if (!isMigrated) {
        const oldUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.oldUsers) || '[]');
        const oldRecords = JSON.parse(localStorage.getItem(STORAGE_KEYS.oldRecords) || '[]');
        const oldPrefs = JSON.parse(localStorage.getItem(STORAGE_KEYS.oldPrefs) || '{}');

        // Use put to avoid duplicate errors
        if (oldUsers.length > 0) {
          for(const u of oldUsers) await db.users.put(u).catch(e => console.warn(e));
        }
        if (oldRecords.length > 0) {
          for(const r of oldRecords) await db.records.put(r).catch(e => console.warn(e));
        }
        if (Object.keys(oldPrefs).length > 0) {
          for (const [email, subjects] of Object.entries(oldPrefs)) {
            await db.subjectPrefs.put({ email, subjects }).catch(e => console.warn(e));
          }
        }
        localStorage.setItem(STORAGE_KEYS.migrated, 'true');
      }

      // 2. Load initial data
      const users = await db.users.toArray();
      const records = await db.records.toArray();
      set({ users, records });

      // 3. Restore session
      const sessionStr = localStorage.getItem(STORAGE_KEYS.session);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const found = users.find(u => u.email === session.email);
        if (found) set({ currentUser: found });
      }
    } catch (err) {
      console.error('Failed to init DB:', err);
    }
  },

  getUsers: async () => await db.users.toArray(),
  saveUsers: async (users) => {
    // Note: We usually don't need bulk overwrite with Dexie, we do single operations.
    // But for compatibility with existing logic:
    await db.users.clear();
    await db.users.bulkAdd(users);
    set({ users });
  },

  getRecords: async () => await db.records.toArray(),
  addRecord: async (record) => {
    await db.records.add(record);
    const records = await db.records.toArray();
    set({ records });
  },
  deleteRecord: async (id) => {
    await db.records.delete(id);
    const records = await db.records.toArray();
    set({ records });
  },
  updateRecord: async (id, updates) => {
    const idNum = Number(id); // Dexie IDs might be numbers
    await db.records.update(isNaN(idNum) ? id : idNum, updates);
    const records = await db.records.toArray();
    set({ records });
  },

  getSavedSubjects: async (email) => {
    const pref = await db.subjectPrefs.get(email);
    return pref?.subjects || [];
  },
  saveSavedSubjects: async (email, subjects) => {
    await db.subjectPrefs.put({ email, subjects });
  },
  clearSavedSubjects: async (email) => {
    await db.subjectPrefs.delete(email);
  },

  login: (user) => {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ email: user.email }));
    set({ currentUser: user, activeTab: 'dashboard' });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.session);
    set({ currentUser: null, activeTab: 'dashboard' });
  },

  updateCurrentUser: async (updates) => {
    const state = get();
    if (!state.currentUser) return;
    
    // Find in DB by email
    const user = await db.users.where('email').equals(state.currentUser.email).first();
    if (user) {
      const updatedUser = { ...user, ...updates };
      await db.users.put(updatedUser);
      set({ currentUser: updatedUser });
      
      // Update global users list too
      const users = await db.users.toArray();
      set({ users });
    }
  },
}));

export const SUBJECT_LIBRARY = [
  'Mathematics', 'Science', 'English', 'Hindi', 'Social Science',
  'Computer Science', 'Sanskrit', 'General Knowledge', 'Drawing',
  'Physical Education', 'Economics', 'Biology', 'Chemistry', 'Physics',
  'Accountancy', 'Business Studies',
];

export const RESULT_TEMPLATES = [
  { id: 'template-1', name: 'Royal Horizon', swatch: 'linear-gradient(130deg, #0f4f86, #2b8abd)' },
  { id: 'template-2', name: 'Emerald Luxe', swatch: 'linear-gradient(130deg, #0a6247, #34a57a)' },
  { id: 'template-3', name: 'Midnight Gold', swatch: 'linear-gradient(130deg, #1b2448, #b68a3b)' },
  { id: 'template-4', name: 'Rose Quartz', swatch: 'linear-gradient(130deg, #7a3c52, #d48da5)' },
  { id: 'template-5', name: 'Platinum Slate', swatch: 'linear-gradient(130deg, #2b3d52, #7b96b3)' },
];

export function gradeFromPercentage(percent) {
  if (percent >= 90) return 'A+';
  if (percent >= 80) return 'A';
  if (percent >= 70) return 'B+';
  if (percent >= 60) return 'B';
  if (percent >= 50) return 'C';
  if (percent >= 33) return 'D';
  return 'F';
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read file.'));
    reader.readAsDataURL(file);
  });
}
