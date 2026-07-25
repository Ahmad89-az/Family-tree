import { useState, useMemo } from 'react';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';
import { useFamilyData } from '../context/FamilyDataContext';
import { searchMembers, getGeneration } from '../utils/familyUtils';
import ProfileModal from '../components/profile/ProfileModal';

export default function SearchPage() {
  const { members } = useFamilyData();
  const [query, setQuery] = useState('');
  const [genFilter, setGenFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const generationMap = useMemo(() => {
    const cache = new Map();
    const map = {};
    members.forEach((m) => (map[m.id] = getGeneration(members, m, cache)));
    return map;
  }, [members]);

  const results = useMemo(() => {
    let list = query.trim() ? searchMembers(members, query) : members;
    if (genFilter !== 'all') list = list.filter((m) => generationMap[m.id] === Number(genFilter));
    if (genderFilter !== 'all') list = list.filter((m) => m.gender === genderFilter);
    if (statusFilter !== 'all') {
      list = list.filter((m) => (statusFilter === 'alive' ? !m.deathDate : !!m.deathDate));
    }
    return list;
  }, [query, members, genFilter, genderFilter, statusFilter, generationMap]);

  const maxGen = Math.max(...Object.values(generationMap), 1);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-[#0F172A] dark:text-white">
        Cari Anggota Keluarga
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Cari berdasarkan nama, nama panggilan, orang tua, atau pasangan.
      </p>

      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ketik nama anggota keluarga..."
          className="w-full rounded-xl border border-[var(--color-border)] bg-white py-4 pl-12 pr-4 text-base text-[#0F172A] shadow-sm outline-none transition-shadow focus:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="flex items-center gap-1 text-slate-400"><Filter size={13} /> Filter:</span>
        <Select value={genFilter} onChange={setGenFilter} label="Semua Generasi">
          {Array.from({ length: maxGen }, (_, i) => i + 1).map((g) => (
            <option key={g} value={g}>Generasi {g}</option>
          ))}
        </Select>
        <Select value={genderFilter} onChange={setGenderFilter} label="Semua Gender">
          <option value="Male">Laki-laki</option>
          <option value="Female">Perempuan</option>
        </Select>
        <Select value={statusFilter} onChange={setStatusFilter} label="Semua Status">
          <option value="alive">Masih Hidup</option>
          <option value="deceased">Telah Wafat</option>
        </Select>
        <span className="ml-auto text-xs text-slate-400">{results.length} hasil</span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelected(m)}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-[#0F172A]"
          >
            <img src={m.photo} alt="" className="h-12 w-12 flex-shrink-0 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate font-medium text-[#0F172A] dark:text-white">{m.name}</p>
              <p className="flex items-center gap-1 truncate text-xs text-slate-400">
                <MapPin size={11} /> {m.address || '-'}
              </p>
              <p className="flex items-center gap-1 truncate text-xs text-slate-400">
                <Briefcase size={11} /> {m.occupation || '-'}
              </p>
            </div>
          </button>
        ))}
        {results.length === 0 && (
          <p className="col-span-full py-10 text-center text-slate-400">
            Tidak ada anggota keluarga yang cocok dengan pencarian.
          </p>
        )}
      </div>

      {selected && (
        <ProfileModal member={selected} onClose={() => setSelected(null)} onNavigate={setSelected} />
      )}
    </div>
  );
}

function Select({ value, onChange, label, children }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-xs text-[#0F172A] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    >
      <option value="all">{label}</option>
      {children}
    </select>
  );
}
