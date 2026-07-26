import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

/**
 * Search box for jumping the tree view to start rendering from ANY member,
 * not just formal "root" ancestors (people without recorded parents).
 */
export default function PersonJumpSearch({ members, currentId, onSelect }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = members.find((m) => m.id === currentId);
  const trimmed = query.trim();
  const matches = trimmed
    ? members.filter((m) => m.name.toLowerCase().includes(trimmed.toLowerCase())).slice(0, 10)
    : members.slice(0, 10);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-sm text-[#0F172A] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        <Search size={13} className="text-slate-400" />
        {current?.name || 'Pilih anggota...'}
        <ChevronDown size={13} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-64 rounded-lg border border-[var(--color-border)] bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama anggota keluarga..."
            className="w-full rounded-t-lg border-b border-[var(--color-border)] px-3 py-2 text-sm text-[#0F172A] outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <div className="max-h-64 overflow-y-auto">
            {matches.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-400">Tidak ada nama yang cocok.</p>
            )}
            {matches.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => { onSelect(m.id); setQuery(''); setOpen(false); }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${
                  m.id === currentId ? 'bg-slate-50 dark:bg-slate-700' : ''
                }`}
              >
                <img src={m.photo} alt="" className="h-6 w-6 rounded-full object-cover" />
                <span className="text-[#0F172A] dark:text-white">{m.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}