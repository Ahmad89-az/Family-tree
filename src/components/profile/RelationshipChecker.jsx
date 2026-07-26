import { useState, useRef, useEffect } from 'react';
import { Users2, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { getRelationship } from '../../utils/familyUtils';

export default function RelationshipChecker({ member, members }) {
  const [open, setOpen] = useState(false);
  const [compareId, setCompareId] = useState('');
  const [query, setQuery] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setPickerOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const otherMembers = members.filter((m) => m.id !== member.id);
  const compareTarget = otherMembers.find((m) => m.id === compareId);
  const trimmed = query.trim();
  const matches = trimmed
    ? otherMembers.filter((m) => m.name.toLowerCase().includes(trimmed.toLowerCase())).slice(0, 8)
    : otherMembers.slice(0, 8);

  const result = compareId ? getRelationship(members, member.id, compareId) : null;

  return (
    <div className="rounded-xl border border-[var(--color-border)] dark:border-slate-700">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[#0F172A] dark:text-white"
      >
        <span className="flex items-center gap-2">
          <Users2 size={15} className="text-slate-400" /> Cek Hubungan Keluarga
        </span>
        {open ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
      </button>

      {open && (
        <div className="border-t border-[var(--color-border)] px-4 py-4 dark:border-slate-700">
          <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Bandingkan {member.name} dengan:
          </label>
          <div ref={wrapRef} className="relative">
            <button
              type="button"
              onClick={() => setPickerOpen((o) => !o)}
              className="flex w-full items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[#0F172A] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <Search size={14} className="text-slate-400" />
              {compareTarget?.name || 'Pilih anggota keluarga...'}
            </button>

            {pickerOpen && (
              <div className="absolute z-20 mt-1 w-full rounded-lg border border-[var(--color-border)] bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari nama..."
                  className="w-full rounded-t-lg border-b border-[var(--color-border)] px-3 py-2 text-sm text-[#0F172A] outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <div className="max-h-56 overflow-y-auto">
                  {matches.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => { setCompareId(m.id); setQuery(''); setPickerOpen(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <img src={m.photo} alt="" className="h-6 w-6 rounded-full object-cover" />
                      <span className="text-[#0F172A] dark:text-white">{m.name}</span>
                    </button>
                  ))}
                  {matches.length === 0 && <p className="px-3 py-2 text-xs text-slate-400">Tidak ada nama cocok.</p>}
                </div>
              </div>
            )}
          </div>

          {compareTarget && result && (
            <div className="mt-4 space-y-3">
              {result.none && (
                <p className="text-sm text-slate-400">
                  Belum ditemukan hubungan leluhur antara {member.name} dan {compareTarget.name} dari data yang ada saat ini.
                </p>
              )}

              {result.relations?.map((rel, i) => (
                <div key={i} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
                  <p className="text-slate-700 dark:text-slate-200">
                    <span className="font-semibold">{compareTarget.name}</span> adalah{' '}
                    <span className="font-semibold text-[#0F172A] dark:text-white">{rel.aToB}</span> dari{' '}
                    <span className="font-semibold">{member.name}</span>
                  </p>
                  {rel.via?.length > 0 && (
                    <p className="mt-1 text-xs text-slate-400">
                      Lewat leluhur bersama: {rel.via.map((v) => v.name).join(', ')}
                    </p>
                  )}
                  {rel.pathA?.[0]?.length > 1 && (
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      {rel.pathA[0].map((p) => p.name).join(' → ')}
                      {rel.pathB?.[0]?.length > 1 && (
                        <> {' '}&larr;{' '}{rel.pathB[0].slice(1).reverse().map((p) => p.name).join(' → ')}</>
                      )}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}