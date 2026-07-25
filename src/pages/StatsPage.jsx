import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, User, UserCheck, Layers, Home, HeartPulse, Sparkles } from 'lucide-react';
import { useFamilyData } from '../context/FamilyDataContext';
import { getStatistics } from '../utils/familyUtils';

export default function StatsPage() {
  const { members } = useFamilyData();
  const stats = useMemo(() => getStatistics(members), [members]);
  const maxGrowth = Math.max(...stats.growthData.map((d) => d.count), 1);

  const cards = [
    { label: 'Total Anggota Keluarga', value: stats.total, icon: Users },
    { label: 'Laki-laki', value: stats.male, icon: User },
    { label: 'Perempuan', value: stats.female, icon: User },
    { label: 'Jumlah Generasi', value: stats.genCount, icon: Layers },
    { label: 'Keluarga Inti', value: stats.coreFamilies, icon: Home },
    { label: 'Masih Hidup', value: stats.alive, icon: HeartPulse },
    { label: 'Telah Wafat', value: stats.deceased, icon: Sparkles },
    { label: 'Rasio Gender', value: `${stats.male}:${stats.female}`, icon: UserCheck },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-[#0F172A] dark:text-white">
        Statistik Keluarga
      </h1>
      <p className="mt-1 text-sm text-slate-400">Gambaran umum data silsilah keluarga besar.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0F172A]"
          >
            <c.icon size={18} className="mb-3 text-slate-400" />
            <p className="font-[var(--font-heading)] text-2xl font-semibold text-[#0F172A] dark:text-white">
              {c.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0F172A]">
        <h2 className="mb-1 font-[var(--font-heading)] text-base font-semibold text-[#0F172A] dark:text-white">
          Pertumbuhan Keluarga per Dekade
        </h2>
        <p className="mb-6 text-xs text-slate-400">Jumlah anggota keluarga berdasarkan dekade kelahiran.</p>

        <div className="flex h-52 items-end gap-3 overflow-x-auto pb-2">
          {stats.growthData.map((d, i) => (
            <div key={d.decade} className="flex flex-1 min-w-[40px] flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.count / maxGrowth) * 100}%` }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                className="flex w-full max-w-[36px] items-start justify-center rounded-t-md bg-gradient-to-t from-[#334155] to-[#0F172A] pt-1 dark:from-slate-600 dark:to-slate-400"
                style={{ minHeight: 4 }}
              >
                <span className="text-[10px] font-medium text-white">{d.count}</span>
              </motion.div>
              <span className="text-[10px] text-slate-400">{d.decade}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProportionCard title="Distribusi Gender" a={{ label: 'Laki-laki', value: stats.male }} b={{ label: 'Perempuan', value: stats.female }} />
        <ProportionCard title="Status Kehidupan" a={{ label: 'Masih Hidup', value: stats.alive }} b={{ label: 'Telah Wafat', value: stats.deceased }} />
      </div>
    </div>
  );
}

function ProportionCard({ title, a, b }) {
  const total = a.value + b.value || 1;
  const pctA = Math.round((a.value / total) * 100);

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0F172A]">
      <h3 className="mb-4 font-[var(--font-heading)] text-sm font-semibold text-[#0F172A] dark:text-white">{title}</h3>
      <div className="mb-2 flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="bg-[#0F172A] dark:bg-slate-300" style={{ width: `${pctA}%` }} />
        <div className="bg-slate-300 dark:bg-slate-600" style={{ width: `${100 - pctA}%` }} />
      </div>
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{a.label}: {a.value} ({pctA}%)</span>
        <span>{b.label}: {b.value} ({100 - pctA}%)</span>
      </div>
    </div>
  );
}
