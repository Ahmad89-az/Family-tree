import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { familyMembers as seedData } from '../data/familyData';

const STORAGE_KEY = 'silsilah-keluarga-data-v1';
const FamilyDataContext = createContext(null);

export function FamilyDataProvider({ children }) {
  const [members, setMembers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Gagal memuat data tersimpan, menggunakan data awal.', e);
    }
    return seedData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch (e) {
      console.warn('Gagal menyimpan data ke localStorage.', e);
    }
  }, [members]);

  const addMember = useCallback((member) => {
    setMembers((prev) => [...prev, { ...member, id: member.id || crypto.randomUUID() }]);
  }, []);

  const updateMember = useCallback((id, updates) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const deleteMember = useCallback((id) => {
    setMembers((prev) =>
      prev
        .filter((m) => m.id !== id)
        .map((m) => ({
          ...m,
          children: (m.children || []).filter((c) => c !== id),
          spouse: (m.spouse || []).filter((s) => s !== id),
          father: m.father === id ? null : m.father,
          mother: m.mother === id ? null : m.mother,
        }))
    );
  }, []);

  const importData = useCallback((data) => {
    if (Array.isArray(data)) setMembers(data);
  }, []);

  const resetToSeed = useCallback(() => setMembers(seedData), []);

  const exportData = useCallback(() => JSON.stringify(members, null, 2), [members]);

  return (
    <FamilyDataContext.Provider
      value={{ members, addMember, updateMember, deleteMember, importData, exportData, resetToSeed }}
    >
      {children}
    </FamilyDataContext.Provider>
  );
}

export function useFamilyData() {
  const ctx = useContext(FamilyDataContext);
  if (!ctx) throw new Error('useFamilyData harus digunakan di dalam FamilyDataProvider');
  return ctx;
}
