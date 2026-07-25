import { useState, useEffect } from 'react';
import { Lock, LogOut } from 'lucide-react';
import { ADMIN_PASSWORD, ADMIN_SESSION_KEY } from '../../config/adminAuth';

export default function AdminAuthGate({ children }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (authed) sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  }, [authed]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Password salah. Coba lagi.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 py-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-[#0F172A]">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Lock size={18} className="text-slate-500 dark:text-slate-300" />
          </div>
          <h1 className="font-[var(--font-heading)] text-lg font-semibold text-[#0F172A] dark:text-white">
            Akses Panel Admin
          </h1>
          <p className="mt-1 text-sm text-slate-400">Masukkan password untuk melanjutkan.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-left">
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#0F172A] px-4 py-2.5 text-sm font-medium text-white hover:-translate-y-0.5 transition-transform dark:bg-slate-100 dark:text-[#0F172A]"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end px-5 pt-4 lg:px-8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-500"
        >
          <LogOut size={13} /> Keluar dari Admin
        </button>
      </div>
      {children}
    </div>
  );
}
