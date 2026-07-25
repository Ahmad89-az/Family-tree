import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Download, Upload, RotateCcw, Search, X } from 'lucide-react';
import { useFamilyData } from '../context/FamilyDataContext';
import MemberFormModal from '../components/admin/MemberFormModal';

export default function AdminPage() {
  const { members, deleteMember, importData, exportData, resetToSeed } = useFamilyData();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null); // member object or 'new' or null
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileInputRef = useRef(null);

  const filtered = members.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `silsilah-keluarga-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        importData(data);
        alert('Data berhasil diimpor.');
      } catch {
        alert('Gagal membaca file JSON. Pastikan format file benar.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-[#0F172A] dark:text-white">
            Panel Admin
          </h1>
          <p className="mt-1 text-sm text-slate-400">Kelola data anggota keluarga: tambah, ubah, hapus, impor, dan ekspor.</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="flex items-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-transform dark:bg-slate-100 dark:text-[#0F172A]"
        >
          <Plus size={16} /> Tambah Anggota
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari anggota untuk dikelola..."
            className="w-full rounded-lg border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <button onClick={handleExport} className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Download size={15} /> Ekspor JSON
        </button>
        <button onClick={handleImportClick} className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Upload size={15} /> Impor JSON
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
        <button
          onClick={() => confirm('Kembalikan ke data awal? Perubahan yang belum diekspor akan hilang.') && resetToSeed()}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <RotateCcw size={15} /> Reset Data
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        Data tersimpan otomatis di penyimpanan lokal browser ini. Gunakan "Ekspor JSON" secara berkala sebagai backup.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--color-border)] dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400 dark:bg-slate-800/60">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Lahir</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Alamat</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] dark:divide-slate-700">
            {filtered.map((m) => (
              <tr key={m.id} className="bg-white dark:bg-[#0F172A]">
                <td className="flex items-center gap-2.5 px-4 py-3">
                  <img src={m.photo} alt="" className="h-8 w-8 rounded-full object-cover" />
                  <span className="font-medium text-[#0F172A] dark:text-white">{m.name}</span>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{m.gender === 'Male' ? 'Laki-laki' : 'Perempuan'}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{m.birthDate || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${m.deathDate ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                    {m.deathDate ? 'Wafat' : 'Hidup'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{m.address || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => setEditing(m)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0F172A] dark:hover:bg-slate-700 dark:hover:text-white" aria-label="Ubah">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setConfirmDelete(m)} className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30" aria-label="Hapus">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">Tidak ada anggota ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <MemberFormModal
          member={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0F172A]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h3 className="font-[var(--font-heading)] text-base font-semibold text-[#0F172A] dark:text-white">Hapus Anggota?</h3>
              <button onClick={() => setConfirmDelete(null)} className="text-slate-400"><X size={18} /></button>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              "{confirmDelete.name}" akan dihapus permanen dari silsilah, termasuk seluruh hubungan keluarga terkait.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
                Batal
              </button>
              <button
                onClick={() => { deleteMember(confirmDelete.id); setConfirmDelete(null); }}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
