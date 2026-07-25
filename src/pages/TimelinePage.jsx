import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFamilyData } from '../context/FamilyDataContext';
import { getAllGenerations } from '../utils/familyUtils';
import ProfileModal from '../components/profile/ProfileModal';

const genLabels = {
  1: 'Generasi 1 — Leluhur',
  2: 'Generasi 2',
  3: 'Generasi 3',
  4: 'Generasi 4',
  5: 'Generasi 5',
};

export default function TimelinePage() {
  const { members } = useFamilyData();
  const [selected, setSelected] = useState(null);
  const generations = useMemo(() => getAllGenerations(members), [members]);
  const genKeys = Object.keys(generations).sort((a, b) => a - b);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-[#0F172A] dark:text-white">
        Linimasa Generasi
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Perjalanan keluarga besar dari generasi ke generasi.
      </p>

      <div className="relative mt-10 border-l-2 border-[var(--color-border)] pl-8 dark:border-slate-700">
        {genKeys.map((gen, idx) => {
          const people = generations[gen].sort((a, b) => new Date(a.birthDate) - new Date(b.birthDate));
          const years = people.map((p) => new Date(p.birthDate).getFullYear()).filter(Boolean);
          const yearRange = years.length ? `${Math.min(...years)} – ${Math.max(...years)}` : '';

          return (
            <motion.div
              key={gen}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.35, delay: idx * 0.03 }}
              className="relative mb-12 last:mb-0"
            >
              <span className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#0F172A] bg-white dark:border-white dark:bg-[#020617]">
                <span className="h-2 w-2 rounded-full bg-[#0F172A] dark:bg-white" />
              </span>

              <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[#0F172A] dark:text-white">
                {genLabels[gen] || `Generasi ${gen}`}
              </h2>
              <p className="mb-4 text-xs text-slate-400">
                {people.length} anggota &middot; {yearRange}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {people.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="flex flex-col items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-[#0F172A]"
                  >
                    <img src={p.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <span className="line-clamp-2 text-xs font-medium leading-tight text-[#0F172A] dark:text-white">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(p.birthDate).getFullYear() || '?'}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {selected && (
        <ProfileModal member={selected} onClose={() => setSelected(null)} onNavigate={setSelected} />
      )}
    </div>
  );
}
