import { useState, useRef, useEffect } from 'react';
import { Plus, X, User } from 'lucide-react';

/**
 * A combobox for picking a relative (father/mother/spouse) that also lets the
 * user type a name that doesn't exist yet and create it on the fly.
 *
 * value format:
 *   ''            -> none selected
 *   '<id>'        -> an existing member's id
 *   'new:<Name>'  -> not created yet; will be created on form submit
 */
export default function PersonCombobox({ value, onChange, members, placeholder }) {
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

  const isNew = value?.startsWith('new:');
  const resolvedName = !value
    ? ''
    : isNew
    ? value.slice(4)
    : members.find((m) => m.id === value)?.name || '';

  // Selected state: show a resolved "chip" instead of the search input.
  if (value) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
        <User size={14} className="flex-shrink-0 text-slate-400" />
        <span className="flex-1 truncate text-[#0F172A] dark:text-white">{resolvedName}</span>
        {isNew && (
          <span className="flex-shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            Baru
          </span>
        )}
        <button
          type="button"
          onClick={() => { onChange(''); setQuery(''); }}
          className="flex-shrink-0 text-slate-400 hover:text-red-500"
          aria-label="Hapus pilihan"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  const trimmed = query.trim();
  const matches = trimmed
    ? members.filter((m) => m.name.toLowerCase().includes(trimmed.toLowerCase())).slice(0, 8)
    : [];
  const exactMatch = members.some((m) => m.name.toLowerCase() === trimmed.toLowerCase());

  return (
    <div ref={wrapRef} className="relative">
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder || 'Ketik nama, atau nama baru...'}
        className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />

      {open && trimmed && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-[var(--color-border)] bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {matches.map((m) => (
            <button
              type="button"
              key={m.id}
              onClick={() => { onChange(m.id); setQuery(''); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <img src={m.photo} alt="" className="h-6 w-6 rounded-full object-cover" />
              <span className="text-[#0F172A] dark:text-white">{m.name}</span>
            </button>
          ))}

          {!exactMatch && (
            <button
              type="button"
              onClick={() => { onChange(`new:${trimmed}`); setQuery(''); setOpen(false); }}
              className="flex w-full items-center gap-2 border-t border-[var(--color-border)] px-3 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 dark:border-slate-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
            >
              <Plus size={14} /> Buat anggota baru: "{trimmed}"
            </button>
          )}

          {matches.length === 0 && exactMatch && (
            <p className="px-3 py-2 text-xs text-slate-400">Anggota ini sudah dipilih di atas.</p>
          )}
        </div>
      )}
    </div>
  );
}