import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, Search, ArrowRight } from 'lucide-react';
import { useFamilyData } from '../context/FamilyDataContext';
import { getStatistics } from '../utils/familyUtils';

export default function LandingPage() {
  const { members } = useFamilyData();
  const stats = useMemo(() => getStatistics(members), [members]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-70 dark:opacity-40"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(51,65,85,0.08), transparent 45%), radial-gradient(circle at 80% 0%, rgba(15,23,42,0.06), transparent 40%)',
          }}
        />
        <div className="mx-auto max-w-5xl px-5 pb-20 pt-16 text-center lg:px-8 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3.5 py-1.5 text-xs font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <GitBranch size={13} /> {stats.genCount} Generasi &middot; {stats.total} Anggota Keluarga
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-[var(--font-heading)] text-4xl font-bold tracking-tight text-[#0F172A] dark:text-white sm:text-5xl lg:text-6xl"
          >
            Silsilah Keluarga Besar Dato Kui
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mx-auto mt-5 max-w-xl text-base text-slate-500 dark:text-slate-400 sm:text-lg"
          >
            Mendokumentasikan sejarah keluarga lintas generasi untuk masa depan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/pohon-keluarga"
              className="flex items-center gap-2 rounded-lg bg-[#0F172A] px-6 py-3 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-100 dark:text-[#0F172A]"
            >
              Jelajahi Silsilah <ArrowRight size={16} />
            </Link>
            <Link
              to="/cari"
              className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-medium text-[#0F172A] shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <Search size={16} /> Cari Anggota Keluarga
            </Link>
          </motion.div>
        </div>

        {/* Family tree illustration - simple, refined SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-3xl px-5 pb-4 lg:px-8"
        >
          <TreeIllustration />
        </motion.div>
      </section>

      {/* Quick stats strip */}
      <section className="border-y border-[var(--color-border)] bg-white/60 py-10 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 sm:grid-cols-4 lg:px-8">
          {[
            { label: 'Anggota Keluarga', value: stats.total },
            { label: 'Generasi', value: stats.genCount },
            { label: 'Keluarga Inti', value: stats.coreFamilies },
            { label: 'Masih Hidup', value: stats.alive },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-[var(--font-heading)] text-3xl font-semibold text-[#0F172A] dark:text-white">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0F172A]"
            >
              <h3 className="font-[var(--font-heading)] text-base font-semibold text-[#0F172A] dark:text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const features = [
  { title: 'Pohon Keluarga Interaktif', desc: 'Jelajahi ribuan anggota keluarga dengan zoom, geser, dan lipat cabang keturunan.' },
  { title: 'Pencarian Instan', desc: 'Temukan anggota keluarga berdasarkan nama, orang tua, atau pasangan dalam sekejap.' },
  { title: 'Linimasa Generasi', desc: 'Lihat perkembangan keluarga besar dari generasi ke generasi secara kronologis.' },
  { title: 'Statistik Keluarga', desc: 'Dashboard ringkas menampilkan jumlah anggota, gender, dan status kehidupan.' },
  { title: 'Mode Gelap', desc: 'Tampilan nyaman di mata untuk digunakan siang maupun malam hari.' },
  { title: 'Panel Admin', desc: 'Tambah, ubah, dan kelola data anggota keluarga dengan mudah, termasuk impor/ekspor.' },
];

function TreeIllustration() {
  return (
    <svg viewBox="0 0 800 220" className="h-auto w-full" role="img" aria-label="Ilustrasi pohon keluarga">
      <g stroke="#CBD5E1" strokeWidth="1.5" className="dark:opacity-40">
        <line x1="400" y1="40" x2="400" y2="70" />
        <line x1="220" y1="70" x2="580" y2="70" />
        <line x1="220" y1="70" x2="220" y2="100" />
        <line x1="400" y1="70" x2="400" y2="100" />
        <line x1="580" y1="70" x2="580" y2="100" />
        <line x1="140" y1="130" x2="300" y2="130" />
        <line x1="220" y1="100" x2="220" y2="130" />
        <line x1="140" y1="130" x2="140" y2="160" />
        <line x1="300" y1="130" x2="300" y2="160" />
        <line x1="520" y1="130" x2="640" y2="130" />
        <line x1="580" y1="100" x2="580" y2="130" />
        <line x1="520" y1="130" x2="520" y2="160" />
        <line x1="640" y1="130" x2="640" y2="160" />
      </g>
      {[
        [400, 30], [220, 100], [400, 100], [580, 100],
        [140, 160], [300, 160], [520, 160], [640, 160],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 0 ? 16 : 12} fill="#0F172A" className="dark:fill-slate-300" opacity={0.9 - i * 0.04} />
      ))}
    </svg>
  );
}
